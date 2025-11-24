const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', db: 'SQLite', timestamp: new Date().toISOString() });
});

app.get('/api/courses', async (req, res) => {
  try {
    console.log('📚 Fetching courses...');
    const result = await db.query('SELECT * FROM courses WHERE is_active = 1');
    console.log('✅ Found', result.rows.length, 'courses');
    res.json({ courses: result.rows });
  } catch (error) {
    console.error('❌ Error fetching courses:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/courses/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log('📚 Fetching course:', courseId);
    
    const courseResult = await db.query('SELECT * FROM courses WHERE id = ?', [courseId]);
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const course = courseResult.rows[0];
    
    const lessonsResult = await db.query('SELECT * FROM lessons WHERE course_id = ? ORDER BY lesson_number', [courseId]);
    course.lessons = lessonsResult.rows;
    
    res.json({ course });
  } catch (error) {
    console.error('❌ Error fetching course:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api/courses`);
});

