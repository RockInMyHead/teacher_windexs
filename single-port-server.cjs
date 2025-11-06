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

  // Импортируем proxy-server после сборки
  const proxyApp = require('./proxy-server.cjs');

  // Добавляем статические файлы frontend
  proxyApp.use(express.static(path.join(__dirname, 'dist')));

  // SPA fallback - отправляем index.html для всех не-API маршрутов
  proxyApp.get('*', (req, res) => {
    // Пропускаем API маршруты
    if (req.path.startsWith('/api') || req.path === '/health') {
      return;
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

  // Запускаем сервер на порту 1031
  const server = proxyApp.listen(1031, () => {
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
