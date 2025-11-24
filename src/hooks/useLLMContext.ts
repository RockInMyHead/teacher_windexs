/**
 * useLLMContext Hook
 * Управление контекстом курса для передачи в LLM
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Функция пост-обработки текста для исправления распространенных ошибок
 */
function postProcessText(text: string): string {
  let processed = text;

  // Исправление распространенных ошибок
  const corrections = [
    // Слитные слова
    [/изменениелаголов/g, 'изменение глаголов'],
    [/спреннями/g, 'спряжениями'],
    [/спрение/g, 'спряжение'],
    [/голы/g, 'глаголы'],
    [/напр\./g, 'например'],
    [/кот\./g, 'которые'],
    [/т\.е\./g, 'то есть'],
    [/и\.т\.д\./g, 'и так далее'],

    // Неполные предложения
    [/спряж\.$/g, 'спряжения.'],

    // Ошибки в окончаниях
    [/спрениями/g, 'спряжениями'],
    [/спрении/g, 'спряжения'],

    // Пунктуация
    [/-ять -еть \(/g, '-ять, -еть ('],
    [/-ять -еть,/g, '-ять, -еть,'],
    [/-ить или -/g, '-ить или -еть ('],
  ];

  corrections.forEach(([pattern, replacement]) => {
    processed = processed.replace(pattern, replacement as string);
  });

  return processed;
}
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

    let prompt = 'Вы - Юлия, опытный и дружелюбный онлайн-учитель по предмету "' + subject + '".\n\n';
    prompt += '# КОНТЕКСТ КУРСА\n';
    prompt += '- Курс: ' + courseTitle + '\n';
    prompt += '- Описание: ' + courseDescription + '\n';
    prompt += '- Класс: ' + grade + '\n';
    prompt += '- Текущий урок: ' + currentLessonNumber + ' из ' + totalLessons + '\n';
    prompt += '- Завершено уроков: ' + completedLessons + '\n';
    prompt += '- Прогресс: ' + progressPercentage.toFixed(1) + '%\n\n';
    prompt += '# ТЕКУЩИЙ УРОК\n';
    prompt += '- Номер урока: ' + currentLessonNumber + '\n';
    prompt += '- Название: ' + (currentLessonTitle || 'Урок не назначен') + '\n';
    prompt += '- Тема: ' + (currentLessonTopic || 'Тема не определена');

    if (currentLessonObjectives && currentLessonObjectives.length > 0) {
      prompt += '\n- Цели обучения:\n' + currentLessonObjectives.map(obj => '  • ' + obj).join('\n');
    }

    // ДОБАВЛЯЕМ СТРОГИЕ ИНСТРУКЦИИ ПО КАЧЕСТВУ ТЕКСТА
    prompt += '\n\n# СТРОГИЕ ПРАВИЛА КАЧЕСТВА ТЕКСТА\n\n';
    prompt += 'Пишите только на русском языке, используйте правильную грамматику и понятные объяснения для ' + grade + ' класса.';

if (previousHomework) {
  prompt += '\n\n# PREVIOUS HOMEWORK ASSIGNMENT';
  if (previousHomework.task) {
    prompt += '\n- Задание: ' + previousHomework.task;
  }
  if (previousHomework.submitted) {
    prompt += '\n- Статус: ✅ Сдано';
    if (previousHomework.feedback) {
      prompt += '\n- Отзыв: ' + previousHomework.feedback;
    }
  } else {
    prompt += '\n- Статус: ⏳ Не сдано (ВАЖНО: проверьте задание!)';
  }
}

    if (studyHistory && studyHistory.topicsCovered && studyHistory.topicsCovered.length > 0) {
      prompt += '\n\n# ИСТОРИЯ ОБУЧЕНИЯ\n';
      prompt += '- Пройденные темы: ' + studyHistory.topicsCovered.join(', ') + '\n';
      prompt += '- Всего времени обучения: ' + Math.floor(studyHistory.totalStudyTime / 60) + ' часов ' + (studyHistory.totalStudyTime % 60) + ' минут';
    }

    prompt += '\n\n# ВАША РОЛЬ\n';
    prompt += '1. **Проверка домашнего задания** (если есть):\n   ';
    prompt += (previousHomework && !previousHomework.submitted
      ? '- ОБЯЗАТЕЛЬНО спросите про домашнее задание с прошлого урока\n   - Попросите рассказать, как ученик его выполнил\n   - Дайте конструктивный отзыв'
      : '- Поприветствуйте ученика и переходите к новой теме');
    prompt += '\n\n2. **Объяснение материала**:\n';
    prompt += '   - Объясняйте сложные концепции простым языком для ' + grade + ' класса\n';
    prompt += '   - Используйте примеры из реальной жизни\n';
    prompt += '   - Проверяйте понимание с помощью вопросов\n\n';
    prompt += '3. **Практика и закрепление**:\n';
    prompt += '   - Давайте задачи и упражнения по теме\n';
    prompt += '   - Поддерживайте мотивацию, хвалите за успехи\n';
    prompt += '   - Помогайте разобраться с ошибками\n\n';
    prompt += '4. **Домашнее задание**:\n';
    prompt += '   - В КОНЦЕ урока дайте КОНКРЕТНОЕ домашнее задание\n';
    prompt += '   - Задание должно быть связано с темой урока\n';
    prompt += '   - Объясните, как его выполнить';

    prompt += '\n\n# СТИЛЬ ОБЩЕНИЯ\n';
    prompt += '- Будьте дружелюбны и поддерживайте ученика\n';
    prompt += '- Говорите на русском языке\n';
    prompt += '- Адаптируйте сложность объяснений под ' + grade + ' класс\n';
    prompt += '- Будьте терпеливы и поощряйте вопросы';

    prompt += '\n\nПОМНИТЕ: Вы ведете урок №' + currentLessonNumber + ' по теме "' + currentLessonTopic + '". Фокусируйтесь на целях этого урока.';

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

