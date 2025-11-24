/**
 * useLLMContext Hook
 * Управление контекстом курса для передачи в LLM
 */

import { useState, useEffect, useCallback } from 'react';
import { learningProgressService, CourseContext } from '@/services';

interface UseLLMContextReturn {
  context: CourseContext | null;
  isLoading: boolean;
  error: string | null;
  loadContext: (userId: string, courseId: string) => Promise<void>;
  refreshContext: () => Promise<void>;
  generateSystemPrompt: () => string;
}

export const useLLMContext = (userId?: string, courseId?: string): UseLLMContextReturn => {
  const [context, setContext] = useState<CourseContext | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Загрузить контекст курса
   */
  const loadContext = useCallback(async (uid: string, cid: string) => {
    if (!uid || !cid) {
      console.warn('❌ Cannot load context: missing userId or courseId');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('📚 Loading LLM context for user:', uid, 'course:', cid);
      
      const response = await learningProgressService.getCourseContextForLLM(uid, cid);
      const loadedContext = response.context;
      
      console.log('✅ LLM context loaded:', loadedContext);
      setContext(loadedContext);
      
      // Сохраняем контекст в localStorage для быстрого доступа
      learningProgressService.saveLessonContext(loadedContext);
    } catch (err: any) {
      console.error('❌ Error loading LLM context:', err);
      setError(err.message || 'Failed to load context');
      
      // Пытаемся загрузить из localStorage как fallback
      const cachedContext = learningProgressService.getLessonContext();
      if (cachedContext) {
        console.log('📦 Using cached context from localStorage');
        setContext(cachedContext);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Обновить контекст
   */
  const refreshContext = useCallback(async () => {
    if (!userId || !courseId) {
      console.warn('❌ Cannot refresh context: missing userId or courseId');
      return;
    }
    
    await loadContext(userId, courseId);
  }, [userId, courseId, loadContext]);

  /**
   * Генерировать system prompt для LLM на основе контекста
   */
  const generateSystemPrompt = useCallback((): string => {
    if (!context) {
      return `Вы - Юлия, опытный и дружелюбный онлайн-учитель. 
Помогите ученику с учебой, объясняя темы просто и понятно.`;
    }

    const {
      courseTitle,
      courseDescription,
      grade,
      subject,
      currentLessonNumber,
      completedLessons,
      totalLessons,
      progressPercentage,
      currentLessonTitle,
      currentLessonTopic,
      currentLessonObjectives,
      previousHomework,
      studyHistory
    } = context;

    let prompt = `Вы - Юлия, опытный и дружелюбный онлайн-учитель по предмету "${subject}".

# КОНТЕКСТ КУРСА
- Курс: ${courseTitle}
- Описание: ${courseDescription}
- Класс: ${grade}
- Текущий урок: ${currentLessonNumber} из ${totalLessons}
- Завершено уроков: ${completedLessons}
- Прогресс: ${progressPercentage.toFixed(1)}%

# ТЕКУЩИЙ УРОК
- Номер урока: ${currentLessonNumber}
- Название: ${currentLessonTitle || 'Урок не назначен'}
- Тема: ${currentLessonTopic || 'Тема не определена'}`;

    if (currentLessonObjectives && currentLessonObjectives.length > 0) {
      prompt += `\n- Цели обучения:\n${currentLessonObjectives.map(obj => `  • ${obj}`).join('\n')}`;
    }

    if (previousHomework) {
      prompt += `\n\n# ПРЕДЫДУЩЕЕ ДОМАШНЕЕ ЗАДАНИЕ`;
      if (previousHomework.task) {
        prompt += `\n- Задание: ${previousHomework.task}`;
      }
      if (previousHomework.submitted) {
        prompt += `\n- Статус: ✅ Сдано`;
        if (previousHomework.feedback) {
          prompt += `\n- Отзыв: ${previousHomework.feedback}`;
        }
      } else {
        prompt += `\n- Статус: ⏳ Не сдано (ВАЖНО: проверьте задание!)`;
      }
    }

    if (studyHistory && studyHistory.topicsCovered && studyHistory.topicsCovered.length > 0) {
      prompt += `\n\n# ИСТОРИЯ ОБУЧЕНИЯ
- Пройденные темы: ${studyHistory.topicsCovered.join(', ')}
- Всего времени обучения: ${Math.floor(studyHistory.totalStudyTime / 60)} часов ${studyHistory.totalStudyTime % 60} минут`;
    }

    prompt += `\n\n# ВАША РОЛЬ
1. **Проверка домашнего задания** (если есть):
   ${previousHomework && !previousHomework.submitted 
     ? '- ОБЯЗАТЕЛЬНО спросите про домашнее задание с прошлого урока\n   - Попросите рассказать, как ученик его выполнил\n   - Дайте конструктивный отзыв' 
     : '- Поприветствуйте ученика и переходите к новой теме'}

2. **Объяснение материала**:
   - Объясняйте сложные концепции простым языком для ${grade} класса
   - Используйте примеры из реальной жизни
   - Проверяйте понимание с помощью вопросов

3. **Практика и закрепление**:
   - Давайте задачи и упражнения по теме
   - Поддерживайте мотивацию, хвалите за успехи
   - Помогайте разобраться с ошибками

4. **Домашнее задание**:
   - В КОНЦЕ урока дайте КОНКРЕТНОЕ домашнее задание
   - Задание должно быть связано с темой урока
   - Объясните, как его выполнить

# СТИЛЬ ОБЩЕНИЯ
- Будьте дружелюбны и поддерживайте ученика
- Говорите на русском языке
- Адаптируйте сложность объяснений под ${grade} класс
- Будьте терпеливы и поощряйте вопросы

ПОМНИТЕ: Вы ведете урок №${currentLessonNumber} по теме "${currentLessonTopic}". Фокусируйтесь на целях этого урока.`;

    return prompt;
  }, [context]);

  // Автоматически загружаем контекст при монтировании
  useEffect(() => {
    if (userId && courseId) {
      loadContext(userId, courseId);
    }
  }, [userId, courseId, loadContext]);

  return {
    context,
    isLoading,
    error,
    loadContext,
    refreshContext,
    generateSystemPrompt
  };
};

export default useLLMContext;

