/**
 * Chat API Routes
 * Handles chat sessions and messages with database persistence
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * @route   POST /api/chat/sessions
 * @desc    Create new chat session
 * @access  Private
 */
router.post('/sessions', async (req, res) => {
  try {
    const { userId, courseId, lessonId, sessionType, contextData } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    
    const result = await db.query(
      `INSERT INTO chat_sessions (user_id, course_id, lesson_id, session_type, context_data)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, courseId, lessonId, sessionType || 'interactive', contextData]
    );
    
    res.status(201).json({ session: result.rows[0] });
  } catch (error) {
    console.error('Error creating chat session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   GET /api/chat/sessions/:sessionId
 * @desc    Get chat session with messages
 * @access  Private
 */
router.get('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Get session
    const sessionResult = await db.query(
      'SELECT * FROM chat_sessions WHERE id = $1',
      [sessionId]
    );
    
    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const session = sessionResult.rows[0];
    
    // Get messages
    const messagesResult = await db.query(
      `SELECT * FROM chat_messages 
       WHERE session_id = $1 
       ORDER BY created_at ASC`,
      [sessionId]
    );
    
    session.messages = messagesResult.rows;
    
    res.json({ session });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   GET /api/chat/sessions/user/:userId
 * @desc    Get user's chat sessions
 * @access  Private
 */
router.get('/sessions/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { courseId, sessionType, limit = 50 } = req.query;
    
    let query = `
      SELECT 
        cs.*,
        c.title as course_title,
        l.title as lesson_title,
        COUNT(cm.id) as message_count
      FROM chat_sessions cs
      LEFT JOIN courses c ON cs.course_id = c.id
      LEFT JOIN lessons l ON cs.lesson_id = l.id
      LEFT JOIN chat_messages cm ON cs.id = cm.session_id
      WHERE cs.user_id = $1
    `;
    
    const params = [userId];
    let paramIndex = 2;
    
    if (courseId) {
      query += ` AND cs.course_id = $${paramIndex}`;
      params.push(courseId);
      paramIndex++;
    }
    
    if (sessionType) {
      query += ` AND cs.session_type = $${paramIndex}`;
      params.push(sessionType);
      paramIndex++;
    }
    
    query += ` GROUP BY cs.id, c.title, l.title
               ORDER BY cs.started_at DESC
               LIMIT $${paramIndex}`;
    params.push(limit);
    
    const result = await db.query(query, params);
    
    res.json({ sessions: result.rows });
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   POST /api/chat/messages
 * @desc    Add message to chat session
 * @access  Private
 */
router.post('/messages', async (req, res) => {
  try {
    const { sessionId, role, content, ttsPlayed, ttsAudioUrl } = req.body;
    
    if (!sessionId || !role || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const result = await db.query(
      `INSERT INTO chat_messages (session_id, role, content, tts_played, tts_audio_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [sessionId, role, content, ttsPlayed || false, ttsAudioUrl]
    );
    
    res.status(201).json({ message: result.rows[0] });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   POST /api/chat/messages/bulk
 * @desc    Add multiple messages to chat session (for migration)
 * @access  Private
 */
router.post('/messages/bulk', async (req, res) => {
  try {
    const { sessionId, messages } = req.body;
    
    if (!sessionId || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      const insertedMessages = [];
      
      for (const msg of messages) {
        const result = await client.query(
          `INSERT INTO chat_messages (session_id, role, content, tts_played, tts_audio_url, created_at)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [sessionId, msg.role, msg.content, msg.ttsPlayed || false, msg.ttsAudioUrl, msg.timestamp || new Date()]
        );
        insertedMessages.push(result.rows[0]);
      }
      
      await client.query('COMMIT');
      
      res.status(201).json({ messages: insertedMessages });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error adding bulk messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   PUT /api/chat/sessions/:sessionId/end
 * @desc    End chat session
 * @access  Private
 */
router.put('/sessions/:sessionId/end', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const result = await db.query(
      `UPDATE chat_sessions 
       SET ended_at = CURRENT_TIMESTAMP,
           duration_minutes = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - started_at)) / 60
       WHERE id = $1
       RETURNING *`,
      [sessionId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({ session: result.rows[0] });
  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   DELETE /api/chat/sessions/:sessionId
 * @desc    Delete chat session and all messages
 * @access  Private
 */
router.delete('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Messages will be automatically deleted due to CASCADE
    await db.query('DELETE FROM chat_sessions WHERE id = $1', [sessionId]);
    
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   PUT /api/chat/messages/:messageId/tts
 * @desc    Update TTS status for message
 * @access  Private
 */
router.put('/messages/:messageId/tts', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { ttsPlayed, ttsAudioUrl } = req.body;
    
    const result = await db.query(
      `UPDATE chat_messages 
       SET tts_played = COALESCE($1, tts_played),
           tts_audio_url = COALESCE($2, tts_audio_url)
       WHERE id = $3
       RETURNING *`,
      [ttsPlayed, ttsAudioUrl, messageId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json({ message: result.rows[0] });
  } catch (error) {
    console.error('Error updating message TTS:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

