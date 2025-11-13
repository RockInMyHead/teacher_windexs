/**
 * Adaptive Lesson Flow
 * Tracks student performance and automatically adds remedial blocks for failed exercises
 */

export interface BlockPerformance {
  blockId: number;
  blockType: string;
  blockTitle: string;
  topic: string;
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timestamp: Date;
  difficulty: string;
}

export interface LessonProgress {
  lessonId: string;
  totalBlocksOriginal: number;
  performanceHistory: BlockPerformance[];
  failedBlocks: FailedBlockEntry[];
  remedialsAdded: RemedialsAddedEntry[];
  currentBlockIndex: number;
  isCompleted: boolean;
}

export interface FailedBlockEntry {
  blockId: number;
  blockTitle: string;
  topic: string;
  failureCount: number;
  lastFailedAt: Date;
  difficulty: string;
}

export interface RemedialsAddedEntry {
  originalBlockId: number;
  remedialsGenerated: number;
  addedAfterBlockId: number;
  generatedAt: Date;
}

/**
 * Трекер прогресса урока
 */
export class LessonProgressTracker {
  private progress: LessonProgress;

  constructor(lessonId: string, totalBlocksOriginal: number) {
    this.progress = {
      lessonId,
      totalBlocksOriginal,
      performanceHistory: [],
      failedBlocks: [],
      remedialsAdded: [],
      currentBlockIndex: 0,
      isCompleted: false
    };
  }

  /**
   * Записывает ответ ученика на практический вопрос
   */
  recordAnswer(
    blockId: number,
    blockType: string,
    blockTitle: string,
    topic: string,
    questionId: string,
    question: string,
    userAnswer: string,
    correctAnswer: string,
    difficulty: string
  ): boolean {
    const isCorrect = userAnswer === correctAnswer;

    const performance: BlockPerformance = {
      blockId,
      blockType,
      blockTitle,
      topic,
      questionId,
      question,
      userAnswer,
      correctAnswer,
      isCorrect,
      timestamp: new Date(),
      difficulty
    };

    this.progress.performanceHistory.push(performance);

    // Если ответ неправильный - добавляем блок в список для повторения
    if (!isCorrect) {
      this.addFailedBlock(blockId, blockTitle, topic, difficulty);
    }

    return isCorrect;
  }

  /**
   * Добавляет блок в список неправильных ответов
   */
  private addFailedBlock(blockId: number, blockTitle: string, topic: string, difficulty: string): void {
    const existingFailed = this.progress.failedBlocks.find(b => b.blockId === blockId);

    if (existingFailed) {
      // Увеличиваем счетчик попыток для этого блока
      existingFailed.failureCount++;
      existingFailed.lastFailedAt = new Date();
    } else {
      // Добавляем новый неправильный блок
      this.progress.failedBlocks.push({
        blockId,
        blockTitle,
        topic,
        failureCount: 1,
        lastFailedAt: new Date(),
        difficulty
      });
    }
  }

  /**
   * Получает список блоков для повторения
   */
  getFailedBlocks(): FailedBlockEntry[] {
    return this.progress.failedBlocks;
  }

  /**
   * Проверяет, нужно ли добавлять ремедиалы
   */
  shouldAddRemedials(): boolean {
    return this.progress.failedBlocks.length > 0;
  }

  /**
   * Регистрирует добавление ремедиалов
   */
  recordRemedialsAdded(originalBlockIds: number[], addedAfterBlockId: number): void {
    originalBlockIds.forEach(blockId => {
      const remedialsCount = this.progress.failedBlocks.filter(b => b.blockId === blockId)[0]?.failureCount || 1;

      this.progress.remedialsAdded.push({
        originalBlockId: blockId,
        remedialsGenerated: remedialsCount,
        addedAfterBlockId,
        generatedAt: new Date()
      });
    });
  }

  /**
   * Получает статистику прогресса
   */
  getStatistics() {
    const totalAnswers = this.progress.performanceHistory.length;
    const correctAnswers = this.progress.performanceHistory.filter(p => p.isCorrect).length;
    const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

    return {
      totalAnswers,
      correctAnswers,
      accuracy,
      failedBlocksCount: this.progress.failedBlocks.length,
      remedialsAddedCount: this.progress.remedialsAdded.reduce((sum, r) => sum + r.remedialsGenerated, 0),
      currentBlockIndex: this.progress.currentBlockIndex,
      isCompleted: this.progress.isCompleted
    };
  }

  /**
   * Получает полный прогресс
   */
  getProgress(): LessonProgress {
    return this.progress;
  }

  /**
   * Отмечает урок как завершенный
   */
  completeLesson(): void {
    this.progress.isCompleted = true;
  }
}

/**
 * Генератор ремедиальных блоков
 */
export function generateRemedialsPrompt(
  failedBlocks: FailedBlockEntry[],
  courseName: string
): string {
  const blocksDescription = failedBlocks
    .map(
      (block, index) =>
        `${index + 1}. "${block.blockTitle}" (Тема: ${block.topic}, Сложность: ${block.difficulty}, Неправильных ответов: ${block.failureCount})`
    )
    .join('\n');

  return `Ты - опытный преподаватель ${courseName}. 

Студент ответил неправильно на следующие практические блоки:
${blocksDescription}

ЗАДАЧА: Создай ремедиальные (повторяющие) блоки для повторения и закрепления трудного материала.

ТРЕБОВАНИЯ:
1. Для каждого неправильного блока создай 1-2 ремедиальных блока
2. Используй ДРУГИЕ формулировки и ДРУГИЕ примеры, чем в оригинальных блоках
3. Сохрани ту же концепцию и тему, но упрости или расширь в зависимости от сложности
4. Каждый ремедиальный блок должен иметь:
   - Краткое объяснение с ДРУГИМ подходом
   - 2-3 новых практических вопроса с множественным выбором
   - Пошаговое объяснение для каждого ответа

5. Структура ремедиального блока:
   - Заголовок: "Повторение: [оригинальное название] (Подход #2)"
   - Контент: "Давай разберем эту же концепцию с другой стороны..."
   - Вопросы с новыми примерами

ФОРМАТ ОТВЕТА (ТОЛЬКО JSON):
[
  {
    "id": "remedial_[originalBlockId]_v1",
    "type": "practice",
    "title": "Повторение: [название блока] (Подход #2)",
    "originalBlockId": [blockId],
    "content": "Объяснение с другой точки зрения",
    "instructions": "Попробуй снова с новыми примерами",
    "difficulty": "beginner|intermediate|advanced",
    "questions": [
      {
        "id": "q1",
        "question": "Новый вопрос на ту же тему",
        "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
        "correctAnswer": 0,
        "explanation": "Пошаговое объяснение почему именно этот ответ"
      }
    ]
  }
]

ВАЖНО:
- Используй ДРУГИЕ слова и примеры
- Первый ремедиал = "Подход #2", второй = "Подход #3"
- Объяснения должны быть четче и проще первого раза
- Фокусируйся на самых частых ошибках`;
}

/**
 * Интеграция ремедиалов в урок
 */
export interface LessonWithRemedials {
  originalBlocks: Array<any>;
  remedialsBlocks: Array<any>;
  fullLessonBlocks: Array<any>;
}

/**
 * Вставляет ремедиальные блоки в конец урока
 */
export function insertRemedialsIntoLesson(
  originalBlocks: Array<any>,
  remedialsBlocks: Array<any>
): Array<any> {
  // Создаем новый массив с оригинальными блоками
  const fullLessonBlocks = [...originalBlocks];

  // Добавляем разделитель перед ремедиалами
  if (remedialsBlocks.length > 0) {
    fullLessonBlocks.push({
      id: 999,
      type: 'separator',
      title: '🔄 Повторение трудного материала',
      content: 'Вы ответили неправильно на некоторые вопросы. Давайте повторим эти темы с другого подхода!',
      difficulty: 'intermediate'
    });

    // Добавляем ремедиальные блоки
    remedialsBlocks.forEach((remedial, index) => {
      fullLessonBlocks.push({
        ...remedial,
        id: 1000 + index, // Новый ID для ремедиальных блоков
        isRemedial: true,
        originalBlockId: remedial.originalBlockId
      });
    });

    // Финальный блок завершения
    fullLessonBlocks.push({
      id: 2000,
      type: 'summary',
      title: '✅ Отлично! Вы готовы продолжать',
      content: 'Вы успешно повторили все трудные темы. Теперь вы готовы к новому материалу!',
      difficulty: 'beginner'
    });
  }

  return fullLessonBlocks;
}

/**
 * Генерирует отчет о повторении
 */
export function generateRemedialsReport(progress: LessonProgress): string {
  const stats = {
    totalQuestions: progress.performanceHistory.length,
    correctAnswers: progress.performanceHistory.filter(p => p.isCorrect).length,
    accuracy: progress.performanceHistory.length > 0
      ? Math.round((progress.performanceHistory.filter(p => p.isCorrect).length / progress.performanceHistory.length) * 100)
      : 0,
    failedBlocks: progress.failedBlocks.length,
    remedialsGenerated: progress.remedialsAdded.reduce((sum, r) => sum + r.remedialsGenerated, 0)
  };

  let report = `# 📊 Отчет о прогрессе урока\n\n`;
  report += `## Статистика\n`;
  report += `- **Всего вопросов:** ${stats.totalQuestions}\n`;
  report += `- **Правильных ответов:** ${stats.correctAnswers}\n`;
  report += `- **Точность:** ${stats.accuracy}%\n\n`;

  if (stats.failedBlocks > 0) {
    report += `## Блоки для повторения\n`;
    report += `- **Количество неправильных блоков:** ${stats.failedBlocks}\n`;
    report += `- **Сгенерировано ремедиалов:** ${stats.remedialsGenerated}\n\n`;

    report += `### Темы, требующие повторения:\n`;
    progress.failedBlocks.forEach(block => {
      report += `- **${block.blockTitle}** (${block.topic}) - ${block.failureCount} ошибок\n`;
    });
  } else {
    report += `## ✅ Отлично!\n`;
    report += `Вы ответили правильно на все вопросы! Ремедиалы не требуются.\n`;
  }

  return report;
}

