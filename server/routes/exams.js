/**
 * Exam Courses API Routes
 * Handles ЕГЭ and ОГЭ exam preparation courses
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * @route   GET /api/exams/user/:userId
 * @desc    Get user's exam courses
 * @access  Private
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { examType } = req.query;
    
    let query = `
      SELECT * FROM exam_courses 
      WHERE user_id = $1
    `;
    
    const params = [userId];
    
    if (examType) {
      query += ` AND exam_type = $2`;
      params.push(examType);
    }
    
    query += ` ORDER BY last_studied_at DESC NULLS LAST`;
    
    const result = await db.query(query, params);
    
    res.json({ examCourses: result.rows });
  } catch (error) {
    console.error('Error fetching exam courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   POST /api/exams
 * @desc    Add exam course for user
 * @access  Private
 */
router.post('/', async (req, res) => {
  try {
    const { userId, examType, subject, totalTopics } = req.body;
    
    if (!userId || !examType || !subject) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if exam course already exists
    const existing = await db.query(
      'SELECT id FROM exam_courses WHERE user_id = $1 AND exam_type = $2 AND subject = $3',
      [userId, examType, subject]
    );
    
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Exam course already exists' });
    }
    
    const result = await db.query(
      `INSERT INTO exam_courses (user_id, exam_type, subject, total_topics)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, examType, subject, totalTopics || 50]
    );
    
    res.status(201).json({ examCourse: result.rows[0] });
  } catch (error) {
    console.error('Error creating exam course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   POST /api/exams/bulk
 * @desc    Add multiple exam courses for user
 * @access  Private
 */
router.post('/bulk', async (req, res) => {
  try {
    const { userId, examCourses } = req.body;
    
    if (!userId || !examCourses || !Array.isArray(examCourses)) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      const insertedCourses = [];
      
      for (const course of examCourses) {
        // Check if already exists
        const existing = await client.query(
          'SELECT id FROM exam_courses WHERE user_id = $1 AND exam_type = $2 AND subject = $3',
          [userId, course.examType, course.subject]
        );
        
        if (existing.rows.length === 0) {
          const result = await client.query(
            `INSERT INTO exam_courses (user_id, exam_type, subject, total_topics)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [userId, course.examType, course.subject, course.totalTopics || 50]
          );
          insertedCourses.push(result.rows[0]);
        }
      }
      
      await client.query('COMMIT');
      
      res.status(201).json({ examCourses: insertedCourses });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating bulk exam courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   PUT /api/exams/:examCourseId
 * @desc    Update exam course progress
 * @access  Private
 */
router.put('/:examCourseId', async (req, res) => {
  try {
    const { examCourseId } = req.params;
    const { progressPercentage, topicsCompleted, lastStudiedAt } = req.body;
    
    const result = await db.query(
      `UPDATE exam_courses 
       SET progress_percentage = COALESCE($1, progress_percentage),
           topics_completed = COALESCE($2, topics_completed),
           last_studied_at = COALESCE($3, last_studied_at)
       WHERE id = $4
       RETURNING *`,
      [progressPercentage, topicsCompleted, lastStudiedAt, examCourseId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Exam course not found' });
    }
    
    res.json({ examCourse: result.rows[0] });
  } catch (error) {
    console.error('Error updating exam course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   DELETE /api/exams/:examCourseId
 * @desc    Delete exam course
 * @access  Private
 */
router.delete('/:examCourseId', async (req, res) => {
  try {
    const { examCourseId } = req.params;
    
    await db.query('DELETE FROM exam_courses WHERE id = $1', [examCourseId]);
    
    res.json({ message: 'Exam course deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   GET /api/exams/:userId/:examType/:subject
 * @desc    Get specific exam course
 * @access  Private
 */
router.get('/:userId/:examType/:subject', async (req, res) => {
  try {
    const { userId, examType, subject } = req.params;
    
    const result = await db.query(
      `SELECT * FROM exam_courses 
       WHERE user_id = $1 AND exam_type = $2 AND subject = $3`,
      [userId, examType, subject]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Exam course not found' });
    }
    
    res.json({ examCourse: result.rows[0] });
  } catch (error) {
    console.error('Error fetching exam course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

