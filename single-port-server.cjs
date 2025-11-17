#!/usr/bin/env node

/**
 * Single Port Server - запускает frontend и API proxy на одном порту 1031
 * Для случаев, когда доступен только один порт
 */

require('dotenv').config(); // Загружаем переменные окружения

// Обработчик необработанных ошибок и промисов
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Не завершаем процесс на необработанные промисы
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Не завершаем процесс на необработанные исключения
});

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
  console.log('🔍 DEBUG: startSinglePortServer called');

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

      CREATE TABLE IF NOT EXISTS learning_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        subject_name TEXT NOT NULL,
        grade INTEGER NOT NULL,
        plan_data TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, course_id)
      );

      CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON user_progress(lesson_id);
      CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
      CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
      CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
      CREATE INDEX IF NOT EXISTS idx_assessment_questions_assessment_id ON assessment_questions(assessment_id);
      CREATE INDEX IF NOT EXISTS idx_learning_plans_user_id ON learning_plans(user_id);
      CREATE INDEX IF NOT EXISTS idx_learning_plans_course_id ON learning_plans(course_id);
    `);
    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Error initializing database tables:', error.message);
  }

  // Создаем новый Express app
  const app = express();

  // Требируем модули ПЕРЕД использованием
  const cors = require('cors');
  const axios = require('axios');
  const https = require('https');

  // ВАЖНО: middleware ДОЛЖЕН быть ПЕРЕД статическими файлами и API маршрутами!
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ⚠️ ВАЖНО: API маршруты ДОЛЖНЫ быть ПЕРЕД static файлами!
  // Иначе static middleware будет обрабатывать /api/* как файлы

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

    console.log('🔧 curlWithProxy called for URL:', url, 'method:', method);

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
      // Escape single quotes in JSON string
      const jsonData = JSON.stringify(data).replace(/'/g, "'\\''");
      curlCommand += ` -d '${jsonData}'`;
    }

    // Add URL
    curlCommand += ` "${url}"`;

    console.log('🔧 Executing curl command:', curlCommand.replace(/(-H "Authorization: Bearer [^"]+)"/, '$1 [HIDDEN]"'));
    
    try {
      // Execute curl command
      const { stdout, stderr } = await execAsync(curlCommand);
      
      if (stderr && !stderr.includes('Warning')) {
        console.error('⚠️ Curl stderr:', stderr);
      }
      
      if (!stdout || stdout.trim().length === 0) {
        throw new Error('Empty response from curl command');
      }
      
      return stdout;
    } catch (error) {
      console.error('❌ curlWithProxy error:', error.message);
      if (error.stdout) {
        console.error('❌ curl stdout:', error.stdout.substring(0, 500));
      }
      if (error.stderr) {
        console.error('❌ curl stderr:', error.stderr);
      }
      throw new Error(`curl command failed: ${error.message}`);
    }
  }

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
    console.log('🧪 Тестирование прокси соединения...');

    if (!PROXY_URL) {
      return res.status(400).json({
        success: false,
        message: 'Proxy not configured'
      });
    }

    try {
      const curlOutput = await curlWithProxy('https://httpbin.org/ip');
      const response = JSON.parse(curlOutput);

      console.log('✅ Прокси работает! IP:', response.origin);
      res.json({
        success: true,
        message: 'Proxy is working',
        proxy_ip: response.origin
      });
    } catch (error) {
      console.error('❌ Прокси НЕ работает:', error.message);
      res.status(500).json({
        success: false,
        message: 'Proxy test failed',
        error: error.message
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

    try {
      // Простой запрос к OpenAI через прокси без лишних тестов
      console.log('🚀 Отправляем запрос к OpenAI через curl...');
      const responseOutput = await curlWithProxy('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'User-Agent': 'curl/7.68.0',
          'Accept': '*/*'
        }
      });

      console.log('✅ Успешный ответ от OpenAI');
      const response = JSON.parse(responseOutput);
      res.json(response);

    } catch (error) {
      console.error('❌ Ошибка запроса к OpenAI:', error.message);
      res.status(500).json({
        error: 'OpenAI API error',
        message: error.message,
        key_loaded: !!process.env.OPENAI_API_KEY,
        proxy_configured: !!PROXY_URL
      });
    }
  });

  // Chat completions
  app.post('/api/chat/completions', async (req, res) => {
    console.log('📨 Chat completions request received');
    console.log('📨 Request body:', JSON.stringify(req.body).substring(0, 500) + '...');

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-test-key-for-development') {
      console.error('❌ OpenAI API key not configured or using test key');
      return res.status(500).json({
        error: 'OpenAI API key not properly configured',
        message: 'Please set a valid OPENAI_API_KEY in the .env file. Current key is: ' + (process.env.OPENAI_API_KEY ? 'TEST_KEY' : 'NOT_SET'),
        details: 'Get your API key from https://platform.openai.com/api-keys'
      });
    }

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

      // Check if response is empty
      if (!responseOutput || responseOutput.trim().length === 0) {
        console.error('❌ Empty response from OpenAI API');
        return res.status(500).json({
          error: 'Empty response from OpenAI API',
          details: 'The API returned an empty response'
        });
      }

      // Try to parse JSON
      let response;
      try {
        response = JSON.parse(responseOutput);
      } catch (parseError) {
        console.error('❌ Failed to parse JSON response:', parseError.message);
        console.error('❌ Raw response:', responseOutput.substring(0, 500));
        return res.status(500).json({
          error: 'Invalid JSON response from OpenAI API',
          details: parseError.message,
          raw_response: responseOutput.substring(0, 200)
        });
      }

      // Check if response contains an error from OpenAI
      if (response.error) {
        console.error('❌ OpenAI API returned an error:', response.error);
        return res.status(response.error.status || 500).json({
          error: 'OpenAI API error',
          message: response.error.message,
          type: response.error.type,
          code: response.error.code
        });
      }

      // Check if response has expected structure
      if (!response.choices || !Array.isArray(response.choices) || response.choices.length === 0) {
        console.error('❌ Invalid response structure:', JSON.stringify(response).substring(0, 500));
        return res.status(500).json({
          error: 'Invalid response structure from OpenAI API',
          details: 'Response does not contain choices array'
        });
      }

      res.json(response);
    } catch (error) {
      console.error('❌ Chat completions error:', error);
      console.error('❌ Error stack:', error.stack);
      res.status(500).json({
        error: 'OpenAI API error',
        details: error.message,
        type: error.constructor.name
      });
    }
  });

  // Real chat completions are temporarily disabled for debugging

  // Generate personalized learning plan
  app.post('/api/generate-learning-plan', async (req, res) => {
    try {
      const { courseId, grade, topic, courseName } = req.body;

      if (!topic || !grade || !courseName) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['topic', 'grade', 'courseName']
        });
      }

      console.log(`🎯 Generating learning plan for ${courseName}, grade ${grade}, topic: "${topic}"`);

      const prompt = `Ты опытный преподаватель ${courseName.toLowerCase()} для учеников ${grade} класса.

ЗАДАЧА: Создать персонализированный план обучения из 15 уроков.

КОНТЕКСТ:
- Предмет: ${courseName}
- Класс ученика: ${grade} класс
- Последняя изученная тема: "${topic}"
- Уровень сложности: соответствующий для ${grade} класса

ТРЕБОВАНИЯ:
1. Первый урок должен быть ЛОГИЧЕСКИМ ПРОДОЛЖЕНИЕМ темы "${topic}"
2. Каждый следующий урок должен быть немного сложнее (progressive difficulty)
3. План должен быть структурирован так, чтобы каждая тема подготавливала к следующей
4. Используй методологию, подходящую для ${grade} класса
5. КРАЙНЕ ВАЖНО: темы должны соответствовать школьной программе для ${grade} класса!

УРОВНИ ОБРАЗОВАНИЯ И СООТВЕТСТВУЮЩИЕ ТЕМЫ:

ДЛЯ 1-4 КЛАССОВ (начальная школа):
- Основы грамоты, буквы, слоги
- Простые слова и предложения
- Основные части речи (имена существительные, прилагательные, глаголы)
- Чтение и письмо
- Игры и упражнения на запоминание

ДЛЯ 5-9 КЛАССОВ (средняя школа):
- Морфология и синтаксис
- Пунктуация
- Развитие речи
- Литературный анализ
- Стилистика

ДЛЯ 10-11 КЛАССОВ (старшая школа):
- Сложный синтаксис и пунктуация
- Стилистика и риторика
- Текстоведение и интерпретация текста
- Литературный анализ произведений
- История русского языка
- Подготовка к ЕГЭ (сочинения, анализ текста)
- Функциональные стили речи
- Лексикология и фразеология

ДЛЯ РУССКОГО ЯЗЫКА В ${grade} КЛАССЕ:
${grade >= 10 ?
`- Комплексный синтаксис предложений
- Стилистический анализ текста
- Подготовка к ЕГЭ: анализ художественных произведений
- Функциональные стили речи
- История русского литературного языка
- Текстоведение и интерпретация
- Риторика и ораторское мастерство
- Лексическая стилистика` :

grade >= 7 ?
`- Морфология и словообразование
- Синтаксис сложных предложений
- Пунктуация в сложных конструкциях
- Развитие речи и стилистика
- Литературный анализ` :

grade >= 5 ?
`- Части речи и их формы
- Простые и сложные предложения
- Орфография и пунктуация
- Развитие речи` :

`- Основы чтения и письма
- Знакомство с частями речи
- Простые предложения
- Азбука и фонетика`}

ПРИМЕР ПРОГРЕССИИ ДЛЯ ${grade} КЛАССА (не копируй!):
${grade >= 10 ?
`Если ученик изучал "Сложные предложения", следующие темы:
- Период как стилистическая фигура
- Риторические вопросы и восклицания
- Анализ синтаксических средств выразительности
- Подготовка к сочинению ЕГЭ
- Функционально-смысловые типы речи` :

grade >= 7 ?
`Если ученик изучал "Сложные предложения", следующие темы:
- Пунктуация в сложных предложениях
- Стилистические фигуры
- Развитие речи: рассуждение
- Анализ текста` :

`Если ученик изучал "Части речи: имена существительные", следующие темы:
- Практика и типология существительных
- Имена прилагательные (согласование)
- Глаголы и их формы
- Простые предложения`}

ОТВЕТ ТОЛЬКО В JSON (без дополнительного текста):
{
  "courseName": "${courseName}",
  "grade": ${grade},
  "foundTopic": "${topic}",
  "lessons": [
    {
      "number": 1,
      "title": "Название урока (продолжение \"${topic}\")",
      "topic": "Основная тема",
      "aspects": "Подробное описание: что изучается, основные аспекты, практические примеры",
      "difficulty": "beginner|intermediate|advanced",
      "prerequisites": ["${topic}", "другой необходимый навык"]
    },
    ...ещё 14 уроков, каждый логично следующий из предыдущего...
  ]
}`;

      const requestBody = {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Ты преподаватель, создающий персонализированные планы обучения. Всегда отвечай ТОЛЬКО валидным JSON без дополнительного текста.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      };

      console.log('📤 Sending request to OpenAI...');
      const responseOutput = await curlWithProxy('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'User-Agent': 'curl/7.68.0',
          'Accept': '*/*'
        },
        data: requestBody
      });

      const response = JSON.parse(responseOutput);
      
      if (!response.choices || !response.choices[0] || !response.choices[0].message) {
        throw new Error('Invalid response structure from OpenAI');
      }

      const content = response.choices[0].message.content;
      console.log('📥 OpenAI response:', content.substring(0, 200) + '...');

      // Parse the JSON response
      let planData;
      try {
        // Try to extract JSON from the response (in case there's extra text)
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        planData = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('❌ Failed to parse JSON response:', parseError.message);
        console.error('Raw response:', content);
        return res.status(500).json({
          error: 'Failed to parse learning plan',
          details: parseError.message
        });
      }

      console.log(`✅ Successfully generated plan with ${planData.lessons?.length || 0} lessons`);
      
      res.json({
        success: true,
        plan: planData
      });

    } catch (error) {
      console.error('❌ Learning plan generation error:', error.message);
      res.status(500).json({
        error: 'Failed to generate learning plan',
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

  // Запускаем сервер
  const server = app.listen(1031, () => {
    console.log('✅ Единый сервер запущен на порту 1031');
    console.log('');
    console.log('🎉 TRUE SINGLE-PORT SERVER ГОТОВ!');
    console.log('==================================');
    console.log('🌐 Доступно на: https://teacher.windexs.ru');
    console.log('📡 API: https://teacher.windexs.ru/api/*');
    console.log('💻 Frontend: https://teacher.windexs.ru/');
    console.log('💚 Health: https://teacher.windexs.ru/health');
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

  // Save learning plan
  app.post('/api/db/learning-plans', (req, res) => {
    try {
      const { user_id, course_id, subject_name, grade, plan_data } = req.body;
      
      if (!user_id || !course_id || !subject_name || !grade || !plan_data) {
        return res.status(400).json({
          status: 'error',
          message: 'user_id, course_id, subject_name, grade, and plan_data are required',
          received: { user_id, course_id, subject_name, grade, plan_data_type: typeof plan_data }
        });
      }

      console.log(`💾 Saving learning plan for user ${user_id}, course ${course_id}, grade ${grade}`);

      // Extract numeric course_id (in case it comes as "4-10", we need just "4")
      const baseCourseId = String(course_id).split('-')[0];
      const numericCourseId = parseInt(baseCourseId);
      
      if (isNaN(numericCourseId)) {
        return res.status(400).json({
          status: 'error',
          message: 'course_id must be a number or contain a number',
          received: course_id,
          extracted: baseCourseId
        });
      }

      console.log(`🔄 Extracted numeric course_id: ${numericCourseId} from ${course_id}`);

      // Ensure user exists, create if not
      const userCheck = db.prepare('SELECT id FROM users WHERE id = ?').get(user_id);
      if (!userCheck) {
        console.log(`👤 User ${user_id} not found, creating...`);
        const createUser = db.prepare(`
          INSERT INTO users (id, username, email, password_hash, first_name, last_name, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `);
        createUser.run(user_id, `user_${user_id}`, `user_${user_id}@temp.com`, 'temp_password_hash', 'Temp', 'User');
      }

      const stmt = db.prepare(`
        INSERT INTO learning_plans (user_id, course_id, subject_name, grade, plan_data, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, course_id) DO UPDATE SET
          subject_name = excluded.subject_name,
          grade = excluded.grade,
          plan_data = excluded.plan_data,
          updated_at = CURRENT_TIMESTAMP
      `);

      const planDataStr = typeof plan_data === 'string' ? plan_data : JSON.stringify(plan_data);
      
      // Check size limit (SQLite BLOB has reasonable limits)
      const sizeInKB = Math.round(planDataStr.length / 1024);
      console.log(`📝 Plan data to save - length: ${planDataStr.length}, size: ${sizeInKB}KB`);
      
      if (sizeInKB > 5000) {
        console.error(`❌ Plan data too large: ${sizeInKB}KB (max 5000KB)`);
        return res.status(413).json({
          status: 'error',
          message: 'Plan data too large',
          size: sizeInKB,
          max: 5000
        });
      }

      console.log(`🔍 Running insert statement with params:`, {
        user_id,
        numericCourseId,
        subject_name,
        grade,
        planDataStr_length: planDataStr.length
      });

      const result = stmt.run(
        user_id,
        numericCourseId,
        subject_name,
        grade,
        planDataStr
      );

      console.log(`✅ Learning plan saved successfully for user ${user_id}, course ${numericCourseId}, grade ${grade}`);

      res.status(201).json({
        status: 'ok',
        message: 'Learning plan saved',
        id: result.lastInsertRowid,
        user_id,
        course_id: numericCourseId,
        grade
      });
    } catch (error) {
      console.error('❌ Error saving learning plan:', error);
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sql: error.sql,
        stack: error.stack
      });
      
      // Provide more detailed error responses
      let statusCode = 500;
      let errorMessage = error.message;
      
      if (error.message && error.message.includes('SQLITE_CONSTRAINT')) {
        statusCode = 409;
        errorMessage = 'Constraint violation - possibly duplicate entry';
      } else if (error.message && error.message.includes('SQLITE_FULL')) {
        statusCode = 507;
        errorMessage = 'Database disk space full';
      } else if (error.message && error.message.includes('SQLITE_TOOBIG')) {
        statusCode = 413;
        errorMessage = 'Data too large for database';
      }
      
      res.status(statusCode).json({
        status: 'error',
        message: errorMessage,
        code: error.code,
        errno: error.errno,
        details: 'Failed to save learning plan to database'
      });
    }
  });

  // Get learning plan by user and course
  app.get('/api/db/learning-plans/:user_id/:course_id', (req, res) => {
    try {
      const { user_id, course_id } = req.params;

      console.log(`📚 Fetching learning plan for user ${user_id}, course ${course_id}`);

      const plan = db.prepare(`
        SELECT * FROM learning_plans
        WHERE user_id = ? AND course_id = ?
      `).get(user_id, course_id);

      if (!plan) {
        return res.status(404).json({
          status: 'not_found',
          message: 'Learning plan not found'
        });
      }

      // Parse plan_data if it's stored as JSON string
      const planData = typeof plan.plan_data === 'string' 
        ? JSON.parse(plan.plan_data) 
        : plan.plan_data;

      res.json({
        status: 'ok',
        plan: {
          ...plan,
          plan_data: planData
        }
      });
    } catch (error) {
      console.error('❌ Error fetching learning plan:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  });

  // Get all learning plans for user
  app.get('/api/db/learning-plans/user/:user_id', (req, res) => {
    try {
      const { user_id } = req.params;

      console.log(`📚 Fetching all learning plans for user ${user_id}`);

      // Ensure user exists, create if not
      const userCheck = db.prepare('SELECT id FROM users WHERE id = ?').get(user_id);
      if (!userCheck) {
        console.log(`👤 User ${user_id} not found, creating...`);
        const createUser = db.prepare(`
          INSERT INTO users (id, username, email, password_hash, first_name, last_name, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `);
        createUser.run(user_id, `user_${user_id}`, `user_${user_id}@temp.com`, 'temp_password_hash', 'Temp', 'User');
      }

      const plans = db.prepare(`
        SELECT * FROM learning_plans
        WHERE user_id = ?
        ORDER BY updated_at DESC
      `).all(user_id);

      console.log(`📊 Found ${plans.length} plans in database`);

      const formattedPlans = plans.map(plan => {
        try {
          console.log(`🔧 Processing plan ID ${plan.id}, course ${plan.course_id}`);
          console.log(`📄 plan_data type: ${typeof plan.plan_data}, length: ${plan.plan_data?.length || 0}`);

          let parsedPlanData = plan.plan_data;
          if (typeof plan.plan_data === 'string') {
            try {
              parsedPlanData = JSON.parse(plan.plan_data);
              console.log(`✅ Successfully parsed plan_data for course ${plan.course_id}`);
            } catch (jsonError) {
              console.error(`❌ Failed to parse plan_data for course ${plan.course_id}:`, jsonError.message);
              console.error(`📄 Raw plan_data:`, plan.plan_data.substring(0, 200) + '...');
              // Не прерываем, возвращаем сырые данные
              parsedPlanData = { error: 'Invalid JSON', raw: plan.plan_data };
            }
          }

          return {
            ...plan,
            plan_data: parsedPlanData
          };
        } catch (planError) {
          console.error(`❌ Error processing plan ${plan.id}:`, planError);
          return {
            ...plan,
            plan_data: { error: 'Processing failed', raw: plan.plan_data }
          };
        }
      });

      console.log(`✅ Formatted ${formattedPlans.length} plans`);

      res.json({
        status: 'ok',
        count: plans.length,
        plans: formattedPlans
      });
    } catch (error) {
      console.error('❌ Error fetching learning plans:', error);
      res.status(500).json({
        status: 'error',
        message: error.message,
        stack: error.stack
      });
    }
  });

  // ⚠️ ВАЖНО: static files и SPA fallback ДОЛЖНЫ быть в конце, ПОСЛЕ ВСЕХ API маршрутов!
  console.log('📂 Настраиваем static файлы и SPA fallback...');
  
  // Настраиваем static файлы frontend
  // ВАЖНО: НЕ обрабатываем /api/* пути как static файлы
  app.use((req, res, next) => {
    // Пропускаем все /api/* маршруты
    if (req.path.startsWith('/api/') || req.path === '/health') {
      return next();
    }
    // Для остальных путей используем static middleware
    express.static(path.join(__dirname, 'dist'), {
      index: false,
      redirect: false
    })(req, res, next);
  });

  // SPA fallback - для всех остальных запросов отправляем index.html
  // Это позволяет React Router обработать маршруты на клиенте
  app.use((req, res) => {
    console.log(`📄 SPA fallback для пути: ${req.path}`);
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

  console.log('✅ Static файлы и SPA fallback настроены');

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
