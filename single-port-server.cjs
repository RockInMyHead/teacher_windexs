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

  // Проверяем что прокси настроен (обязательно)
  const PROXY_URL = process.env.PROXY_URL;
  if (!PROXY_URL) {
    console.error('❌ ОШИБКА: PROXY_URL не установлен! Прокси ОБЯЗАТЕЛЕН для OpenAI API.');
    process.exit(1);
  }

  // Парсим URL прокси
  const proxyUrl = new URL(PROXY_URL);
  const proxyConfig = {
    host: proxyUrl.hostname,
    port: parseInt(proxyUrl.port),
    auth: proxyUrl.username && proxyUrl.password ? {
      username: proxyUrl.username,
      password: proxyUrl.password
    } : undefined
  };

  const proxyAgent = new HttpsProxyAgent(PROXY_URL);
  
  console.log(`🌐 Прокси настроен:`);
  console.log(`   Host: ${proxyConfig.host}`);
  console.log(`   Port: ${proxyConfig.port}`);
  console.log(`   Auth: ${proxyConfig.auth ? '✅ Да' : '❌ Нет'}`);

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

  // Test proxy connection
  app.get('/api/test-proxy', async (req, res) => {
    console.log('🧪 Тестирование прокси соединения...');
    console.log('🔍 Прокси:', `${proxyConfig.host}:${proxyConfig.port}`);
    
    try {
      // Тестируем прокси на простом запросе
      const response = await axios.get('https://httpbin.org/ip', {
        proxy: proxyConfig,
        httpsAgent: proxyAgent,
        timeout: 10000
      });
      
      console.log('✅ Прокси работает! IP:', response.data.origin);
      res.json({
        success: true,
        message: 'Proxy is working',
        proxy_ip: response.data.origin,
        proxy_config: `${proxyConfig.host}:${proxyConfig.port}`
      });
    } catch (error) {
      console.error('❌ Прокси НЕ работает:', error.message);
      if (error.response?.data) {
        console.error('📄 Детали:', error.response.data);
      }
      res.status(500).json({
        success: false,
        message: 'Proxy connection failed',
        error: error.message,
        details: error.response?.data,
        proxy_config: `${proxyConfig.host}:${proxyConfig.port}`
      });
    }
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

    console.log('🔑 API ключ найден, делаем запрос к OpenAI через прокси...');
    console.log('🔍 Прокси:', `${proxyConfig.host}:${proxyConfig.port}`);

    try {
      const response = await axios.get('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'User-Agent': 'curl/7.68.0', // Имитируем curl
          'Accept': '*/*'
        },
        proxy: proxyConfig,
        timeout: 30000,
        // Отключаем автоматическое сжатие
        decompress: true,
        // Не добавляем лишние заголовки
        validateStatus: (status) => status < 500
      });

      console.log('✅ Успешный ответ от OpenAI через прокси');
      res.json(response.data);

    } catch (error) {
      console.error('❌ Ошибка запроса к OpenAI:', error.response?.status, error.message);
      
      // Логируем детали ошибки
      if (error.response?.data) {
        console.error('📄 Детали ошибки от OpenAI:', JSON.stringify(error.response.data, null, 2));
      }

      res.status(500).json({
        error: 'OpenAI API error',
        status: error.response?.status,
        message: error.message,
        details: error.response?.data,
        key_loaded: !!process.env.OPENAI_API_KEY,
        proxy_configured: !!PROXY_URL
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
          'User-Agent': 'curl/7.68.0',
          'Accept': '*/*'
        },
        proxy: proxyConfig,
        timeout: 30000,
        decompress: true,
        validateStatus: (status) => status < 500
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
          'User-Agent': 'curl/7.68.0',
          'Accept': '*/*'
        },
        proxy: proxyConfig,
        timeout: 30000,
        decompress: true,
        validateStatus: (status) => status < 500
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
          'User-Agent': 'curl/7.68.0',
          'Accept': '*/*'
        },
        proxy: proxyConfig,
        responseType: 'stream',
        timeout: 30000,
        decompress: true,
        validateStatus: (status) => status < 500
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
