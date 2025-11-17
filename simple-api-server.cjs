require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Запуск Simple API Server на порту', PORT);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Инициализируем базу данных
const dbPath = path.join(__dirname, 'teacher.db');
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');
console.log('✅ SQLite Database connected at:', dbPath);

// Создаём таблицы БД
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
`);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Simple API Server is running' });
});

// Learning plans API
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
    
    // Создаём пользователя если не существует
    const userCheck = db.prepare('SELECT id FROM users WHERE id = ?').get(user_id);
    if (!userCheck) {
      console.log(`👤 User ${user_id} not found, creating...`);
    const createUser = db.prepare(`
        INSERT INTO users (id, username, email, password_hash, first_name, last_name, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);
    createUser.run(user_id, `user_${user_id}`, `user_${user_id}@temp.com`, 'temp_password_hash', 'Temp', 'User');
    }
    
    // Создаём learning plan
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
    const numericGrade = typeof grade === 'number' ? grade : parseInt(grade);
    
    const result = stmt.run(user_id, numericCourseId, subject_name, numericGrade, planDataStr);
    
    res.json({ 
      success: true, 
      id: result.lastInsertRowid,
      message: 'Learning plan saved successfully' 
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: error.message,
      code: error.code
    });
  }
});

app.get('/api/db/learning-plans/user/:user_id', (req, res) => {
  try {
    const { user_id } = req.params;
    
    // Создаём пользователя если не существует
    const userCheck = db.prepare('SELECT id FROM users WHERE id = ?').get(user_id);
    if (!userCheck) {
    const createUser = db.prepare(`
        INSERT INTO users (id, username, email, password_hash, first_name, last_name, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);
    createUser.run(user_id, `user_${user_id}`, `user_${user_id}@temp.com`, 'temp_password_hash', 'Temp', 'User');
    }
    
    // Получаем learning plans
    const getPlans = db.prepare('SELECT * FROM learning_plans WHERE user_id = ? ORDER BY created_at DESC');
    const plans = getPlans.all(user_id);
    
    res.json({ 
      success: true, 
      plans: plans.map(plan => ({
        ...plan,
        plan_data: typeof plan.plan_data === 'string' ? JSON.parse(plan.plan_data) : plan.plan_data
      }))
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: error.message,
      code: error.code
    });
  }
});

// Chat completions API
app.post('/api/chat/completions', async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-test-key-for-development') {
      console.log('🔄 Using mock response for testing (OpenAI API key not configured)');

      // Mock response that mimics OpenAI API structure
      const mockResponse = {
        id: 'chatcmpl-mock-' + Date.now(),
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: 'gpt-4',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: `{
  "title": "Введение в тему",
  "objective": "Цель урока - познакомить учащегося с основными понятиями и дать базовое понимание предмета",
  "duration": "45",
  "materials": ["Учебник", "Тетрадь", "Карандаш"],
  "content": "Здравствуйте! Сегодня мы начнем изучение новой темы. Это очень интересно и важно для вашего развития.",
  "practice": [
    {
      "type": "exercise",
      "description": "Выполните упражнение 1 на странице 15 учебника",
      "example": "Посмотрите на пример в учебнике"
    },
    {
      "type": "question",
      "description": "Ответьте на вопросы в конце параграфа",
      "example": "Вопрос 1: Что такое...?"
    }
  ],
  "assessment": "Проверьте свои знания, ответив на вопросы для самоконтроля в учебнике"
}`
          },
          finish_reason: 'stop'
        }],
        usage: {
          prompt_tokens: 150,
          completion_tokens: 300,
          total_tokens: 450
        }
      };

      // Add small delay to simulate API call
      setTimeout(() => {
        res.json(mockResponse);
      }, 1000);

      return;
    }

    const response = await axios.post('https://api.openai.com/v1/chat/completions', req.body, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Simple API Server запущен на порту ${PORT}`);
  console.log(`🔗 Health check: https://teacher.windexs.ru/api/health`);
});
