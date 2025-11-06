#!/usr/bin/env node

/**
 * Quick test for single-port server fixes
 */

const { spawn } = require('child_process');

console.log('🧪 Тестирование single-port сервера...');

// Запускаем сервер на 5 секунд
const serverProcess = spawn('npm', ['run', 'start:single-port'], {
  cwd: __dirname,
  stdio: ['pipe', 'pipe', 'pipe']
});

let hasBuild = false;
let hasFrontend = false;
let hasProxy = false;
let hasReady = false;

serverProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('STDOUT:', output.trim());

  if (output.includes('Frontend собран')) hasBuild = true;
  if (output.includes('Frontend сервер запущен')) hasFrontend = true;
  if (output.includes('API Proxy сервер запущен')) hasProxy = true;
  if (output.includes('Single Port Server готов')) hasReady = true;
});

serverProcess.stderr.on('data', (data) => {
  console.log('STDERR:', data.toString().trim());
});

// Останавливаем через 10 секунд
setTimeout(() => {
  serverProcess.kill('SIGTERM');

  setTimeout(() => {
    console.log('\n📊 РЕЗУЛЬТАТЫ ТЕСТА:');
    console.log('Build:', hasBuild ? '✅' : '❌');
    console.log('Frontend:', hasFrontend ? '✅' : '❌');
    console.log('Proxy:', hasProxy ? '✅' : '❌');
    console.log('Ready:', hasReady ? '✅' : '❌');

    if (hasBuild && hasFrontend && hasProxy && hasReady) {
      console.log('\n🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ!');
    } else {
      console.log('\n❌ ЕСТЬ ПРОБЛЕМЫ!');
    }

    process.exit(hasReady ? 0 : 1);
  }, 1000);
}, 10000);
