#!/usr/bin/env node

/**
 * Single Port Server - запускает frontend и API proxy на одном порту 1031
 * Для случаев, когда доступен только один порт
 */

require('dotenv').config(); // Загружаем переменные окружения

const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

console.log('🚀 Запуск TRUE Single Port Server (ТОЛЬКО ПОРТ 1031)');
console.log('================================================');

// Устанавливаем переменные окружения
process.env.NODE_ENV = 'production';
process.env.PORT = '1031';
process.env.PROXY_PORT = '1031';

console.log('📊 Конфигурация TRUE SINGLE-PORT:');
console.log('  - Единственный порт: 1031');
console.log('  - Frontend + API на одном порту');
console.log('  - OpenAI API Key:', process.env.OPENAI_API_KEY ? '✅ Установлен' : '❌ НЕ установлен');
console.log('');

// Собираем frontend проект
console.log('🔨 Сборка Frontend проекта...');
const buildProcess = spawn('npm', ['run', 'build'], {
  cwd: __dirname,
  stdio: ['pipe', 'pipe', 'pipe'],
  env: process.env
});

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Frontend собран');
    startSinglePortServer();
  } else {
    console.error('❌ Ошибка сборки frontend');
    process.exit(1);
  }
});

function startSinglePortServer() {
  console.log('🚀 Запуск единого сервера на порту 1031...');

  // Создаем новый Express app
  const app = express();

  // Настраиваем статические файлы frontend
  app.use(express.static(path.join(__dirname, 'dist')));

  // Настраиваем middleware
  const cors = require('cors');
  const axios = require('axios');

  // Проверяем что прокси настроен
  const PROXY_URL = process.env.PROXY_URL;
  if (!PROXY_URL) {
    console.error('❌ ОШИБКА: PROXY_URL не установлен! Прокси ОБЯЗАТЕЛЕН для OpenAI API.');
    process.exit(1);
  }

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Diagnostic route
  app.get('/api/diagnostic', (req, res) => {
    res.json({
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        PROXY_PORT: process.env.PROXY_PORT
      },
      api_key: {
        loaded: !!process.env.OPENAI_API_KEY,
        prefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 20) + '...' : null
      },
      proxy: {
        configured: !!process.env.PROXY_URL,
        url: process.env.PROXY_URL ? process.env.PROXY_URL.replace(/:([^:]+)@/, ':***@') : null
      }
    });
  });

  // OpenAI API routes
  app.get('/api/models', async (req, res) => {
    console.log('📋 Запрос к /api/models получен');

    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY не найден в переменных окружения');
      return res.status(500).json({
        error: 'API key not configured',
        details: 'OPENAI_API_KEY is missing'
      });
    }

    console.log('🔑 API ключ найден, делаем запрос к OpenAI...');

    try {
      // Сначала пробуем через прокси
      console.log('🌐 Пробуем запрос через прокси...');
      const response = await axios.get('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        proxy: {
          host: '45.147.180.58',
          port: 8000,
          auth: {
            username: 'pb3jms',
            password: '85pNLX'
          }
        },
        timeout: 10000
      });

      console.log('✅ Успешный ответ от OpenAI через прокси');
      res.json(response.data);

    } catch (proxyError) {
      console.error('❌ Ошибка прокси:', proxyError.response?.status, proxyError.message);

      // Если прокси не работает, пробуем напрямую (только для диагностики)
      console.log('🔄 Пробуем запрос напрямую к OpenAI...');
      try {
        const directResponse = await axios.get('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          timeout: 10000
        });

        console.log('✅ Успешный прямой ответ от OpenAI (прокси не нужен)');
        res.json(directResponse.data);

      } catch (directError) {
        console.error('❌ Прямой запрос тоже failed:', directError.response?.status, directError.message);

        res.status(500).json({
          error: 'OpenAI API unavailable',
          proxy_error: {
            status: proxyError.response?.status,
            message: proxyError.message
          },
          direct_error: {
            status: directError.response?.status,
            message: directError.message
          },
          key_loaded: !!process.env.OPENAI_API_KEY,
          proxy_url: process.env.PROXY_URL
        });
      }
    }
  });

  // Chat completions
  app.post('/api/chat/completions', async (req, res) => {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', req.body, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        proxy: {
          host: '45.147.180.58',
          port: 8000,
          auth: {
            username: 'pb3jms',
            password: '85pNLX'
          }
        },
      });
      res.json(response.data);
    } catch (error) {
      console.error('Chat completions error:', error);
      res.status(error.response?.status || 500).json({
        error: 'OpenAI API error',
        details: error.message
      });
    }
  });

  // Image generations
  app.post('/api/images/generations', async (req, res) => {
    try {
      const response = await axios.post('https://api.openai.com/v1/images/generations', req.body, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        proxy: {
          host: '45.147.180.58',
          port: 8000,
          auth: {
            username: 'pb3jms',
            password: '85pNLX'
          }
        },
      });
      res.json(response.data);
    } catch (error) {
      console.error('Images generations error:', error);
      res.status(error.response?.status || 500).json({
        error: 'OpenAI Images API error',
        details: error.message
      });
    }
  });

  // Text-to-Speech
  app.post('/api/audio/speech', async (req, res) => {
    try {
      const response = await axios.post('https://api.openai.com/v1/audio/speech', req.body, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        proxy: {
          host: '45.147.180.58',
          port: 8000,
          auth: {
            username: 'pb3jms',
            password: '85pNLX'
          }
        },
        responseType: 'stream',
      });

      res.setHeader('Content-Type', 'audio/mpeg');
      response.data.pipe(res);
    } catch (error) {
      console.error('TTS error:', error);
      res.status(error.response?.status || 500).json({
        error: 'OpenAI TTS API error',
        details: error.message
      });
    }
  });

  // SPA fallback - ОТПРАВЛЯЕМ ПОСЛЕДНИМ
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

  // Запускаем сервер
  const server = app.listen(1031, () => {
    console.log('✅ Единый сервер запущен на порту 1031');
    console.log('');
    console.log('🎉 TRUE SINGLE-PORT SERVER ГОТОВ!');
    console.log('==================================');
    console.log('🌐 Доступно на: http://localhost:1031');
    console.log('📡 API: http://localhost:1031/api/*');
    console.log('💻 Frontend: http://localhost:1031/');
    console.log('💚 Health: http://localhost:1031/health');
    console.log('');
    console.log('ТОЛЬКО ОДИН ПОРТ: 1031 ✅');
    console.log('');
    console.log('Для остановки: Ctrl+C');
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Завершение работы...');
    server.close(() => {
      console.log('✅ Сервер остановлен');
      process.exit(0);
    });
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Завершение работы...');
    server.close(() => {
      console.log('✅ Сервер остановлен');
      process.exit(0);
    });
  });
}
