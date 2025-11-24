/**
 * Courses API Routes
 * Handles course catalog, lessons, and user course enrollment
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * @route   GET /api/courses
 * @desc    Get all courses
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { grade, examType, subject } = req.query;
    
    let query = `
      SELECT 
        c.*,
        COUNT(l.id) as lesson_count
      FROM courses c
      LEFT JOIN lessons l ON c.id = l.course_id
      WHERE c.is_active = true
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (grade) {
      query += ` AND c.grade = $${paramIndex}`;
      params.push(grade);
      paramIndex++;
    }
    
    if (examType) {
      query += ` AND c.exam_type = $${paramIndex}`;
      params.push(examType);
      paramIndex++;
    }
    
    if (subject) {
      query += ` AND c.subject = $${paramIndex}`;
      params.push(subject);
      paramIndex++;
    }
    
    query += ` GROUP BY c.id ORDER BY c.created_at DESC`;
    
    const result = await db.query(query, params);
    
    res.json({ courses: result.rows });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   GET /api/courses/:courseId
 * @desc    Get course details with lessons
 * @access  Public
 */
router.get('/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Get course
    const courseResult = await db.query(
      'SELECT * FROM courses WHERE id = $1 AND is_active = true',
      [courseId]
    );
    
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const course = courseResult.rows[0];
    
    // Get lessons
    const lessonsResult = await db.query(
      `SELECT * FROM lessons 
       WHERE course_id = $1 
       ORDER BY lesson_number ASC`,
      [courseId]
    );
    
    course.lessons = lessonsResult.rows;
    
    res.json({ course });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   POST /api/courses
 * @desc    Create new course
 * @access  Admin
 */
router.post('/', async (req, res) => {
  try {
    const { 
      title, 
      description, 
      subject, 
      grade, 
      examType,
      difficultyLevel,
      totalLessons,
      estimatedHours,
      imageUrl,
      iconName
    } = req.body;
    
    if (!title || !subject) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const result = await db.query(
      `INSERT INTO courses (
        title, description, subject, grade, exam_type,
        difficulty_level, total_lessons, estimated_hours,
        image_url, icon_name
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        title, description, subject, grade, examType,
        difficultyLevel, totalLessons, estimatedHours,
        imageUrl, iconName
      ]
    );
    
    res.status(201).json({ course: result.rows[0] });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   GET /api/courses/:courseId/lessons
 * @desc    Get all lessons for a course
 * @access  Public
 */
router.get('/:courseId/lessons', async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const result = await db.query(
      `SELECT * FROM lessons 
       WHERE course_id = $1 
       ORDER BY lesson_number ASC`,
      [courseId]
    );
    
    res.json({ lessons: result.rows });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   GET /api/courses/:courseId/lessons/:lessonNumber
 * @desc    Get specific lesson
 * @access  Public
 */
router.get('/:courseId/lessons/:lessonNumber', async (req, res) => {
  try {
    const { courseId, lessonNumber } = req.params;
    
    const result = await db.query(
      `SELECT * FROM lessons 
       WHERE course_id = $1 AND lesson_number = $2`,
      [courseId, lessonNumber]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    res.json({ lesson: result.rows[0] });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   POST /api/courses/:courseId/lessons
 * @desc    Create new lesson
 * @access  Admin
 */
router.post('/:courseId/lessons', async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      lessonNumber,
      title,
      topic,
      description,
      content,
      learningObjectives,
      keyConcepts,
      practiceExercises,
      homework
    } = req.body;
    
    if (!lessonNumber || !title || !topic) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const result = await db.query(
      `INSERT INTO lessons (
        course_id, lesson_number, title, topic, description, content,
        learning_objectives, key_concepts, practice_exercises, homework
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        courseId, lessonNumber, title, topic, description, content,
        learningObjectives, keyConcepts, practiceExercises, homework
      ]
    );
    
    // Update course total_lessons count
    await db.query(
      `UPDATE courses 
       SET total_lessons = (SELECT COUNT(*) FROM lessons WHERE course_id = $1)
       WHERE id = $1`,
      [courseId]
    );
    
    res.status(201).json({ lesson: result.rows[0] });
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   GET /api/courses/user/:userId
 * @desc    Get user's enrolled courses with progress
 * @access  Private
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;
    
    let query = `
      SELECT 
        c.*,
        uc.enrolled_at,
        uc.last_accessed_at,
        uc.current_lesson_number,
        uc.completed_lessons,
        uc.progress_percentage,
        uc.total_study_time_minutes,
        uc.average_score,
        uc.status as enrollment_status
      FROM user_courses uc
      JOIN courses c ON uc.course_id = c.id
      WHERE uc.user_id = $1
    `;
    
    const params = [userId];
    
    if (status) {
      query += ` AND uc.status = $2`;
      params.push(status);
    }
    
    query += ` ORDER BY uc.last_accessed_at DESC NULLS LAST`;
    
    const result = await db.query(query, params);
    
    res.json({ courses: result.rows });
  } catch (error) {
    console.error('Error fetching user courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   POST /api/courses/:courseId/enroll
 * @desc    Enroll user in course
 * @access  Private
 */
router.post('/:courseId/enroll', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    
    // Check if already enrolled
    const existing = await db.query(
      'SELECT id FROM user_courses WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );
    
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Already enrolled' });
    }
    
    const result = await db.query(
      `INSERT INTO user_courses (user_id, course_id)
       VALUES ($1, $2)
       RETURNING *`,
      [userId, courseId]
    );
    
    res.status(201).json({ enrollment: result.rows[0] });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   PUT /api/courses/:courseId/progress
 * @desc    Update user course progress
 * @access  Private
 */
router.put('/:courseId/progress', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { 
      userId, 
      currentLessonNumber, 
      completedLessons,
      progressPercentage,
      totalStudyTimeMinutes,
      averageScore
    } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    
    const result = await db.query(
      `UPDATE user_courses 
       SET current_lesson_number = COALESCE($1, current_lesson_number),
           completed_lessons = COALESCE($2, completed_lessons),
           progress_percentage = COALESCE($3, progress_percentage),
           total_study_time_minutes = COALESCE($4, total_study_time_minutes),
           average_score = COALESCE($5, average_score),
           last_accessed_at = CURRENT_TIMESTAMP
       WHERE user_id = $6 AND course_id = $7
       RETURNING *`,
      [currentLessonNumber, completedLessons, progressPercentage, totalStudyTimeMinutes, averageScore, userId, courseId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    
    res.json({ progress: result.rows[0] });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

