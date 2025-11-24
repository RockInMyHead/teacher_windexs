/**
 * User API Routes
 * Handles user authentication, profile management, and user data
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/**
 * @route   GET /api/users/:userId
 * @desc    Get user profile
 * @access  Private
 */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await db.query(
      `SELECT 
        id, email, username, full_name, avatar_url, role,
        total_lessons_completed, total_study_hours, 
        current_streak_days, max_streak_days,
        total_points, level,
        created_at, last_login_at
      FROM users 
      WHERE id = $1 AND is_active = true`,
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   POST /api/users/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { email, username, password, fullName } = req.body;
    
    // Validate input
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if user exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await db.query(
      `INSERT INTO users (email, username, password_hash, full_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, username, full_name, role, created_at`,
      [email, username, passwordHash, fullName || username]
    );
    
    const user = result.rows[0];
    
    // Create default preferences
    await db.query(
      'INSERT INTO user_preferences (user_id) VALUES ($1)',
      [user.id]
    );
    
    res.status(201).json({ user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   POST /api/users/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }
    
    // Get user
    const result = await db.query(
      `SELECT id, email, username, password_hash, full_name, avatar_url, role,
              total_lessons_completed, total_study_hours, 
              current_streak_days, max_streak_days,
              total_points, level
       FROM users 
       WHERE email = $1 AND is_active = true`,
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    await db.query(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );
    
    // Remove password hash from response
    delete user.password_hash;
    
    res.json({ user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   PUT /api/users/:userId
 * @desc    Update user profile
 * @access  Private
 */
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, avatarUrl } = req.body;
    
    const result = await db.query(
      `UPDATE users 
       SET full_name = COALESCE($1, full_name),
           avatar_url = COALESCE($2, avatar_url)
       WHERE id = $3
       RETURNING id, email, username, full_name, avatar_url`,
      [fullName, avatarUrl, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   PUT /api/users/:userId/stats
 * @desc    Update user statistics
 * @access  Private
 */
router.put('/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;
    const { 
      totalLessonsCompleted, 
      totalStudyHours, 
      currentStreakDays,
      maxStreakDays,
      totalPoints,
      level 
    } = req.body;
    
    const result = await db.query(
      `UPDATE users 
       SET total_lessons_completed = COALESCE($1, total_lessons_completed),
           total_study_hours = COALESCE($2, total_study_hours),
           current_streak_days = COALESCE($3, current_streak_days),
           max_streak_days = COALESCE($4, max_streak_days),
           total_points = COALESCE($5, total_points),
           level = COALESCE($6, level)
       WHERE id = $7
       RETURNING total_lessons_completed, total_study_hours, 
                 current_streak_days, max_streak_days, total_points, level`,
      [totalLessonsCompleted, totalStudyHours, currentStreakDays, maxStreakDays, totalPoints, level, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ stats: result.rows[0] });
  } catch (error) {
    console.error('Error updating user stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   GET /api/users/:userId/preferences
 * @desc    Get user preferences
 * @access  Private
 */
router.get('/:userId/preferences', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await db.query(
      'SELECT * FROM user_preferences WHERE user_id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Preferences not found' });
    }
    
    res.json({ preferences: result.rows[0] });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   PUT /api/users/:userId/preferences
 * @desc    Update user preferences
 * @access  Private
 */
router.put('/:userId/preferences', async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = req.body;
    
    const result = await db.query(
      `UPDATE user_preferences 
       SET theme = COALESCE($1, theme),
           language = COALESCE($2, language),
           notifications_enabled = COALESCE($3, notifications_enabled),
           preferred_lesson_duration = COALESCE($4, preferred_lesson_duration),
           tts_voice = COALESCE($5, tts_voice),
           tts_speed = COALESCE($6, tts_speed),
           other_settings = COALESCE($7, other_settings)
       WHERE user_id = $8
       RETURNING *`,
      [
        preferences.theme,
        preferences.language,
        preferences.notificationsEnabled,
        preferences.preferredLessonDuration,
        preferences.ttsVoice,
        preferences.ttsSpeed,
        preferences.otherSettings,
        userId
      ]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Preferences not found' });
    }
    
    res.json({ preferences: result.rows[0] });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

