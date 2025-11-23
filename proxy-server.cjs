require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

const app = express();
const PORT = process.env.PROXY_PORT || process.env.PORT || 1031;

// Proxy configuration (ОБЯЗАТЕЛЬНО для всех OpenAI запросов)
const PROXY_URL = process.env.PROXY_URL;
if (!PROXY_URL) {
  console.error('❌ ОШИБКА: PROXY_URL не установлен! Прокси ОБЯЗАТЕЛЕН для OpenAI API.');
  process.exit(1);
}
const proxyAgent = new HttpsProxyAgent(PROXY_URL);

// Axios proxy configuration
const proxyConfig = {
  host: '45.147.180.58',
  port: 8000,
  auth: {
    username: 'pb3jms',
    password: '85pNLX'
  }
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Frontend proxy middleware - перенаправляем не-API запросы на frontend
app.use(async (req, res, next) => {
  // Если это не API запрос и не health check, проксируем на frontend
  if (!req.path.startsWith('/api') && req.path !== '/health') {
    try {
      // Проксируем на frontend сервер (порт 1032)
      const frontendUrl = `http://localhost:1032${req.originalUrl}`;

      // Фильтруем заголовки - убираем проблемные для fetch
      const filteredHeaders = {};
      Object.keys(req.headers).forEach(key => {
        const lowerKey = key.toLowerCase();
        // Пропускаем заголовки соединения и другие проблемные
        if (!['connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization', 'te', 'trailers', 'transfer-encoding', 'upgrade'].includes(lowerKey)) {
          filteredHeaders[key] = req.headers[key];
        }
      });

      const response = await fetch(frontendUrl, {
        method: req.method,
        headers: {
          ...filteredHeaders,
          host: 'localhost:1032',
        },
        body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
      });

      // Копируем заголовки ответа
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() !== 'content-encoding') {
          res.setHeader(key, value);
        }
      });

      res.status(response.status);
      const arrayBuffer = await response.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));

    } catch (error) {
      console.error('Frontend proxy error:', error);
      res.status(500).send('Frontend proxy error');
    }
    return;
  }

  next();
});

// Proxy endpoint for OpenAI Chat Completions
app.post('/api/chat/completions', async (req, res) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      proxy: proxyConfig,
      httpsAgent: proxyAgent,
    });

    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error('Proxy server error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Proxy endpoint for OpenAI Image Generations (DALL-E)
app.post('/api/images/generations', async (req, res) => {
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(req.body),
      agent: proxyAgent,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI Images API Error:', response.status, errorText);
      return res.status(response.status).json({ error: 'OpenAI Images API error', details: errorText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy server images error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Proxy endpoint for OpenAI Models
app.get('/api/models', async (req, res) => {
  try {
    const response = await axios.get('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      proxy: proxyConfig,
      httpsAgent: proxyAgent,
    });

    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error('Proxy server models error:', error);
    console.error('Error details:', error.response?.status, error.response?.statusText);
    console.error('API Key used:', process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET');
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
      status: error.response?.status,
      key_loaded: !!process.env.OPENAI_API_KEY
    });
  }
});

// Proxy endpoint for OpenAI Audio Speech (TTS)
app.post('/api/audio/speech', async (req, res) => {
  try {
    console.log('🎵 [TTS] Получен запрос на синтез речи:', req.body);

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(req.body),
      agent: proxyAgent,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI TTS API Error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'TTS API error',
        details: errorText,
        status: response.status
      });
    }

    // Для audio response нужно передать binary data
    const buffer = await response.arrayBuffer();
    res.set({
      'Content-Type': response.headers.get('content-type') || 'audio/mpeg',
      'Content-Length': buffer.byteLength,
    });
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Proxy server TTS error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Proxy endpoint for OpenAI Text-to-Speech (TTS) - legacy
app.post('/api/openai/tts', async (req, res) => {
  try {
    console.log('🎵 [TTS] Получен запрос на синтез речи:', req.body);

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(req.body),
      agent: proxyAgent,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI TTS API Error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'TTS API error',
        details: errorText,
        status: response.status
      });
    }

    // TTS API возвращает аудио файл, поэтому передаем поток напрямую
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    // Копируем остальные заголовки
    response.headers.forEach((value, key) => {
      if (!['content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    // Передаем аудио поток клиенту
    response.body.pipe(res);

    console.log('✅ [TTS] Аудио файл успешно отправлен клиенту');
  } catch (error) {
    console.error('❌ Proxy server TTS error:', error);
    res.status(500).json({
      error: 'TTS API error: 500',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Экспортируем app для использования в single-port-server
module.exports = app;

console.log(`🔧 Proxy middleware ready (port: ${PORT})`);
console.log(`🌐 ОБЯЗАТЕЛЬНЫЙ прокси для OpenAI: ${PROXY_URL}`);
console.log(`⚡ Все API запросы идут через прокси`);

// Запуск сервера если файл запущен напрямую (для systemd)
if (require.main === module) {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Proxy server running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  });

  // Обработка ошибок
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} уже занят!`);
      process.exit(1);
    } else {
      console.error('❌ Server error:', error);
      process.exit(1);
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 Получен SIGTERM, завершаем работу...');
    server.close(() => {
      console.log('✅ Сервер остановлен');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('🛑 Получен SIGINT, завершаем работу...');
    server.close(() => {
      console.log('✅ Сервер остановлен');
      process.exit(0);
    });
  });

  // Предотвращаем завершение процесса при необработанных исключениях
  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    // Не завершаем процесс, только логируем
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    // Не завершаем процесс, только логируем
  });
}
