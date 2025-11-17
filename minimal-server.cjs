#!/usr/bin/env node

const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

console.log('🚀 Minimal Single Port Server');

// Собираем frontend проект
console.log('🔨 Сборка Frontend проекта...');
const buildProcess = spawn('npm', ['run', 'build'], {
  cwd: __dirname,
  stdio: ['pipe', 'pipe', 'pipe']
});

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Frontend собран');
    startServer();
  } else {
    console.error('❌ Ошибка сборки frontend');
    process.exit(1);
  }
});

function startServer() {
  const app = express();

  // Настраиваем статические файлы frontend
  app.use(express.static(path.join(__dirname, 'dist')));

  // Middleware
  app.use(require('cors')());
  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Generate personalized learning plan
  app.post('/api/generate-learning-plan', async (req, res) => {
    try {
      const { courseId, grade, topic, courseName } = req.body;

      if (!topic || !grade || !courseName) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['topic', 'grade', 'courseName']
        });
      }

      console.log(`🎯 Generating learning plan for ${courseName}, grade ${grade}, topic: "${topic}"`);

      // Simple mock response for testing
      const mockPlan = {
        courseName: courseName,
        grade: grade,
        foundTopic: topic,
        lessons: [
          {
            number: 1,
            title: `Продолжение: ${topic}`,
            topic: `Развитие темы "${topic}"`,
            aspects: `Углубленное изучение темы "${topic}" с практическими заданиями и упражнениями.`,
            difficulty: 'beginner',
            prerequisites: [topic]
          },
          {
            number: 2,
            title: 'Следующая логическая тема',
            topic: 'Продолжение изучения предмета',
            aspects: 'Логическое развитие предыдущей темы с новыми примерами и упражнениями.',
            difficulty: 'beginner',
            prerequisites: [`${topic}`, 'предыдущая тема']
          }
        ]
      };

      console.log(`✅ Generated mock plan with ${mockPlan.lessons.length} lessons`);

      res.json({
        success: true,
        plan: mockPlan
      });

    } catch (error) {
      console.error('❌ Learning plan generation error:', error.message);
      res.status(500).json({
        error: 'Failed to generate learning plan',
        details: error.message
      });
    }
  });

  // SPA fallback
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

  // Запускаем сервер
  const server = app.listen(1031, () => {
    console.log('✅ Минимальный сервер запущен на порту 1031');
    console.log('🌐 Доступно на: https://teacher.windexs.ru');
    console.log('💚 Health: https://teacher.windexs.ru/health');
    console.log('Для остановки: Ctrl+C');
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Завершение работы...');
    server.close(() => {
      console.log('✅ Сервер остановлен');
      process.exit(0);
    });
  });
}
