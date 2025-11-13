/**
 * Database API Routes for Single Port Server
 * Add these routes to single-port-server.cjs
 */

const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
function initDatabase() {
  const dbPath = path.join(process.cwd(), 'teacher.db');
  const db = new Database(dbPath);
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');

  // Create tables
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

  console.log('✅ Database initialized successfully');
  return db;
}

// API Routes to add to single-port-server
function setupDatabaseRoutes(app, db) {
  // Health check with DB
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

  // Create or update user
  app.post('/api/db/users', (req, res) => {
    try {
      const { username, email, first_name, last_name } = req.body;
      if (!username || !email) {
        return res.status(400).json({ status: 'error', message: 'Username and email are required' });
      }

      const password_hash = require('crypto').createHash('sha256').update(email).digest('hex');
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
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  // Save assessment
  app.post('/api/db/assessments', (req, res) => {
    try {
      const { user_id, assessment_type, cefr_level, total_questions, correct_answers, duration_seconds } = req.body;
      if (!user_id || !assessment_type) {
        return res.status(400).json({ status: 'error', message: 'user_id and assessment_type are required' });
      }

      const score_percentage = Math.round((correct_answers / total_questions) * 100);
      const stmt = db.prepare(`
        INSERT INTO assessments (user_id, assessment_type, cefr_level, total_questions, correct_answers, score_percentage, duration_seconds, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);
      
      const result = stmt.run(user_id, assessment_type, cefr_level, total_questions, correct_answers, score_percentage, duration_seconds);
      
      res.status(201).json({
        status: 'created',
        id: result.lastInsertRowid,
        score_percentage,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
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
        avg_score: db.prepare('SELECT AVG(score_percentage) as avg FROM assessments').get().avg || 0
      };
      res.json({ status: 'ok', stats });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  });
}

module.exports = { initDatabase, setupDatabaseRoutes };

