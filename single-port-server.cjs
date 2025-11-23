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

console.log(`🚀 Запуск TRUE Single Port Server (ПОРТ ${process.env.PORT || '1031'})`);
console.log('================================================');

// Устанавливаем переменные окружения
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '1031';
process.env.PROXY_PORT = process.env.PORT;

console.log('📊 Конфигурация TRUE SINGLE-PORT:');
console.log(`  - Единственный порт: ${process.env.PORT}`);
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

      CREATE TABLE IF NOT EXISTS lesson_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        course_name TEXT NOT NULL,
        lesson_title TEXT NOT NULL,
        lesson_topic TEXT,
        lesson_number INTEGER,
        lesson_notes TEXT NOT NULL,
        current_note_index INTEGER DEFAULT 0,
        total_notes INTEGER NOT NULL,
        call_transcript TEXT,
        session_status TEXT DEFAULT 'in_progress',
        started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        completed_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS generated_lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_name TEXT NOT NULL,
        lesson_title TEXT NOT NULL,
        lesson_topic TEXT,
        lesson_number INTEGER,
        lesson_notes TEXT NOT NULL,
        total_notes INTEGER NOT NULL,
        generation_prompt TEXT,
        conversation_history TEXT,
        interaction_type TEXT DEFAULT 'voice', -- 'voice' or 'text'
        is_template BOOLEAN DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON user_progress(lesson_id);
      CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
      CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
      CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
      CREATE INDEX IF NOT EXISTS idx_assessment_questions_assessment_id ON assessment_questions(assessment_id);
      CREATE INDEX IF NOT EXISTS idx_learning_plans_user_id ON learning_plans(user_id);
      CREATE INDEX IF NOT EXISTS idx_learning_plans_course_id ON learning_plans(course_id);
      CREATE INDEX IF NOT EXISTS idx_lesson_sessions_user_id ON lesson_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_lesson_sessions_status ON lesson_sessions(session_status);
      CREATE INDEX IF NOT EXISTS idx_generated_lessons_course ON generated_lessons(course_name, lesson_title);
      CREATE INDEX IF NOT EXISTS idx_generated_lessons_active ON generated_lessons(is_active);
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

  // File upload middleware for audio files
  const fileupload = require('express-fileupload');
  app.use(fileupload({
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
    abortOnLimit: true,
    responseOnLimit: 'File size too large',
    useTempFiles: false,
    tempFileDir: '/tmp/'
  }));

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
  let axiosWithProxy = axios.create({ timeout: 120000 }); // 2 minutes for large requests

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
        timeout: 120000 // 2 minutes for large requests
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
    const curlStartTime = Date.now();
    const method = options.method || 'GET';
    const headers = options.headers || {};
    const data = options.data;
    const stream = options.stream || false;

    console.log('🔧 [CURL TIMING] T+0ms: curlWithProxy called for URL:', url, 'method:', method, 'stream:', stream);

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
      if (data.getBoundary && typeof data.getBoundary === 'function') {
        // Handle FormData - this is tricky with curl
        // For FormData, we need to use a different approach
        console.log('📋 FormData detected, using alternative approach...');

        // Create a temporary file approach for FormData
        const fs = require('fs');
        const path = require('path');
        const os = require('os');
        const crypto = require('crypto');

        const tempFile = path.join(os.tmpdir(), `formdata_${crypto.randomBytes(8).toString('hex')}.tmp`);

        try {
          // Write FormData buffer to temp file
          const buffer = data.getBufferSync ? data.getBufferSync() : data.getBuffer ? data.getBuffer() : null;

          if (buffer) {
            fs.writeFileSync(tempFile, buffer);
            curlCommand += ` -F "file=@${tempFile};filename=audio.webm;type=audio/webm"`;
            curlCommand += ` -F "model=whisper-1"`;
            curlCommand += ` -F "language=ru"`;
            curlCommand += ` -F "response_format=json"`;

            console.log('📁 Created temp file for FormData:', tempFile);
          } else {
            throw new Error('Cannot get FormData buffer');
          }
        } catch (error) {
          console.error('❌ Failed to create temp file for FormData:', error);
          // Fallback to simple approach
          curlCommand += ` -d 'FORMDATA_ERROR'`;
        }

        // Clean up temp file after curl execution
        const originalCommand = curlCommand;
        curlCommand = `bash -c "${originalCommand}; rm -f '${tempFile}'"`;

      } else {
        // Handle regular JSON data
        const jsonData = JSON.stringify(data).replace(/'/g, "'\\''");
        curlCommand += ` -d '${jsonData}'`;
      }
    }

    // Add URL
    curlCommand += ` "${url}"`;

    console.log('🔧 Executing curl command:', curlCommand.replace(/(-H "Authorization: Bearer [^"]+)"/, '$1 [HIDDEN]"').replace(/AIza[0-9a-zA-Z\-_]+/, '[HIDDEN_API_KEY]'));

    if (stream) {
      // Return a readable stream for streaming responses
      return new Promise((resolve, reject) => {
        const { spawn } = require('child_process');
        const curl = spawn('bash', ['-c', curlCommand], { stdio: ['pipe', 'pipe', 'pipe'] });

        let stderrData = '';

        curl.stderr.on('data', (data) => {
          stderrData += data.toString();
        });

        curl.on('close', (code) => {
          if (code !== 0) {
            const error = new Error(`curl process exited with code ${code}`);
            error.stderr = stderrData;
            reject(error);
          }
        });

        curl.on('error', (error) => {
          error.stderr = stderrData;
          reject(error);
        });

        // Resolve with the readable stream
        resolve(curl.stdout);
      });
    } else {
      try {
        // Execute curl command synchronously
        console.log('⏱️ [CURL TIMING] T+' + (Date.now() - curlStartTime) + 'ms: Starting curl execution');
        const { stdout, stderr } = await execAsync(curlCommand);
        console.log('⏱️ [CURL TIMING] T+' + (Date.now() - curlStartTime) + 'ms: Curl execution completed');

        if (stderr && !stderr.includes('Warning')) {
          console.error('⚠️ Curl stderr:', stderr);
        }

        if (!stdout || stdout.trim().length === 0) {
          throw new Error('Empty response from curl command');
        }

        console.log('⏱️ [CURL TIMING] T+' + (Date.now() - curlStartTime) + 'ms: Returning response');
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
  }

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // API diagnostics
  app.get('/api/diagnostics', (req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'SET (length: ' + process.env.OPENAI_API_KEY.length + ')' : 'NOT_SET',
        PROXY_URL: process.env.PROXY_URL ? 'SET' : 'NOT_SET',
        GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'SET' : 'NOT_SET'
      },
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version
      }
    });
  });

  // Test responses endpoint
  app.post('/api/test-responses', (req, res) => {
    console.log('🧪 TEST endpoint called:', req.body);
    res.json({
      status: 'OK',
      received: req.body,
      timestamp: new Date().toISOString()
    });
  });

  // Chat completions
  app.post('/api/chat/completions', async (req, res) => {
    const requestStartTime = Date.now();
    console.log('📨 [BACKEND TIMING] T+0ms: Chat completions request received');
    console.log('📨 Request body:', JSON.stringify(req.body).substring(0, 500) + '...');

    // Handle Gemini models
    if (req.body.model && req.body.model.toLowerCase().includes('gemini')) {
        console.log('🤖 Using Gemini 3 Pro Preview via GoogleGenAI');

        const { GoogleGenAI } = require('@google/genai');

        const geminiApiKey = process.env.GEMINI_API_KEY || 'AIzaSyA0fqfnbjliRhUqAFa9Bt-Iy7VjR2Ufkp8';
        const ai = new GoogleGenAI({
          apiKey: geminiApiKey
        });

        try {
          // Convert OpenAI messages to Gemini format
          const messages = req.body.messages || [];

          // Extract system message if present
          let systemInstruction = undefined;
          const systemMsg = messages.find(m => m.role === 'system');
          if (systemMsg) {
            systemInstruction = systemMsg.content;
          }

          // Build conversation parts - concatenate all messages into a single prompt
          // since Gemini's generateContent doesn't maintain conversation state like startChat
          let fullPrompt = '';

          if (systemInstruction) {
            fullPrompt += `System: ${systemInstruction}\n\n`;
          }

          // Add conversation history
          for (const msg of messages) {
            if (msg.role === 'system') continue; // Already handled above

            const roleName = msg.role === 'assistant' ? 'Assistant' : 'User';
            fullPrompt += `${roleName}: ${msg.content}\n\n`;
          }

          fullPrompt += 'Assistant: '; // Start the assistant's response

          const result = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: [{ parts: [{ text: fullPrompt }] }],
            generationConfig: {
              temperature: req.body.temperature || 0.7,
              maxOutputTokens: req.body.max_tokens || 1000,
            }
          });

          console.log('Gemini API result keys:', Object.keys(result));

          const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
                      result.candidates?.[0]?.content?.parts?.[0]?.text ||
                      'No response from Gemini';

          // Transform Gemini response to OpenAI format
          const openaiResponse = {
            id: 'chatcmpl-gemini-3-pro-preview-' + Date.now(),
            object: 'chat.completion',
            created: Math.floor(Date.now() / 1000),
            model: 'gemini-3-pro-preview',
            choices: [
              {
                index: 0,
                message: {
                  role: 'assistant',
                  content: text
                },
                finish_reason: 'stop'
              }
            ],
            usage: {
              prompt_tokens: result.usageMetadata?.promptTokenCount || 0,
              completion_tokens: result.usageMetadata?.candidatesTokenCount || 0,
              total_tokens: result.usageMetadata?.totalTokenCount || 0
            }
          };

          console.log('✅ Gemini 3.0 Pro response:', text.substring(0, 200) + '...');
          return res.json(openaiResponse);

    } catch (error) {
          console.error('❌ Gemini 3.0 Pro API error:', error);
          return res.status(500).json({
            error: 'Gemini 3.0 Pro API error',
            details: error.message,
            stack: error.stack
          });
        }
    }

    // Fallback to OpenAI for non-Gemini models
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-test-key-for-development') {
      console.error('❌ OpenAI API key not configured or using test key');
      return res.status(500).json({
        error: 'OpenAI API key not properly configured',
        message: 'Please set a valid OPENAI_API_KEY in the .env file. Current key is: ' + (process.env.OPENAI_API_KEY ? 'TEST_KEY' : 'NOT_SET'),
        details: 'Get your API key from https://platform.openai.com/api-keys'
      });
    }

    try {
      // Check if streaming is requested
      const isStreaming = req.body.stream === true;
      console.log('📡 Streaming mode:', isStreaming);

      if (isStreaming) {
        // Handle streaming response
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const stream = await curlWithProxy('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
            'User-Agent': 'curl/7.68.0',
            'Accept': '*/*'
          },
          data: req.body,
          stream: true
        });

        // Set UTF-8 encoding on the stream to properly handle multi-byte characters
        stream.setEncoding('utf8');

        // Pipe the stream to response
        stream.on('data', (chunk) => {
          // chunk is already a string with proper UTF-8 encoding
          res.write(chunk);
        });

        stream.on('end', () => {
          res.end();
        });

        stream.on('error', (error) => {
          console.error('❌ Streaming error:', error);
          res.status(500).end();
        });

      } else {
        // Handle regular response
        console.log('⏱️ [BACKEND TIMING] T+' + (Date.now() - requestStartTime) + 'ms: Starting OpenAI API call');
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

        console.log('⏱️ [BACKEND TIMING] T+' + (Date.now() - requestStartTime) + 'ms: Sending response to client');
        res.json(response);
      }
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

  // GPT-5.1 responses endpoint
  app.post('/api/responses', async (req, res) => {
    console.log('🚀 [API] /api/responses endpoint called');
    console.log('🚀 [API] Headers:', JSON.stringify(req.headers, null, 2));
    console.log('🚀 [API] Method:', req.method);
    console.log('🚀 [API] URL:', req.url);
    console.log('🚀 [API] Body:', req.body);

    const requestStartTime = Date.now();
    console.log('📨 [BACKEND TIMING] T+0ms: LLM responses request received');
    const requestBodyStr = JSON.stringify(req.body);
    console.log('📨 Request body length:', requestBodyStr.length, 'characters');
    console.log('📨 Request body preview:', requestBodyStr.substring(0, 500) + '...');

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-test-key-for-development') {
      console.error('❌ OpenAI API key not configured or using test key');
      console.error('❌ Current OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET (length: ' + process.env.OPENAI_API_KEY.length + ')' : 'NOT_SET');
      return res.status(500).json({
        error: 'OpenAI API key not properly configured',
        message: 'Please set a valid OPENAI_API_KEY in the .env file. Current key is: ' + (process.env.OPENAI_API_KEY ? 'TEST_KEY' : 'NOT_SET'),
        details: 'Get your API key from https://platform.openai.com/api-keys'
      });
    }

    try {
      console.log('🔍 [BACKEND TIMING] T+' + (Date.now() - requestStartTime) + 'ms: Parsing request body');
      const { model, input } = req.body;

      if (!input) {
        console.error('❌ Missing input field in request');
        return res.status(400).json({
          error: 'Missing input field',
          required: ['input']
        });
      }

      console.log('🔍 [BACKEND TIMING] T+' + (Date.now() - requestStartTime) + 'ms: Input length:', input.length, 'characters');
      
      // Use OpenAI client
      const { OpenAI } = require('openai');
      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });

      let output_text;

      // Use chat.completions API (standard OpenAI API)
      console.log('🔍 [BACKEND TIMING] T+' + (Date.now() - requestStartTime) + 'ms: Calling chat.completions API');
      try {
        const model = req.body.model || 'gpt-4o';
        console.log('🤖 Using model:', model);
        
        const chatResponse = await client.chat.completions.create({
          model: model,
          messages: [{ role: 'user', content: input }],
          max_tokens: 10000,
          temperature: 0.7
        });

        output_text = chatResponse.choices[0].message.content;

        console.log('✅ [BACKEND TIMING] T+' + (Date.now() - requestStartTime) + 'ms: Response received via chat.completions');
        console.log('📥 Response output_text length:', output_text ? output_text.length : 0);
        console.log('📥 Response output_text preview:', output_text ? output_text.substring(0, 200) + '...' : 'EMPTY!');

      } catch (chatError) {
        console.error('❌ [BACKEND TIMING] T+' + (Date.now() - requestStartTime) + 'ms: chat.completions failed:', chatError.message);
        console.error('❌ Error details:', chatError);
        throw chatError; // Re-throw to be caught by outer catch
      }

      if (!output_text || output_text.trim().length === 0) {
        console.error('❌ OpenAI returned empty output_text!');
        throw new Error('OpenAI returned empty response');
      }

      const requestDuration = Date.now() - requestStartTime;
      console.log(`✅ [BACKEND TIMING] T+${requestDuration}ms: LLM response completed`);

      res.json({
        output_text: output_text
      });

    } catch (error) {
      console.error('❌ LLM API error:', error.message);
      console.error('❌ Error stack:', error.stack);
      console.error('❌ Error details:', error);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error code:', error.code);
      res.status(500).json({
        error: 'LLM API error',
        details: error.message,
        type: error.constructor.name,
        stack: error.stack
      });
    }
  });

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

ВАЖНО: Отвечай ТОЛЬКО валидным JSON формате, без каких-либо markdown блоков, без markdown обертки, без дополнительного текста. Первый символ ответа должен быть '{', последний '}'.

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
        model: 'gemini-3-pro-preview',
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
      console.log('🔧 Request body:', JSON.stringify(requestBody, null, 2));
      console.log('🔧 Using proxy:', !!PROXY_URL);
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

      console.log('📥 Raw OpenAI response:', responseOutput.substring(0, 500) + '...');

      const response = JSON.parse(responseOutput);

      if (!response.choices || !response.choices[0] || !response.choices[0].message) {
        console.error('❌ Invalid response structure:', JSON.stringify(response, null, 2));
        throw new Error('Invalid response structure from OpenAI');
      }

      const content = response.choices[0].message.content;
      console.log('📥 OpenAI response content:', content ? content.substring(0, 200) + '...' : 'EMPTY CONTENT!');
      console.log('📥 Full message object:', JSON.stringify(response.choices[0].message, null, 2));

      if (!content || content.trim().length === 0) {
        console.error('❌ OpenAI returned empty content!');
        throw new Error('OpenAI returned empty response content');
      }

      // Parse the JSON response
      let planData;
      try {
        console.log('🔍 Looking for JSON in learning plan response...');
        // Try to extract JSON from markdown code blocks first
        let jsonMatch = content.match(/```json\s*(\{[\s\S]*?\})\s*```/);
        console.log('🔍 Learning plan - Markdown JSON match:', !!jsonMatch, jsonMatch?.[0]?.substring(0, 100) + '...');
        if (!jsonMatch) {
          // Fallback to plain JSON
          jsonMatch = content.match(/\{[\s\S]*\}/);
          console.log('🔍 Learning plan - Plain JSON match:', !!jsonMatch, jsonMatch?.[0]?.substring(0, 100) + '...');
        }
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        // Use the captured group if it exists (from markdown), otherwise use the full match
        const jsonString = jsonMatch[1] || jsonMatch[0];
        planData = JSON.parse(jsonString);
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
      console.log('🎨 Image generation request:', JSON.stringify(req.body, null, 2));
      
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-test-key-for-development') {
        console.error('❌ OpenAI API key not configured');
        return res.status(500).json({
          error: 'OpenAI API key not configured',
          details: 'Please set OPENAI_API_KEY in environment variables'
        });
      }

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
      
      console.log('✅ Image generation response received');
      const response = JSON.parse(responseOutput);
      res.json(response);
    } catch (error) {
      console.error('❌ Images generations error:', error);
      res.status(500).json({
        error: 'OpenAI Images API error',
        details: error.message
      });
    }
  });

  // Text-to-Speech
  app.post('/api/audio/speech', async (req, res) => {
    try {
      console.log('🎤 TTS API called with body:', JSON.stringify(req.body));

      // Use node-fetch for better reliability instead of curl spawn
      const fetch = (await import('node-fetch')).default;

      console.log('📡 Making fetch request to OpenAI TTS API...');

      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body)
      });

      console.log('📡 OpenAI TTS response status:', response.status);
      console.log('📡 OpenAI TTS response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ OpenAI TTS API error response:', errorText);
        return res.status(response.status).json({
          error: 'OpenAI TTS API error',
          details: errorText
        });
      }

      // Set proper content type
      const contentType = response.headers.get('content-type') || 'audio/mpeg';
      res.setHeader('Content-Type', contentType);
      console.log('🔊 TTS Content-Type set to:', contentType);

      // Get content length for logging
      const contentLength = response.headers.get('content-length');
      console.log('🔊 TTS Content-Length:', contentLength);

      // Stream the response directly to client
      response.body.pipe(res);

      console.log('✅ TTS audio streaming started');

    } catch (error) {
      console.error('❌ TTS error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          error: 'OpenAI TTS API error',
          details: error.message
        });
      }
    }
  });

  // Audio Transcription (Whisper)
  app.post('/api/audio/transcriptions', async (req, res) => {
    try {
      console.log('🎤 Transcription API called at', new Date().toISOString());

      // Check if file was uploaded
      if (!req.files || !req.files.file) {
        return res.status(400).json({ error: 'No audio file provided' });
      }

      const audioFile = req.files.file;
      console.log('📁 Received audio file:', audioFile.name, 'Size:', audioFile.size);

      console.log('📡 Sending to OpenAI Whisper API...');

      // Use curlWithProxy for consistent proxy handling
      const FormData = require('form-data');
      const form = new FormData();

      form.append('file', audioFile.data, {
        filename: 'audio.webm',
        contentType: 'audio/webm'
      });
      form.append('model', 'whisper-1');
      form.append('language', 'ru');
      form.append('response_format', 'json');

      console.log('📡 Making direct fetch request to OpenAI Whisper API...');

      try {
        const fetch = (await import('node-fetch')).default;

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`
          },
          body: form
        });

        console.log('📡 Whisper response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Whisper API error:', errorText);

          // Check for region blocking error
          if (errorText.includes('unsupported_country_region_territory')) {
            console.warn('⚠️ Whisper API blocked for this region, using fallback...');
            res.json({
              text: 'Привет, я готов учиться!',
              language: 'ru',
              fallback: true
            });
            return;
          }

          throw new Error(`Whisper API returned ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Transcription successful:', result.text?.substring(0, 50) + '...');

        res.json({
          text: result.text || '',
          language: result.language || 'ru'
        });

      } catch (error) {
        console.error('❌ Transcription error:', error);
        res.status(500).json({
          error: 'OpenAI Whisper API error',
          details: error.message
        });
      }
    } catch (error) {
      console.error('❌ Transcription setup error:', error);
      res.status(500).json({
        error: 'Failed to process audio file',
        details: error.message
      });
    }
  });

  // Запускаем сервер
  const server = app.listen(process.env.PORT, () => {
    console.log(`✅ Единый сервер запущен на порту ${process.env.PORT}`);
    console.log('');
    console.log('🎉 TRUE SINGLE-PORT SERVER ГОТОВ!');
    console.log('==================================');
    console.log(`🌐 Доступно на: http://localhost:${process.env.PORT}`);
    console.log(`📡 API: http://localhost:${process.env.PORT}/api/*`);
    console.log(`💻 Frontend: http://localhost:${process.env.PORT}/`);
    console.log(`💚 Health: http://localhost:${process.env.PORT}/health`);
    console.log('');
    console.log(`ТОЛЬКО ОДИН ПОРТ: ${process.env.PORT} ✅`);
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
    console.log('🚨 LEARNING PLAN POST REQUEST RECEIVED!');
    console.log('📦 Raw request body:', JSON.stringify(req.body, null, 2));

    try {
      console.log('📨 Received learning plan POST request');
      console.log('📦 Request body keys:', Object.keys(req.body));
      console.log('📦 Request body types:', Object.keys(req.body).map(key => `${key}: ${typeof req.body[key]}`));

      const { user_id, course_id, subject_name, grade, plan_data } = req.body;
      
      console.log('🔍 Extracted fields:', {
        user_id, course_id, subject_name, grade,
        plan_data_type: typeof plan_data,
        plan_data_keys: plan_data ? Object.keys(plan_data) : 'null'
      });
      
      if (user_id === undefined || user_id === null ||
          course_id === undefined || course_id === null ||
          subject_name === undefined || subject_name === null ||
          grade === undefined || grade === null ||
          plan_data === undefined || plan_data === null) {

        console.log('❌ Missing required fields (checking for null/undefined):', {
          user_id: { value: user_id, type: typeof user_id, isNull: user_id === null, isUndefined: user_id === undefined },
          course_id: { value: course_id, type: typeof course_id, isNull: course_id === null, isUndefined: course_id === undefined },
          subject_name: { value: subject_name, type: typeof subject_name, isNull: subject_name === null, isUndefined: subject_name === undefined },
          grade: { value: grade, type: typeof grade, isNull: grade === null, isUndefined: grade === undefined },
          plan_data: { value: plan_data, type: typeof plan_data, isNull: plan_data === null, isUndefined: plan_data === undefined }
        });

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

  // Get all learning plans for user (MUST be before the :user_id/:course_id route!)
  app.get('/api/db/learning-plans/user/:user_id', (req, res) => {
    try {
      const { user_id } = req.params;

      console.log(`📚 Fetching all learning plans for user ${user_id}`);
      console.log(`🔍 User ID type: ${typeof user_id}, value: '${user_id}'`);

      // Ensure user exists, create if not
      const userCheck = db.prepare('SELECT id FROM users WHERE id = ?').get(user_id);
      console.log(`👤 User check result:`, userCheck);
      if (!userCheck) {
        console.log(`👤 User ${user_id} not found, creating...`);
        const createUser = db.prepare(`
          INSERT INTO users (id, username, email, password_hash, first_name, last_name, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `);
        createUser.run(user_id, `user_${user_id}`, `user_${user_id}@temp.com`, 'temp_password_hash', 'Temp', 'User');
      }

      console.log(`🗃️ Querying database for user_id: '${user_id}' (type: ${typeof user_id})`);
      
      // Try using BigInt for user_id to ensure 64-bit integer compatibility
      let plans = [];
      try {
        const bigIntUserId = BigInt(user_id);
        console.log(`🔄 Converting to BigInt: ${bigIntUserId}`);
        
        plans = db.prepare(`
        SELECT * FROM learning_plans
        WHERE user_id = ?
        ORDER BY updated_at DESC
        `).all(bigIntUserId);
        
        console.log(`🔍 Found with BigInt query: ${plans.length}`);
      } catch (e) {
        console.log('⚠️ Failed to use BigInt query:', e.message);
      }

      if (plans.length === 0) {
         console.log('🔄 Trying string query...');
         plans = db.prepare(`
          SELECT * FROM learning_plans
          WHERE CAST(user_id AS TEXT) = ?
          ORDER BY updated_at DESC
        `).all(String(user_id));
        console.log(`🔍 Found with CAST(AS TEXT) query: ${plans.length}`);
      }

      if (plans.length === 0) {
        console.log('🔄 Trying to load IDs only and filter in JS (fallback 2)...');
        // Select only minimal fields to avoid memory issues or BLOB problems
        const allPlanIds = db.prepare('SELECT id, user_id FROM learning_plans ORDER BY updated_at DESC').all();
        console.log(`🗄️ Loaded ${allPlanIds.length} plan IDs from DB`);
        
        const matchingIds = allPlanIds.filter(p => {
          return String(p.user_id).trim() === String(user_id).trim();
        }).map(p => p.id);
        
        console.log(`🔍 Found matching IDs: ${matchingIds.join(', ')}`);
        
        if (matchingIds.length > 0) {
          const placeholders = matchingIds.map(() => '?').join(',');
          plans = db.prepare(`SELECT * FROM learning_plans WHERE id IN (${placeholders})`).all(...matchingIds);
          console.log(`✅ Loaded ${plans.length} full plans by ID`);
        }
      }

      console.log(`📊 Found ${plans.length} plans in database for user ${user_id}`);
      console.log(`📋 Plans details:`, plans.map(p => ({
        id: p.id,
        user_id: p.user_id,
        course_id: p.course_id,
        subject_name: p.subject_name,
        created_at: p.created_at
      })));

      // Debug: check what query returns
      const allPlansInDb = db.prepare('SELECT COUNT(*) as count FROM learning_plans').get();
      const numericUserId = parseInt(user_id);
      const userPlansInDb = db.prepare('SELECT COUNT(*) as count FROM learning_plans WHERE user_id = ?').get(numericUserId);
      console.log(`🗄️ Total plans in DB: ${allPlansInDb.count}, plans for user ${numericUserId}: ${userPlansInDb.count}`);

      // Always return plans, even if empty array
      console.log(`✅ Returning ${plans.length} plans for user ${user_id}`);

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
      console.log(`📊 Plans summary:`, formattedPlans.map(p => ({
        id: p.id,
        course_id: p.course_id,
        subject: p.subject_name,
        lessons: p.plan_data?.lessons?.length || 0
      })));

      res.json({
        success: true,
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

  // Get learning plan by user and course
  app.get('/api/db/learning-plans/:user_id/:course_id', (req, res) => {
    try {
      const { user_id, course_id } = req.params;

      console.log(`📚 Fetching learning plan for user ${user_id}, course ${course_id}`);

      // Extract numeric course_id (in case it comes as "4-10", we need just "4")
      const baseCourseId = String(course_id).split('-')[0];
      const numericCourseId = parseInt(baseCourseId);
      
      console.log(`🔄 Extracted numeric course_id: ${numericCourseId} from ${course_id}`);

      if (isNaN(numericCourseId)) {
        return res.status(400).json({
          status: 'error',
          message: 'course_id must be a number or contain a number',
          received: course_id,
          extracted: baseCourseId
        });
      }

      const numericUserId = parseInt(user_id);
      console.log(`🔄 Converting user_id to numeric: ${numericUserId} from '${user_id}'`);

      const plan = db.prepare(`
        SELECT * FROM learning_plans
        WHERE user_id = ? AND course_id = ?
      `).get(numericUserId, numericCourseId);

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

  // Debug endpoint
  app.get('/api/debug/all-plans', (req, res) => {
    try {
      const allPlans = db.prepare('SELECT id, user_id, course_id, subject_name FROM learning_plans').all();
      res.json({ 
        count: allPlans.length,
        plans: allPlans.map(p => ({ ...p, userIdType: typeof p.user_id, userIdStr: String(p.user_id) }))
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // ==================== LESSON SESSION API ROUTES ====================
  
  // Create or update lesson session
  app.post('/api/lesson-sessions', (req, res) => {
    try {
      const {
        user_id,
        course_name,
        lesson_title,
        lesson_topic,
        lesson_number,
        lesson_notes,
        current_note_index,
        call_transcript
      } = req.body;

      if (!course_name || !lesson_title || !lesson_notes) {
        return res.status(400).json({
          status: 'error',
          message: 'course_name, lesson_title, and lesson_notes are required'
        });
      }

      const notesArray = Array.isArray(lesson_notes) ? lesson_notes : JSON.parse(lesson_notes);
      const totalNotes = notesArray.length;
      const notesJson = JSON.stringify(notesArray);

      console.log('📝 Creating/updating lesson session:', {
        course_name,
        lesson_title,
        total_notes: totalNotes,
        current_note_index: current_note_index || 0
      });

      // Check if session already exists for this lesson
      const existingSession = db.prepare(`
        SELECT id FROM lesson_sessions
        WHERE user_id IS ? AND course_name = ? AND lesson_title = ? AND session_status = 'in_progress'
        ORDER BY started_at DESC LIMIT 1
      `).get(user_id || null, course_name, lesson_title);

      if (existingSession) {
        // Update existing session
        const stmt = db.prepare(`
          UPDATE lesson_sessions
          SET lesson_notes = ?,
              current_note_index = ?,
              total_notes = ?,
              call_transcript = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);
        stmt.run(notesJson, current_note_index || 0, totalNotes, call_transcript || '', existingSession.id);

        res.json({
          status: 'success',
          message: 'Lesson session updated',
          session_id: existingSession.id
        });
      } else {
        // Create new session
        const stmt = db.prepare(`
          INSERT INTO lesson_sessions (
            user_id, course_name, lesson_title, lesson_topic, lesson_number,
            lesson_notes, current_note_index, total_notes, call_transcript
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(
          user_id || null,
          course_name,
          lesson_title,
          lesson_topic || '',
          lesson_number || null,
          notesJson,
          current_note_index || 0,
          totalNotes,
          call_transcript || ''
        );

        res.json({
          status: 'success',
          message: 'Lesson session created',
          session_id: result.lastInsertRowid
        });
      }
    } catch (error) {
      console.error('❌ Error creating/updating lesson session:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  });

  // Get active lesson session
  app.get('/api/lesson-sessions/active', (req, res) => {
    try {
      const { user_id, course_name, lesson_title } = req.query;

      let query = `
        SELECT * FROM lesson_sessions
        WHERE session_status = 'in_progress'
      `;
      const params = [];

      if (user_id) {
        query += ` AND user_id = ?`;
        params.push(user_id);
      } else {
        query += ` AND user_id IS NULL`;
      }

      if (course_name) {
        query += ` AND course_name = ?`;
        params.push(course_name);
      }

      if (lesson_title) {
        query += ` AND lesson_title = ?`;
        params.push(lesson_title);
      }

      query += ` ORDER BY updated_at DESC LIMIT 1`;

      const session = db.prepare(query).get(...params);

      if (session) {
        // Parse lesson_notes JSON
        session.lesson_notes = JSON.parse(session.lesson_notes);
        
        res.json({
          status: 'success',
          session
        });
      } else {
        res.json({
          status: 'success',
          session: null
        });
      }
    } catch (error) {
      console.error('❌ Error fetching active session:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  });

  // Update lesson progress
  app.put('/api/lesson-sessions/:sessionId/progress', (req, res) => {
    try {
      const { sessionId } = req.params;
      const { current_note_index, call_transcript, lesson_notes } = req.body;

      console.log('📝 Updating lesson progress:', {
        session_id: sessionId,
        current_note_index,
        transcript_length: call_transcript?.length || 0,
        lesson_notes_updated: !!lesson_notes
      });

      const updates = [];
      const params = [];

      if (current_note_index !== undefined) {
        updates.push('current_note_index = ?');
        params.push(current_note_index);
      }

      if (call_transcript !== undefined) {
        updates.push('call_transcript = ?');
        params.push(call_transcript);
      }

      if (lesson_notes !== undefined) {
        updates.push('lesson_notes = ?');
        params.push(JSON.stringify(lesson_notes));
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      params.push(sessionId);

      const stmt = db.prepare(`
        UPDATE lesson_sessions
        SET ${updates.join(', ')}
        WHERE id = ?
      `);
      stmt.run(...params);

      res.json({
        status: 'success',
        message: 'Progress updated'
      });
    } catch (error) {
      console.error('❌ Error updating progress:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  });

  // Complete lesson session
  app.put('/api/lesson-sessions/:sessionId/complete', (req, res) => {
    try {
      const { sessionId } = req.params;

      console.log('✅ Completing lesson session:', sessionId);

      const stmt = db.prepare(`
        UPDATE lesson_sessions
        SET session_status = 'completed',
            completed_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      stmt.run(sessionId);

      res.json({
        status: 'success',
        message: 'Lesson session completed'
      });
    } catch (error) {
      console.error('❌ Error completing session:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  });

  // Get all sessions for user
  app.get('/api/lesson-sessions', (req, res) => {
    try {
      const { user_id, status, limit } = req.query;

      let query = `SELECT * FROM lesson_sessions WHERE 1=1`;
      const params = [];

      if (user_id) {
        query += ` AND user_id = ?`;
        params.push(user_id);
      } else {
        query += ` AND user_id IS NULL`;
      }

      if (status) {
        query += ` AND session_status = ?`;
        params.push(status);
      }

      query += ` ORDER BY updated_at DESC`;

      if (limit) {
        query += ` LIMIT ?`;
        params.push(parseInt(limit));
      }

      const sessions = db.prepare(query).all(...params);

      // Parse lesson_notes for each session
      sessions.forEach(session => {
        try {
          session.lesson_notes = JSON.parse(session.lesson_notes);
        } catch (e) {
          session.lesson_notes = [];
        }
      });

      res.json({
        status: 'success',
        sessions
      });
    } catch (error) {
      console.error('❌ Error fetching sessions:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  });

  // ==================== GENERATED LESSONS API ROUTES ====================

  // Save generated lesson
  app.post('/api/generated-lessons', (req, res) => {
    try {
      const {
        course_name,
        lesson_title,
        lesson_topic,
        lesson_number,
        lesson_notes,
        generation_prompt,
        conversation_history,
        interaction_type,
        is_template
      } = req.body;

      if (!course_name || !lesson_title || !lesson_notes) {
        return res.status(400).json({
          status: 'error',
          message: 'course_name, lesson_title, and lesson_notes are required'
        });
      }

      const notesArray = Array.isArray(lesson_notes) ? lesson_notes : JSON.parse(lesson_notes);
      const totalNotes = notesArray.length;

      console.log('💾 Saving generated lesson:', {
        course_name,
        lesson_title,
        total_notes: totalNotes,
        is_template: is_template || false
      });

      // Check if lesson already exists
      const existingLesson = db.prepare(`
        SELECT id FROM generated_lessons
        WHERE lesson_title = ? AND course_name = ?
      `).get(lesson_title, course_name);

      let result;
      if (existingLesson) {
        // Update existing lesson
        console.log('📝 Updating existing lesson:', existingLesson.id);
        const updateStmt = db.prepare(`
          UPDATE generated_lessons
          SET lesson_topic = ?,
              lesson_number = ?,
              lesson_notes = ?,
              total_notes = ?,
              generation_prompt = ?,
              conversation_history = ?,
              interaction_type = ?,
              is_template = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);

        updateStmt.run(
          lesson_topic || '',
          lesson_number || null,
          JSON.stringify(notesArray),
          totalNotes,
          generation_prompt || '',
          conversation_history ? JSON.stringify(conversation_history) : null,
          interaction_type || 'voice',
          is_template ? 1 : 0,
          existingLesson.id
        );

        result = { lastInsertRowid: existingLesson.id, changes: 1 };
      } else {
        // Create new lesson
        console.log('🆕 Creating new lesson');
        const insertStmt = db.prepare(`
          INSERT INTO generated_lessons (
            course_name, lesson_title, lesson_topic, lesson_number,
            lesson_notes, total_notes, generation_prompt, conversation_history,
            interaction_type, is_template
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        result = insertStmt.run(
          course_name,
          lesson_title,
          lesson_topic || '',
          lesson_number || null,
          JSON.stringify(notesArray),
          totalNotes,
          generation_prompt || '',
          conversation_history ? JSON.stringify(conversation_history) : null,
          interaction_type || 'voice',
          is_template ? 1 : 0
        );
      }

      res.json({
        status: 'success',
        message: 'Lesson saved successfully',
        lesson_id: result.lastInsertRowid
      });
    } catch (error) {
      console.error('❌ Error saving generated lesson:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  });

  // Get generated lessons
  app.get('/api/generated-lessons', (req, res) => {
    try {
      const { course_name, is_template, limit } = req.query;

      let query = `SELECT * FROM generated_lessons WHERE is_active = 1`;
      const params = [];

      if (course_name) {
        query += ` AND course_name = ?`;
        params.push(course_name);
      }

      if (is_template !== undefined) {
        query += ` AND is_template = ?`;
        params.push(is_template === 'true' ? 1 : 0);
      }

      query += ` ORDER BY created_at DESC`;

      if (limit) {
        query += ` LIMIT ?`;
        params.push(parseInt(limit));
      }

      const lessons = db.prepare(query).all(...params);

      // Parse lesson_notes for each lesson
      lessons.forEach(lesson => {
        try {
          lesson.lesson_notes = JSON.parse(lesson.lesson_notes);
        } catch (e) {
          lesson.lesson_notes = [];
        }
      });

      res.json({
        status: 'success',
        lessons
      });
    } catch (error) {
      console.error('❌ Error fetching generated lessons:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  });

  // Get specific generated lesson
  app.get('/api/generated-lessons/:lessonId', (req, res) => {
    try {
      const { lessonId } = req.params;

      const lesson = db.prepare(`
        SELECT * FROM generated_lessons
        WHERE id = ? AND is_active = 1
      `).get(lessonId);

      if (lesson) {
        // Parse lesson_notes
        try {
          lesson.lesson_notes = JSON.parse(lesson.lesson_notes);
        } catch (e) {
          lesson.lesson_notes = [];
        }

        res.json({
          status: 'success',
          lesson
        });
      } else {
        res.status(404).json({
          status: 'error',
          message: 'Lesson not found'
        });
      }
    } catch (error) {
      console.error('❌ Error fetching generated lesson:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  });

  // Update generated lesson
  app.put('/api/generated-lessons/:lessonId', (req, res) => {
    try {
      const { lessonId } = req.params;
      const { lesson_notes, is_template } = req.body;

      console.log('📝 Updating generated lesson:', lessonId);

      const updates = [];
      const params = [];

      if (lesson_notes !== undefined) {
        updates.push('lesson_notes = ?');
        const notesArray = Array.isArray(lesson_notes) ? lesson_notes : JSON.parse(lesson_notes);
        params.push(JSON.stringify(notesArray));
        updates.push('total_notes = ?');
        params.push(notesArray.length);
      }

      if (is_template !== undefined) {
        updates.push('is_template = ?');
        params.push(is_template ? 1 : 0);
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      params.push(lessonId);

      const stmt = db.prepare(`
        UPDATE generated_lessons
        SET ${updates.join(', ')}
        WHERE id = ?
      `);

      stmt.run(...params);

      res.json({
        status: 'success',
        message: 'Lesson updated successfully'
      });
    } catch (error) {
      console.error('❌ Error updating generated lesson:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  });

  // Delete generated lesson
  app.delete('/api/generated-lessons/:lessonId', (req, res) => {
    try {
      const { lessonId } = req.params;

      console.log('🗑️ Deleting generated lesson:', lessonId);

      const stmt = db.prepare(`
        UPDATE generated_lessons
        SET is_active = 0, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      stmt.run(lessonId);

      res.json({
        status: 'success',
        message: 'Lesson deleted successfully'
      });
    } catch (error) {
      console.error('❌ Error deleting generated lesson:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  });

  // ⚠️ ВАЖНО: static files и SPA fallback ДОЛЖНЫ быть в конце, ПОСЛЕ ВСЕХ API маршрутов!
  console.log('📂 Настраиваем static файлы и SPA fallback...');

  // Настраиваем static файлы для public (видео, изображения и т.д.)
  app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
      if (path.endsWith('.mp4')) {
        res.setHeader('Content-Type', 'video/mp4');
      }
    }
  }));

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

  // Get course details with current lesson
  app.get('/api/courses/:courseId', (req, res) => {
    console.log('🔥 API endpoint /api/courses/:courseId called with courseId:', req.params.courseId);
    try {
      const { courseId } = req.params;

      console.log('📚 Getting course details:', courseId);

      // Get course info
      const courseStmt = db.prepare(`
        SELECT c.*, COUNT(l.id) as lesson_count
        FROM courses c
        LEFT JOIN lessons l ON c.id = l.course_id AND l.is_active = 1
        WHERE c.id = ? AND c.is_active = 1
        GROUP BY c.id
      `);

      const course = courseStmt.get(courseId);

      if (!course) {
        return res.status(404).json({
          status: 'error',
          message: 'Course not found'
        });
      }

      // Get current lesson (first incomplete lesson or first lesson)
      const lessonStmt = db.prepare(`
        SELECT l.*,
               CASE WHEN up.id IS NOT NULL THEN 1 ELSE 0 END as is_completed
        FROM lessons l
        LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = ? AND up.is_completed = 1
        WHERE l.course_id = ? AND l.is_active = 1
        ORDER BY l.lesson_number ASC
      `);

      // For now, get lessons without user progress (we don't have user_id in params)
      const lessonsStmt = db.prepare(`
        SELECT l.*
        FROM lessons l
        WHERE l.course_id = ? AND l.is_active = 1
        ORDER BY l.lesson_number ASC
        LIMIT 1
      `);

      const currentLesson = lessonsStmt.get(courseId);

      const courseData = {
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level,
        grade: course.level === 'Начальный' ? '1 класс' : course.level === 'Средний' ? '5 класс' : '10 класс',
        progress: 0, // TODO: Calculate from user progress
        modules: course.lesson_count || 0,
        completedModules: 0, // TODO: Calculate from user progress
        students: 1, // Placeholder
        currentLesson: currentLesson ? {
          number: currentLesson.lesson_number,
          title: currentLesson.title,
          topic: currentLesson.title,
          content: currentLesson.content || course.description
        } : null
      };

      res.json(courseData);
    } catch (error) {
      console.error('❌ Error getting course:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
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
