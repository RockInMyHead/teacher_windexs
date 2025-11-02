const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PROXY_PORT || 4002;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Proxy endpoint for OpenAI Chat Completions
app.post('/api/chat/completions', async (req, res) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
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

// Proxy endpoint for OpenAI Text-to-Speech (TTS)
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

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Chat completions: http://localhost:${PORT}/api/chat/completions`);
  console.log(`🖼️  Image generations: http://localhost:${PORT}/api/images/generations`);
  console.log(`🎵 Text-to-Speech: http://localhost:${PORT}/api/openai/tts`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
});
