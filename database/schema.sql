-- =====================================================
-- TEACHER PLATFORM DATABASE SCHEMA
-- Professional-grade database design
-- =====================================================

-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    
    -- User stats
    total_lessons_completed INTEGER DEFAULT 0,
    total_study_hours DECIMAL(10, 2) DEFAULT 0,
    current_streak_days INTEGER DEFAULT 0,
    max_streak_days INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    
    -- Indexes
    INDEX idx_users_email (email),
    INDEX idx_users_username (username),
    INDEX idx_users_created_at (created_at)
);

-- =====================================================
-- COURSES & CURRICULUM
-- =====================================================

CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(100) NOT NULL, -- physics, math, biology, etc.
    grade INTEGER, -- 1-11 or NULL for exam courses
    exam_type VARCHAR(50), -- 'ЕГЭ', 'ОГЭ', NULL
    
    -- Course metadata
    difficulty_level VARCHAR(50) DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    total_lessons INTEGER DEFAULT 0,
    estimated_hours DECIMAL(10, 2),
    
    -- Course image/icon
    image_url TEXT,
    icon_name VARCHAR(100),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    
    -- Indexes
    INDEX idx_courses_subject (subject),
    INDEX idx_courses_grade (grade),
    INDEX idx_courses_exam_type (exam_type)
);

CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    
    -- Lesson content
    lesson_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    
    -- Lesson structure
    learning_objectives JSONB, -- Array of objectives
    key_concepts JSONB, -- Array of key concepts
    practice_exercises JSONB, -- Array of exercises
    homework JSONB, -- Homework assignments
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE (course_id, lesson_number),
    
    -- Indexes
    INDEX idx_lessons_course_id (course_id),
    INDEX idx_lessons_lesson_number (lesson_number)
);

-- =====================================================
-- USER LEARNING PROGRESS
-- =====================================================

CREATE TABLE user_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    
    -- Enrollment info
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    
    -- Progress tracking
    current_lesson_number INTEGER DEFAULT 1,
    completed_lessons INTEGER DEFAULT 0,
    progress_percentage DECIMAL(5, 2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    -- Stats
    total_study_time_minutes INTEGER DEFAULT 0,
    average_score DECIMAL(5, 2) DEFAULT 0,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'dropped')),
    
    -- Constraints
    UNIQUE (user_id, course_id),
    
    -- Indexes
    INDEX idx_user_courses_user_id (user_id),
    INDEX idx_user_courses_course_id (course_id),
    INDEX idx_user_courses_status (status)
);

CREATE TABLE user_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    user_course_id UUID NOT NULL REFERENCES user_courses(id) ON DELETE CASCADE,
    
    -- Lesson progress
    status VARCHAR(50) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'reviewed')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Performance metrics
    score DECIMAL(5, 2),
    time_spent_minutes INTEGER DEFAULT 0,
    attempts_count INTEGER DEFAULT 0,
    
    -- Homework tracking
    homework_submitted BOOLEAN DEFAULT false,
    homework_submitted_at TIMESTAMP WITH TIME ZONE,
    homework_content JSONB,
    homework_feedback JSONB,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE (user_id, lesson_id),
    
    -- Indexes
    INDEX idx_user_lessons_user_id (user_id),
    INDEX idx_user_lessons_lesson_id (lesson_id),
    INDEX idx_user_lessons_status (status)
);

-- =====================================================
-- LEARNING PLANS (Generated by AI)
-- =====================================================

CREATE TABLE learning_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    
    -- Plan structure
    plan_data JSONB NOT NULL, -- Complete AI-generated plan
    lessons_structure JSONB NOT NULL, -- Array of lessons with structure
    
    -- Plan metadata
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE (user_id, course_id),
    
    -- Indexes
    INDEX idx_learning_plans_user_id (user_id),
    INDEX idx_learning_plans_course_id (course_id)
);

-- =====================================================
-- CHAT & MESSAGING
-- =====================================================

CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
    
    -- Session type
    session_type VARCHAR(50) DEFAULT 'interactive' CHECK (session_type IN ('lesson', 'interactive', 'voice', 'exam_prep')),
    
    -- Session metadata
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    
    -- Session context
    context_data JSONB, -- Course info, lesson info, etc.
    
    -- Indexes
    INDEX idx_chat_sessions_user_id (user_id),
    INDEX idx_chat_sessions_course_id (course_id),
    INDEX idx_chat_sessions_started_at (started_at)
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    
    -- Message content
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    
    -- TTS tracking
    tts_played BOOLEAN DEFAULT false,
    tts_audio_url TEXT,
    
    -- Message metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_chat_messages_session_id (session_id),
    INDEX idx_chat_messages_created_at (created_at)
);

-- =====================================================
-- EXAM PREPARATION
-- =====================================================

CREATE TABLE exam_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Exam info
    exam_type VARCHAR(50) NOT NULL CHECK (exam_type IN ('ЕГЭ', 'ОГЭ')),
    subject VARCHAR(100) NOT NULL,
    
    -- Progress
    progress_percentage DECIMAL(5, 2) DEFAULT 0,
    topics_completed INTEGER DEFAULT 0,
    total_topics INTEGER DEFAULT 50,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_studied_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    UNIQUE (user_id, exam_type, subject),
    
    -- Indexes
    INDEX idx_exam_courses_user_id (user_id),
    INDEX idx_exam_courses_exam_type (exam_type)
);

-- =====================================================
-- ACHIEVEMENTS & GAMIFICATION
-- =====================================================

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Achievement info
    name VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon_name VARCHAR(100),
    
    -- Achievement criteria
    criteria_type VARCHAR(100), -- 'lessons_completed', 'streak_days', etc.
    criteria_value INTEGER,
    
    -- Reward
    points_reward INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    
    -- Unlock info
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    seen BOOLEAN DEFAULT false,
    
    -- Constraints
    UNIQUE (user_id, achievement_id),
    
    -- Indexes
    INDEX idx_user_achievements_user_id (user_id),
    INDEX idx_user_achievements_unlocked_at (unlocked_at)
);

-- =====================================================
-- HOMEWORK & ASSIGNMENTS
-- =====================================================

CREATE TABLE homework_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_lesson_id UUID NOT NULL REFERENCES user_lessons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Submission content
    answers JSONB NOT NULL,
    files_urls JSONB, -- Array of uploaded file URLs
    
    -- Evaluation
    teacher_feedback TEXT,
    score DECIMAL(5, 2),
    
    -- Status
    status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed', 'needs_revision')),
    
    -- Timestamps
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    -- Indexes
    INDEX idx_homework_submissions_user_lesson_id (user_lesson_id),
    INDEX idx_homework_submissions_user_id (user_id),
    INDEX idx_homework_submissions_status (status)
);

-- =====================================================
-- ANALYTICS & TRACKING
-- =====================================================

CREATE TABLE user_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Activity info
    activity_type VARCHAR(100) NOT NULL, -- 'lesson_start', 'lesson_complete', 'chat_session', etc.
    activity_data JSONB,
    
    -- References
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_user_activity_log_user_id (user_id),
    INDEX idx_user_activity_log_activity_type (activity_type),
    INDEX idx_user_activity_log_created_at (created_at)
);

CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Preferences
    theme VARCHAR(50) DEFAULT 'light',
    language VARCHAR(10) DEFAULT 'ru',
    notifications_enabled BOOLEAN DEFAULT true,
    
    -- Learning preferences
    preferred_lesson_duration INTEGER DEFAULT 30, -- minutes
    study_reminders_time TIME,
    
    -- Voice preferences
    tts_voice VARCHAR(50) DEFAULT 'julia',
    tts_speed DECIMAL(3, 2) DEFAULT 1.0,
    
    -- Privacy
    profile_visibility VARCHAR(50) DEFAULT 'public' CHECK (profile_visibility IN ('public', 'friends', 'private')),
    
    -- Other settings (flexible JSON for future extensions)
    other_settings JSONB DEFAULT '{}',
    
    -- Metadata
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_courses_updated_at BEFORE UPDATE ON user_courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_lessons_updated_at BEFORE UPDATE ON user_lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_plans_updated_at BEFORE UPDATE ON learning_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =====================================================

-- Composite indexes for common queries
CREATE INDEX idx_user_courses_user_status ON user_courses(user_id, status);
CREATE INDEX idx_user_lessons_user_status ON user_lessons(user_id, status);
CREATE INDEX idx_chat_messages_session_created ON chat_messages(session_id, created_at DESC);
CREATE INDEX idx_user_activity_user_created ON user_activity_log(user_id, created_at DESC);

-- JSONB indexes for fast queries
CREATE INDEX idx_learning_plans_plan_data ON learning_plans USING gin(plan_data);
CREATE INDEX idx_chat_sessions_context_data ON chat_sessions USING gin(context_data);
CREATE INDEX idx_lessons_learning_objectives ON lessons USING gin(learning_objectives);

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE users IS 'Central user table with authentication and profile data';
COMMENT ON TABLE courses IS 'Master course catalog including regular and exam courses';
COMMENT ON TABLE lessons IS 'Individual lesson content and structure';
COMMENT ON TABLE user_courses IS 'User enrollment and progress tracking per course';
COMMENT ON TABLE user_lessons IS 'Detailed progress tracking per lesson';
COMMENT ON TABLE learning_plans IS 'AI-generated personalized learning plans';
COMMENT ON TABLE chat_sessions IS 'Chat and voice lesson sessions';
COMMENT ON TABLE chat_messages IS 'Individual messages in chat sessions';
COMMENT ON TABLE exam_courses IS 'User-specific exam preparation courses';
COMMENT ON TABLE achievements IS 'Master list of achievements';
COMMENT ON TABLE user_achievements IS 'User unlocked achievements';
COMMENT ON TABLE homework_submissions IS 'Homework submissions and feedback';
COMMENT ON TABLE user_activity_log IS 'Detailed activity tracking for analytics';
COMMENT ON TABLE user_preferences IS 'User preferences and settings';

