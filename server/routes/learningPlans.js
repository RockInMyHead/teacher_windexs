/**
 * Learning Plans API Routes
 * Handles AI-generated learning plans and user lesson progress
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * @route   POST /api/learning-plans
 * @desc    Create or update learning plan
 * @access  Private
 */
router.post('/', async (req, res) => {
  try {
    const { userId, courseId, planData, lessonsStructure } = req.body;
    
    if (!userId || !courseId || !planData || !lessonsStructure) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if plan already exists
    const existing = await db.query(
      'SELECT id FROM learning_plans WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );
    
    let result;
    
    if (existing.rows.length > 0) {
      // Update existing plan
      result = await db.query(
        `UPDATE learning_plans 
         SET plan_data = $1, 
             lessons_structure = $2,
             last_updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $3 AND course_id = $4
         RETURNING *`,
        [planData, lessonsStructure, userId, courseId]
      );
    } else {
      // Create new plan
      result = await db.query(
        `INSERT INTO learning_plans (user_id, course_id, plan_data, lessons_structure)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userId, courseId, planData, lessonsStructure]
      );
    }
    
    res.status(201).json({ learningPlan: result.rows[0] });
  } catch (error) {
    console.error('Error saving learning plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   GET /api/learning-plans/user/:userId
 * @desc    Get all learning plans for user
 * @access  Private
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await db.query(
      `SELECT 
        lp.*,
        c.title as course_title,
        c.subject,
        c.grade,
        c.exam_type
      FROM learning_plans lp
      JOIN courses c ON lp.course_id = c.id
      WHERE lp.user_id = $1
      ORDER BY lp.last_updated_at DESC`,
      [userId]
    );
    
    res.json({ learningPlans: result.rows });
  } catch (error) {
    console.error('Error fetching learning plans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   GET /api/learning-plans/:userId/:courseId
 * @desc    Get specific learning plan
 * @access  Private
 */
router.get('/:userId/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    
    const result = await db.query(
      `SELECT * FROM learning_plans 
       WHERE user_id = $1 AND course_id = $2`,
      [userId, courseId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Learning plan not found' });
    }
    
    res.json({ learningPlan: result.rows[0] });
  } catch (error) {
    console.error('Error fetching learning plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   DELETE /api/learning-plans/:userId/:courseId
 * @desc    Delete learning plan
 * @access  Private
 */
router.delete('/:userId/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    
    await db.query(
      'DELETE FROM learning_plans WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );
    
    res.json({ message: 'Learning plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting learning plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   GET /api/learning-plans/:userId/:courseId/lessons/:lessonId
 * @desc    Get user lesson progress
 * @access  Private
 */
router.get('/:userId/:courseId/lessons/:lessonId', async (req, res) => {
  try {
    const { userId, lessonId } = req.params;
    
    const result = await db.query(
      `SELECT 
        ul.*,
        l.title,
        l.topic,
        l.lesson_number
      FROM user_lessons ul
      JOIN lessons l ON ul.lesson_id = l.id
      WHERE ul.user_id = $1 AND ul.lesson_id = $2`,
      [userId, lessonId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson progress not found' });
    }
    
    res.json({ lessonProgress: result.rows[0] });
  } catch (error) {
    console.error('Error fetching lesson progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   POST /api/learning-plans/lessons/progress
 * @desc    Create or update lesson progress
 * @access  Private
 */
router.post('/lessons/progress', async (req, res) => {
  try {
    const {
      userId,
      lessonId,
      userCourseId,
      status,
      score,
      timeSpentMinutes,
      homeworkSubmitted,
      homeworkContent,
      homeworkFeedback
    } = req.body;
    
    if (!userId || !lessonId || !userCourseId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if progress exists
    const existing = await db.query(
      'SELECT id FROM user_lessons WHERE user_id = $1 AND lesson_id = $2',
      [userId, lessonId]
    );
    
    let result;
    
    if (existing.rows.length > 0) {
      // Update existing progress
      result = await db.query(
        `UPDATE user_lessons 
         SET status = COALESCE($1, status),
             score = COALESCE($2, score),
             time_spent_minutes = COALESCE($3, time_spent_minutes),
             homework_submitted = COALESCE($4, homework_submitted),
             homework_content = COALESCE($5, homework_content),
             homework_feedback = COALESCE($6, homework_feedback),
             completed_at = CASE WHEN $1 = 'completed' THEN CURRENT_TIMESTAMP ELSE completed_at END,
             attempts_count = attempts_count + 1
         WHERE user_id = $7 AND lesson_id = $8
         RETURNING *`,
        [status, score, timeSpentMinutes, homeworkSubmitted, homeworkContent, homeworkFeedback, userId, lessonId]
      );
    } else {
      // Create new progress
      result = await db.query(
        `INSERT INTO user_lessons (
          user_id, lesson_id, user_course_id, status, score, 
          time_spent_minutes, homework_submitted, homework_content, 
          homework_feedback, started_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
        RETURNING *`,
        [userId, lessonId, userCourseId, status, score, timeSpentMinutes, homeworkSubmitted, homeworkContent, homeworkFeedback]
      );
    }
    
    // If lesson completed, update course progress
    if (status === 'completed') {
      await db.query(
        `UPDATE user_courses 
         SET completed_lessons = completed_lessons + 1,
             progress_percentage = (
               SELECT (COUNT(*) FILTER (WHERE ul.status = 'completed') * 100.0 / 
                      (SELECT COUNT(*) FROM lessons WHERE course_id = uc.course_id))
               FROM user_lessons ul
               WHERE ul.user_course_id = uc.id
             )
         WHERE id = $1`,
        [userCourseId]
      );
    }
    
    res.status(201).json({ lessonProgress: result.rows[0] });
  } catch (error) {
    console.error('Error saving lesson progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   GET /api/learning-plans/user/:userId/course/:courseId/lessons
 * @desc    Get all lesson progress for user in a course
 * @access  Private
 */
router.get('/user/:userId/course/:courseId/lessons', async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    
    const result = await db.query(
      `SELECT 
        ul.*,
        l.lesson_number,
        l.title,
        l.topic
      FROM user_lessons ul
      JOIN lessons l ON ul.lesson_id = l.id
      WHERE ul.user_id = $1 AND l.course_id = $2
      ORDER BY l.lesson_number ASC`,
      [userId, courseId]
    );
    
    res.json({ lessonsProgress: result.rows });
  } catch (error) {
    console.error('Error fetching lessons progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

