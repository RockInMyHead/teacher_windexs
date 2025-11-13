#!/usr/bin/env node

/**
 * Single Port Server - запускает frontend и API proxy на одном порту 1031
 * Для случаев, когда доступен только один порт
 */

require('dotenv').config(); // Загружаем переменные окружения

const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

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

  // Инициализируем базу данных
  const Database = require('better-sqlite3');
  const dbPath = path.join(__dirname, 'teacher.db');
  const db = new Database(dbPath);
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');
  console.log('✅ SQLite Database connected at:', dbPath);

  // Создаём таблицы БД при первом запуске
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        cefr_level TEXT DEFAULT 'A1',
        total_lessons_completed INTEGER DEFAULT 0,
        total_assessments_taken INTEGER DEFAULT 0,
        streak_days INTEGER DEFAULT 0,
        last_activity_date TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        level TEXT NOT NULL,
        category TEXT,
        duration_weeks INTEGER,
        lesson_count INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER NOT NULL,
        lesson_number INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT,
        difficulty TEXT,
        duration_minutes INTEGER,
        is_active BOOLEAN DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS user_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        lesson_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        status TEXT DEFAULT 'not_started',
        progress_percentage INTEGER DEFAULT 0,
        attempts INTEGER DEFAULT 0,
        started_at TEXT,
        completed_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        UNIQUE(user_id, lesson_id)
      );

      CREATE TABLE IF NOT EXISTS assessments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        lesson_id INTEGER,
        assessment_type TEXT NOT NULL,
        cefr_level TEXT,
        total_questions INTEGER,
        correct_answers INTEGER,
        score_percentage INTEGER,
        duration_seconds INTEGER,
        timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS assessment_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        assessment_id INTEGER NOT NULL,
        question_number INTEGER,
        concept TEXT,
        prompt TEXT,
        user_answer TEXT,
        correct_answer TEXT,
        is_correct BOOLEAN,
        FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        achievement_type TEXT NOT NULL,
        title TEXT,
        description TEXT,
        earned_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, achievement_type)
      );

      CREATE TABLE IF NOT EXISTS user_preferences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL UNIQUE,
        tts_enabled BOOLEAN DEFAULT 1,
        voice_chat_enabled BOOLEAN DEFAULT 1,
        preferred_language TEXT DEFAULT 'ru',
        daily_goal_minutes INTEGER DEFAULT 30,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON user_progress(lesson_id);
      CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
      CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
      CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
      CREATE INDEX IF NOT EXISTS idx_assessment_questions_assessment_id ON assessment_questions(assessment_id);
    `);
    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Error initializing database tables:', error.message);
  }

  // Создаем новый Express app
  const app = express();

  // Настраиваем статические файлы frontend
  app.use(express.static(path.join(__dirname, 'dist')));

  // Настраиваем middleware
  const cors = require('cors');
  const axios = require('axios');
  const https = require('https');

  // Проверяем что прокси настроен (обязательно)
  const PROXY_URL = process.env.PROXY_URL;
  if (!PROXY_URL) {
    console.warn('⚠️ ВНИМАНИЕ: PROXY_URL не установлен! Прокси ОБЯЗАТЕЛЕН для OpenAI API.');
    console.warn('🔧 Для тестирования запускаемся без прокси...');
    // process.exit(1);
  }

  let proxyConfig = null;
  let axiosWithProxy = axios.create({ timeout: 30000 });

  if (PROXY_URL) {
    try {
      // Парсим URL прокси
      const proxyUrl = new URL(PROXY_URL);
      proxyConfig = {
        host: proxyUrl.hostname,
        port: parseInt(proxyUrl.port),
        auth: proxyUrl.username && proxyUrl.password ? {
          username: proxyUrl.username,
          password: proxyUrl.password
        } : undefined
      };

      console.log(`🌐 Прокси настроен:`);
      console.log(`   Host: ${proxyConfig.host}`);
      console.log(`   Port: ${proxyConfig.port}`);
      console.log(`   Auth: ${proxyConfig.auth ? '✅ Да' : '❌ Нет'}`);

      // Устанавливаем переменные окружения для прокси (axios их использует автоматически)
      process.env.HTTP_PROXY = PROXY_URL;
      process.env.HTTPS_PROXY = PROXY_URL;
      console.log(`   HTTP_PROXY: ${process.env.HTTP_PROXY ? '✅ Установлена' : '❌ Нет'}`);

      // Создаем axios instance с прокси конфигурацией
      axiosWithProxy = axios.create({
        proxy: proxyConfig,
        timeout: 30000
      });
      console.log(`   Axios proxy: ✅ Настроен`);
    } catch (error) {
      console.error('❌ Ошибка настройки прокси:', error.message);
      console.warn('🔧 Продолжаем без прокси...');
    }
  } else {
    console.log('🌐 Прокси не настроен - работаем напрямую');
  }

  // Helper function to make curl requests with proxy
  async function curlWithProxy(url, options = {}) {
    const method = options.method || 'GET';
    const headers = options.headers || {};
    const data = options.data;

    let curlCommand = `curl -s -X ${method}`;

    // Add proxy only if configured
    if (PROXY_URL) {
      curlCommand += ` --proxy ${PROXY_URL}`;
    }

    // Add headers
    Object.entries(headers).forEach(([key, value]) => {
      curlCommand += ` -H "${key}: ${value}"`;
    });

    // Add data for POST requests
    if (data && (method === 'POST' || method === 'PUT')) {
      curlCommand += ` -d '${JSON.stringify(data)}'`;
    }

    // Add URL
    curlCommand += ` "${url}"`;

    console.log('🔧 Executing curl command:', curlCommand.replace(/(-H "Authorization: Bearer [^"]+)"/, '$1 [HIDDEN]"'));
    // Execute curl command
    const { stdout, stderr } = await execAsync(curlCommand);
    if (stderr) {
      console.error('Curl stderr:', stderr);
    }
    return stdout;
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

  // Test proxy connection with native Node.js
  app.get('/api/test-proxy-native', async (req, res) => {
    console.log('🧪 Тестирование прокси через нативный Node.js https...');

    return new Promise((resolve) => {
      const proxyUrl = new URL(PROXY_URL);
      const options = {
        hostname: proxyUrl.hostname,
        port: proxyUrl.port,
        path: 'https://httpbin.org/ip',
        method: 'GET',
        headers: {
          'Proxy-Authorization': 'Basic ' + Buffer.from(`${proxyUrl.username}:${proxyUrl.password}`).toString('base64'),
          'User-Agent': 'Node.js'
        }
      };

      const request = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            console.log('✅ Нативный прокси тест прошел! IP:', parsed.origin);
            resolve(res.json({
              success: true,
              message: 'Native proxy test successful',
              proxy_ip: parsed.origin,
              method: 'native-node-https'
            }));
          } catch (e) {
            console.log('❌ Ошибка парсинга ответа:', e.message);
            resolve(res.status(500).json({
              success: false,
              message: 'Response parse error',
              error: e.message,
              raw_data: data.substring(0, 200) + '...'
            }));
          }
        });
      });

      request.on('error', (error) => {
        console.log('❌ Нативный прокси тест провалился:', error.message);
        resolve(res.status(500).json({
          success: false,
          message: 'Native proxy test failed',
          error: error.message,
          method: 'native-node-https'
        }));
      });

      request.setTimeout(10000, () => {
        console.log('❌ Нативный прокси тест: таймаут');
        request.destroy();
        resolve(res.status(500).json({
          success: false,
          message: 'Native proxy timeout',
          method: 'native-node-https'
        }));
      });

      request.end();
    });
  });

  // Test proxy connection
  app.get('/api/test-proxy', async (req, res) => {
    console.log('🧪 Тестирование прокси соединения через axiosWithProxy...');
    console.log('🔍 Прокси:', `${proxyConfig.host}:${proxyConfig.port}`);

    try {
      // Сначала тест БЕЗ прокси
      console.log('🔍 Тестируем прямое соединение...');
      try {
        const directResponse = await axios.get('https://httpbin.org/ip', {
          timeout: 5000,
          proxy: false
        });
        console.log('✅ Прямое соединение: IP =', directResponse.data.origin);
      } catch (directError) {
        console.log('❌ Прямое соединение не работает:', directError.message);
      }

      // Теперь тест прокси
      console.log('🔍 Тестируем прокси соединение через curl...');
      const curlOutput = await curlWithProxy('https://httpbin.org/ip');
      const response = JSON.parse(curlOutput);

      console.log('✅ Прокси работает! IP:', response.origin);
      res.json({
        success: true,
        message: 'Proxy is working',
        proxy_ip: response.origin,
        direct_test: 'completed',
        proxy_config: `${proxyConfig.host}:${proxyConfig.port}`,
        method: 'curlWithProxy'
      });
    } catch (error) {
      console.error('❌ Прокси НЕ работает:', error.message);
      res.status(500).json({
        success: false,
        message: 'Proxy connection failed',
        error: error.message,
        proxy_config: `${proxyConfig.host}:${proxyConfig.port}`,
        method: 'curlWithProxy'
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
      // Сначала попробуем тест БЕЗ прокси
      console.log('🧪 Тестируем соединение БЕЗ прокси...');
      try {
        const directResponse = await axios.get('https://httpbin.org/ip', {
          timeout: 5000,
          proxy: false  // Отключаем прокси для этого запроса
        });
        console.log('✅ Прямое соединение работает! IP:', directResponse.data.origin);
      } catch (directError) {
        console.log('❌ Даже прямое соединение не работает:', directError.message);
        console.log('🌐 Сетевая проблема на сервере!');
        return res.status(500).json({
          error: 'Network connectivity issue',
          message: 'Even direct connections are failing',
          details: directError.message
        });
      }

      // Теперь тест прокси
      console.log('🧪 Тестируем прокси соединение через curl...');
      const testOutput = await curlWithProxy('https://httpbin.org/ip');
      const testResponse = JSON.parse(testOutput);
      console.log('✅ Прокси тест прошел! IP:', testResponse.origin);

      // Теперь основной запрос к OpenAI через прокси
      console.log('🚀 Отправляем запрос к OpenAI через curl...');
      const responseOutput = await curlWithProxy('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'User-Agent': 'curl/7.68.0',
          'Accept': '*/*'
        }
      });

      console.log('✅ Успешный ответ от OpenAI через прокси');
      const response = JSON.parse(responseOutput);
      res.json(response);

    } catch (error) {
      console.error('❌ Ошибка запроса к OpenAI:', error.response?.status, error.message);

      // Логируем детали ошибки
      if (error.response?.data) {
        console.error('📄 Детали ошибки от OpenAI:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error('📄 Нет данных в ответе ошибки');
      }

      res.status(500).json({
        error: 'OpenAI API error',
        status: error.response?.status,
        message: error.message,
        details: error.response?.data,
        key_loaded: !!process.env.OPENAI_API_KEY,
        proxy_configured: !!PROXY_URL,
        timeout: error.code === 'ECONNABORTED' ? 'Connection timeout' : null
      });
    }
  });

  // Chat completions
  app.post('/api/chat/completions', async (req, res) => {
    try {
      const responseOutput = await curlWithProxy('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'User-Agent': 'curl/7.68.0',
          'Accept': '*/*'
        },
        data: req.body
      });
      const response = JSON.parse(responseOutput);
      res.json(response);
    } catch (error) {
      console.error('Chat completions error:', error);
      res.status(500).json({
        error: 'OpenAI API error',
        details: error.message
      });
    }
  });

  // Image generations
  app.post('/api/images/generations', async (req, res) => {
    try {
      const responseOutput = await curlWithProxy('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'User-Agent': 'curl/7.68.0',
          'Accept': '*/*'
        },
        data: req.body
      });
      const response = JSON.parse(responseOutput);
      res.json(response);
    } catch (error) {
      console.error('Images generations error:', error);
      res.status(500).json({
        error: 'OpenAI Images API error',
        details: error.message
      });
    }
  });

  // Text-to-Speech
  app.post('/api/audio/speech', async (req, res) => {
    try {
      // For TTS, we need to stream the response, so we'll use spawn instead of exec
      const curlArgs = [
        '-s', '-X', 'POST',
        '--proxy', PROXY_URL,
        '-H', `Authorization: Bearer ${process.env.OPENAI_API_KEY}`,
        '-H', 'Content-Type: application/json',
        '-H', 'User-Agent: curl/7.68.0',
        '-H', 'Accept: */*',
        '-d', JSON.stringify(req.body),
        'https://api.openai.com/v1/audio/speech'
      ];

      const curlProcess = spawn('curl', curlArgs, { stdio: ['pipe', 'pipe', 'pipe'] });

      res.setHeader('Content-Type', 'audio/mpeg');

      curlProcess.stdout.pipe(res);

      curlProcess.on('error', (error) => {
        console.error('TTS curl error:', error);
        if (!res.headersSent) {
          res.status(500).json({
            error: 'OpenAI TTS API error',
            details: error.message
          });
        }
      });

      curlProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('TTS curl process exited with code:', code);
        }
      });
    } catch (error) {
      console.error('TTS error:', error);
      res.status(500).json({
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

  // ==================== DATABASE API ROUTES ====================
  // Get database health
  app.get('/api/db/health', (req, res) => {
    try {
      const result = db.prepare('SELECT COUNT(*) as count FROM sqlite_master WHERE type="table"').get();
      res.json({
        status: 'ok',
        message: 'Database is healthy',
        tables: result.count,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  // Create or get user
  app.post('/api/db/users', (req, res) => {
    try {
      const { username, email, first_name, last_name } = req.body;
      if (!username || !email) {
        return res.status(400).json({ status: 'error', message: 'Username and email are required' });
      }

      const crypto = require('crypto');
      const password_hash = crypto.createHash('sha256').update(email).digest('hex');
      
      const stmt = db.prepare(`
        INSERT INTO users (username, email, password_hash, first_name, last_name, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `);
      
      const result = stmt.run(username, email, password_hash, first_name || '', last_name || '');
      res.status(201).json({
        status: 'created',
        id: result.lastInsertRowid,
        username,
        email
      });
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ status: 'error', message: 'User already exists' });
      }
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  // Get user by ID
  app.get('/api/db/users/:id', (req, res) => {
    try {
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
      if (!user) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  // Save assessment result
  app.post('/api/db/assessments', (req, res) => {
    try {
      console.log('📥 Raw request body:', JSON.stringify(req.body, null, 2));
      const { user_id, assessment_type, cefr_level, total_questions, correct_answers, duration_seconds } = req.body;

      console.log('📥 Received assessment data:', req.body);

      // Validate required fields
      if (!user_id || !assessment_type) {
        return res.status(400).json({
          status: 'error',
          message: 'user_id and assessment_type are required',
          received: { user_id, assessment_type }
        });
      }

      // Convert and validate data types
      const userIdNum = parseInt(user_id);
      const totalQuestionsNum = parseInt(total_questions);
      const correctAnswersNum = parseInt(correct_answers);
      const durationSecondsNum = duration_seconds ? parseInt(duration_seconds) : 0;

      console.log('🔢 Converted values:', {
        userIdNum,
        totalQuestionsNum,
        correctAnswersNum,
        durationSecondsNum
      });

      if (isNaN(userIdNum) || userIdNum <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'user_id must be a positive number',
          received: user_id,
          converted: userIdNum
        });
      }

      if (isNaN(totalQuestionsNum) || totalQuestionsNum < 0) {
        return res.status(400).json({
          status: 'error',
          message: 'total_questions must be a non-negative number',
          received: total_questions,
          converted: totalQuestionsNum
        });
      }

      if (isNaN(correctAnswersNum) || correctAnswersNum < 0) {
        return res.status(400).json({
          status: 'error',
          message: 'correct_answers must be a non-negative number',
          received: correct_answers,
          converted: correctAnswersNum
        });
      }

      if (correctAnswersNum > totalQuestionsNum) {
        return res.status(400).json({
          status: 'error',
          message: 'correct_answers cannot be greater than total_questions',
          received: { correct_answers, total_questions },
          converted: { correctAnswersNum, totalQuestionsNum }
        });
      }

      // Calculate score percentage safely
      const score_percentage = totalQuestionsNum > 0 ? Math.round((correctAnswersNum / totalQuestionsNum) * 100) : 0;

      console.log('💾 Inserting assessment:', {
        userIdNum,
        assessment_type,
        cefr_level,
        totalQuestionsNum,
        correctAnswersNum,
        score_percentage,
        durationSecondsNum
      });

      const stmt = db.prepare(`
        INSERT INTO assessments (user_id, assessment_type, cefr_level, total_questions, correct_answers, score_percentage, duration_seconds, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);

      const result = stmt.run(userIdNum, assessment_type, cefr_level, totalQuestionsNum, correctAnswersNum, score_percentage, durationSecondsNum);

      console.log('✅ Assessment saved successfully:', result);

      res.status(201).json({
        status: 'created',
        id: result.lastInsertRowid,
        score_percentage,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error saving assessment:', error);
      res.status(500).json({
        status: 'error',
        message: error.message,
        stack: error.stack
      });
    }
  });

  // Get user assessments
  app.get('/api/db/users/:id/assessments', (req, res) => {
    try {
      const assessments = db.prepare(`
        SELECT * FROM assessments 
        WHERE user_id = ? 
        ORDER BY timestamp DESC 
        LIMIT 20
      `).all(req.params.id);
      
      res.json({ status: 'ok', count: assessments.length, assessments });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  // Update user progress
  app.post('/api/db/progress', (req, res) => {
    try {
      const { user_id, lesson_id, course_id, status, progress_percentage } = req.body;
      if (!user_id || !lesson_id || !course_id) {
        return res.status(400).json({ status: 'error', message: 'user_id, lesson_id, and course_id are required' });
      }

      const stmt = db.prepare(`
        INSERT INTO user_progress (user_id, lesson_id, course_id, status, progress_percentage, started_at, completed_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
        ON CONFLICT(user_id, lesson_id) DO UPDATE SET
          status = excluded.status,
          progress_percentage = excluded.progress_percentage,
          completed_at = excluded.completed_at,
          attempts = attempts + 1
      `);
      
      const completed_at = status === 'completed' ? new Date().toISOString() : null;
      const result = stmt.run(user_id, lesson_id, course_id, status, progress_percentage, completed_at);
      
      res.json({
        status: 'ok',
        message: 'Progress updated',
        user_id,
        lesson_id,
        progress_percentage
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  // Get database statistics
  app.get('/api/db/stats', (req, res) => {
    try {
      const stats = {
        users: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
        assessments: db.prepare('SELECT COUNT(*) as count FROM assessments').get().count,
        lessons: db.prepare('SELECT COUNT(*) as count FROM lessons').get().count,
        progress: db.prepare('SELECT COUNT(*) as count FROM user_progress').get().count,
        avg_score: Math.round((db.prepare('SELECT AVG(score_percentage) as avg FROM assessments').get().avg || 0) * 100) / 100
      };
      res.json({ status: 'ok', stats });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  // Save assessment questions
  app.post('/api/db/assessments/:id/questions', (req, res) => {
    try {
      const { questions } = req.body;
      if (!Array.isArray(questions)) {
        return res.status(400).json({ status: 'error', message: 'questions must be an array' });
      }

      const stmt = db.prepare(`
        INSERT INTO assessment_questions (assessment_id, question_number, concept, prompt, user_answer, correct_answer, is_correct)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const transaction = db.transaction((questions) => {
        for (const q of questions) {
          stmt.run(
            req.params.id,
            q.question_number,
            q.concept,
            q.prompt,
            q.user_answer,
            q.correct_answer,
            q.is_correct ? 1 : 0
          );
        }
      });

      transaction(questions);
      res.json({ status: 'ok', message: 'Questions saved', count: questions.length });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Завершение работы...');
    db.close();
    console.log('✅ Database closed');
    server.close(() => {
      console.log('✅ Сервер остановлен');
      process.exit(0);
    });
  });
}
