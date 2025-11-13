/**
 * SQLite Database Architecture
 * Professional schema for educational platform
 */

import Database from 'better-sqlite3';
import path from 'path';

// Database initialization with professional schema
export function initializeDatabase(): Database.Database {
  const dbPath = path.join(process.cwd(), 'teacher.db');
  const db = new Database(dbPath);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');

  // Create tables if they don't exist
  db.exec(`
    -- Users Table: Store user accounts and profiles
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

    -- Courses Table: Store course information
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

    -- Lessons Table: Store individual lessons
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

    -- User Progress Table: Track user's progress in courses/lessons
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

    -- Assessments Table: Store test/assessment data
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

    -- Assessment Questions Table: Store detailed question data
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

    -- Achievements Table: Store user achievements/badges
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

    -- Learning Preferences Table: Store user preferences
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

    -- Create indexes for performance
    CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON user_progress(lesson_id);
    CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
    CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
    CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
    CREATE INDEX IF NOT EXISTS idx_assessment_questions_assessment_id ON assessment_questions(assessment_id);
  `);

  console.log('✅ SQLite database initialized successfully');
  return db;
}

// Export types for TypeScript
export type User = {
  id: number;
  username: string;
  email: string;
  cefr_level: string;
  total_lessons_completed: number;
  total_assessments_taken: number;
  streak_days: number;
};

export type Assessment = {
  id: number;
  user_id: number;
  assessment_type: string;
  cefr_level: string;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  timestamp: string;
};

export type UserProgress = {
  id: number;
  user_id: number;
  lesson_id: number;
  status: string;
  progress_percentage: number;
  completed_at: string | null;
};

// Helper functions for database operations
export const dbQueries = {
  // Users
  getUser: (db: Database.Database, userId: number) => {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  },
  
  getUserByEmail: (db: Database.Database, email: string) => {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },
  
  createUser: (db: Database.Database, user: any) => {
    const stmt = db.prepare(`
      INSERT INTO users (username, email, password_hash, first_name, last_name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);
    return stmt.run(user.username, user.email, user.password_hash, user.first_name, user.last_name);
  },

  // Assessments
  saveAssessment: (db: Database.Database, assessment: any) => {
    const stmt = db.prepare(`
      INSERT INTO assessments (user_id, lesson_id, assessment_type, cefr_level, total_questions, correct_answers, score_percentage, duration_seconds, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    return stmt.run(
      assessment.user_id,
      assessment.lesson_id,
      assessment.assessment_type,
      assessment.cefr_level,
      assessment.total_questions,
      assessment.correct_answers,
      assessment.score_percentage,
      assessment.duration_seconds
    );
  },

  getUserAssessments: (db: Database.Database, userId: number) => {
    return db.prepare(`
      SELECT * FROM assessments 
      WHERE user_id = ? 
      ORDER BY timestamp DESC 
      LIMIT 10
    `).all(userId);
  },

  // Progress
  updateUserProgress: (db: Database.Database, userId: number, lessonId: number, courseId: number, progress: any) => {
    const stmt = db.prepare(`
      INSERT INTO user_progress (user_id, lesson_id, course_id, status, progress_percentage, started_at, completed_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
      ON CONFLICT(user_id, lesson_id) DO UPDATE SET
        status = excluded.status,
        progress_percentage = excluded.progress_percentage,
        completed_at = excluded.completed_at,
        attempts = attempts + 1
    `);
    return stmt.run(
      userId,
      lessonId,
      courseId,
      progress.status,
      progress.progress_percentage,
      progress.completed_at
    );
  },

  getUserProgress: (db: Database.Database, userId: number, courseId: number) => {
    return db.prepare(`
      SELECT * FROM user_progress 
      WHERE user_id = ? AND course_id = ?
    `).all(userId, courseId);
  },
};

