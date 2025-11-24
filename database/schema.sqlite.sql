-- =====================================================
-- TEACHER PLATFORM DATABASE SCHEMA - SQLite Version
-- Professional-grade database design for SQLite
-- =====================================================

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    
    -- User stats
    total_lessons_completed INTEGER DEFAULT 0,
    total_study_hours REAL DEFAULT 0,
    current_streak_days INTEGER DEFAULT 0,
    max_streak_days INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    
    -- Metadata
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    last_login_at TEXT,
    is_active INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- =====================================================
-- COURSES & CURRICULUM
-- =====================================================

CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    grade INTEGER,
    exam_type TEXT,
    
    difficulty_level TEXT DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    total_lessons INTEGER DEFAULT 0,
    estimated_hours REAL,
    
    image_url TEXT,
    icon_name TEXT,
    
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    is_active INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_courses_subject ON courses(subject);
CREATE INDEX IF NOT EXISTS idx_courses_grade ON courses(grade);
CREATE INDEX IF NOT EXISTS idx_courses_exam_type ON courses(exam_type);

CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    
    lesson_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    topic TEXT NOT NULL,
    description TEXT,
    content TEXT,
    
    learning_objectives TEXT, -- JSON
    key_concepts TEXT, -- JSON
    practice_exercises TEXT, -- JSON
    homework TEXT, -- JSON
    
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    
    UNIQUE (course_id, lesson_number)
);

CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_lesson_number ON lessons(lesson_number);

-- =====================================================
-- USER LEARNING PROGRESS
-- =====================================================

CREATE TABLE IF NOT EXISTS user_courses (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    
    enrolled_at TEXT DEFAULT (datetime('now')),
    last_accessed_at TEXT,
    
    current_lesson_number INTEGER DEFAULT 1,
    completed_lessons INTEGER DEFAULT 0,
    progress_percentage REAL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    total_study_time_minutes INTEGER DEFAULT 0,
    average_score REAL DEFAULT 0,
    
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'dropped')),
    
    UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_user_courses_user_id ON user_courses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_courses_course_id ON user_courses(course_id);
CREATE INDEX IF NOT EXISTS idx_user_courses_status ON user_courses(status);

CREATE TABLE IF NOT EXISTS user_lessons (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    user_course_id TEXT NOT NULL REFERENCES user_courses(id) ON DELETE CASCADE,
    
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'reviewed')),
    started_at TEXT,
    completed_at TEXT,
    
    score REAL,
    time_spent_minutes INTEGER DEFAULT 0,
    attempts_count INTEGER DEFAULT 0,
    
    homework_submitted INTEGER DEFAULT 0,
    homework_submitted_at TEXT,
    homework_content TEXT, -- JSON
    homework_feedback TEXT, -- JSON
    
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    
    UNIQUE (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_user_lessons_user_id ON user_lessons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lessons_lesson_id ON user_lessons(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_lessons_status ON user_lessons(status);

-- =====================================================
-- LEARNING PLANS
-- =====================================================

CREATE TABLE IF NOT EXISTS learning_plans (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    
    plan_data TEXT NOT NULL, -- JSON
    lessons_structure TEXT NOT NULL, -- JSON
    
    generated_at TEXT DEFAULT (datetime('now')),
    last_updated_at TEXT DEFAULT (datetime('now')),
    
    UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_learning_plans_user_id ON learning_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_plans_course_id ON learning_plans(course_id);

-- =====================================================
-- CHAT & MESSAGING
-- =====================================================

CREATE TABLE IF NOT EXISTS chat_sessions (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE SET NULL,
    lesson_id TEXT REFERENCES lessons(id) ON DELETE SET NULL,
    
    session_type TEXT DEFAULT 'interactive' CHECK (session_type IN ('lesson', 'interactive', 'voice', 'exam_prep')),
    
    started_at TEXT DEFAULT (datetime('now')),
    ended_at TEXT,
    duration_minutes INTEGER,
    
    context_data TEXT -- JSON
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_course_id ON chat_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_started_at ON chat_sessions(started_at);

CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    session_id TEXT NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    
    tts_played INTEGER DEFAULT 0,
    tts_audio_url TEXT,
    
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- =====================================================
-- EXAM PREPARATION
-- =====================================================

CREATE TABLE IF NOT EXISTS exam_courses (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    exam_type TEXT NOT NULL CHECK (exam_type IN ('ЕГЭ', 'ОГЭ')),
    subject TEXT NOT NULL,
    
    progress_percentage REAL DEFAULT 0,
    topics_completed INTEGER DEFAULT 0,
    total_topics INTEGER DEFAULT 50,
    
    created_at TEXT DEFAULT (datetime('now')),
    last_studied_at TEXT,
    
    UNIQUE (user_id, exam_type, subject)
);

CREATE INDEX IF NOT EXISTS idx_exam_courses_user_id ON exam_courses(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_courses_exam_type ON exam_courses(exam_type);

-- =====================================================
-- ACHIEVEMENTS & GAMIFICATION
-- =====================================================

CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    
    name TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    icon_name TEXT,
    
    criteria_type TEXT,
    criteria_value INTEGER,
    
    points_reward INTEGER DEFAULT 0,
    
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    
    unlocked_at TEXT DEFAULT (datetime('now')),
    seen INTEGER DEFAULT 0,
    
    UNIQUE (user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked_at ON user_achievements(unlocked_at);

-- =====================================================
-- USER PREFERENCES
-- =====================================================

CREATE TABLE IF NOT EXISTS user_preferences (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    theme TEXT DEFAULT 'light',
    language TEXT DEFAULT 'ru',
    notifications_enabled INTEGER DEFAULT 1,
    
    preferred_lesson_duration INTEGER DEFAULT 30,
    study_reminders_time TEXT,
    
    tts_voice TEXT DEFAULT 'julia',
    tts_speed REAL DEFAULT 1.0,
    
    profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'friends', 'private')),
    
    other_settings TEXT DEFAULT '{}', -- JSON
    
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
AFTER UPDATE ON users
BEGIN
    UPDATE users SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_courses_timestamp 
AFTER UPDATE ON courses
BEGIN
    UPDATE courses SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_lessons_timestamp 
AFTER UPDATE ON lessons
BEGIN
    UPDATE lessons SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_user_courses_timestamp 
AFTER UPDATE ON user_courses
BEGIN
    UPDATE user_courses SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_user_lessons_timestamp 
AFTER UPDATE ON user_lessons
BEGIN
    UPDATE user_lessons SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_learning_plans_timestamp 
AFTER UPDATE ON learning_plans
BEGIN
    UPDATE learning_plans SET last_updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_user_preferences_timestamp 
AFTER UPDATE ON user_preferences
BEGIN
    UPDATE user_preferences SET updated_at = datetime('now') WHERE id = NEW.id;
END;

