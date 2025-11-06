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
  const { HttpsProxyAgent } = require('https-proxy-agent');

  // Настройки
  const PROXY_URL = process.env.PROXY_URL;
  if (!PROXY_URL) {
    console.error('❌ ОШИБКА: PROXY_URL не установлен! Прокси ОБЯЗАТЕЛЕН для OpenAI API.');
    process.exit(1);
  }
  const proxyAgent = new HttpsProxyAgent(PROXY_URL);

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // OpenAI API routes
  app.get('/api/models', async (req, res) => {
    try {
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
        httpsAgent: proxyAgent,
      });
      res.json(response.data);
    } catch (error) {
      console.error('Proxy server models error:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message,
        status: error.response?.status,
        key_loaded: !!process.env.OPENAI_API_KEY
      });
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
        httpsAgent: proxyAgent,
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
        httpsAgent: proxyAgent,
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
        httpsAgent: proxyAgent,
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
