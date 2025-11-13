/**
 * Lesson Context Manager
 * Manages lesson context for contextual AI responses during lessons
 */

export interface LessonBlock {
  id: number;
  title: string;
  content: string;
  type: string;
}

export interface LessonContext {
  lessonId: string;
  currentTopic: string;
  lessonProgress: string;
  currentBlock?: LessonBlock;
  totalBlocks?: number;
  currentBlockIndex?: number;
}

/**
 * Creates lesson context for AI teacher
 */
export function createLessonContext(data: {
  lessonId: string;
  currentTopic: string;
  lessonProgress?: string;
  currentBlock?: LessonBlock;
  totalBlocks?: number;
  currentBlockIndex?: number;
}): LessonContext {
  return {
    lessonId: data.lessonId,
    currentTopic: data.currentTopic,
    lessonProgress: data.lessonProgress || 'Начало урока',
    currentBlock: data.currentBlock,
    totalBlocks: data.totalBlocks,
    currentBlockIndex: data.currentBlockIndex,
  };
}

/**
 * Updates lesson context when moving to next block
 */
export function updateLessonContextForBlock(
  currentContext: LessonContext,
  block: LessonBlock,
  blockIndex?: number,
  totalBlocks?: number
): LessonContext {
  return {
    ...currentContext,
    currentBlock: block,
    currentBlockIndex: blockIndex,
    totalBlocks: totalBlocks,
    lessonProgress: totalBlocks && blockIndex !== undefined
      ? `Блок ${blockIndex + 1} из ${totalBlocks}: ${block.title}`
      : `Блок: ${block.title}`,
  };
}

/**
 * Generates lesson-aware system prompt for AI teacher
 */
export function generateLessonSystemPrompt(lessonContext: LessonContext): string {
  const basePrompt = `Вы - опытный педагог, ведущий урок по теме "${lessonContext.currentTopic}".

КОНТЕКСТ УРОКА:
- Текущий урок: ${lessonContext.lessonId}
- Прогресс урока: ${lessonContext.lessonProgress}`;

  const blockInfo = lessonContext.currentBlock ? `
- Текущий блок: "${lessonContext.currentBlock.title}"
- Содержание блока: ${lessonContext.currentBlock.content}` : '';

  const contextRules = `

ВАЖНЫЕ ПРАВИЛА:
1. ВСЕГДА учитывайте контекст текущего урока в ответах
2. Если вопрос касается текущей темы - объясняйте в рамках урока
3. Если вопрос не связан с уроком - вежливо верните к теме урока
4. Используйте материалы и примеры из текущего блока
5. Поощряйте вопросы по теме урока
6. Объясняйте сложное простыми словами
7. Используйте аналогии и примеры
8. Ссылайтесь на предыдущие сообщения в уроке

СТИЛЬ ОТВЕТОВ:
- Будьте терпеливы и поддерживающи
- Разбивайте объяснения на шаги
- Задавайте наводящие вопросы
- Поощряйте самостоятельное мышление
- Используйте фразы типа "в рамках нашего урока", "продолжая тему", "как мы уже говорили"

Если ученик спрашивает о чем-то не связанном с уроком, скажите:
"Это интересный вопрос, но давайте сначала сосредоточимся на теме нашего урока - ${lessonContext.currentTopic}. После того, как разберем эту тему, сможем поговорить о других вопросах."`;

  return basePrompt + blockInfo + contextRules;
}

/**
 * Checks if a question is relevant to the current lesson topic
 */
export function isQuestionRelevantToLesson(
  question: string,
  lessonContext: LessonContext
): boolean {
  const questionLower = question.toLowerCase();
  const topicLower = lessonContext.currentTopic.toLowerCase();

  // Simple keyword matching - can be enhanced with AI
  const topicKeywords = topicLower.split(' ').filter(word => word.length > 2);
  const questionWords = questionLower.split(' ');

  const relevantKeywords = topicKeywords.filter(keyword =>
    questionWords.some(word => word.includes(keyword) || keyword.includes(word))
  );

  return relevantKeywords.length > 0;
}

/**
 * Creates a contextual response reminder for AI
 */
export function createContextualReminder(lessonContext: LessonContext): string {
  return `ПОМНИТЕ: Вы ведете урок по теме "${lessonContext.currentTopic}". ${
    lessonContext.currentBlock
      ? `Текущий блок: "${lessonContext.currentBlock.title}". `
      : ''
  }Отвечайте в контексте урока и поощряйте вопросы по теме.`;
}

/**
 * Generates progress update for lesson context
 */
export function generateProgressUpdate(
  completedBlocks: number,
  totalBlocks: number,
  currentTopic: string
): string {
  const progressPercent = Math.round((completedBlocks / totalBlocks) * 100);
  return `Завершено ${completedBlocks} из ${totalBlocks} блоков (${progressPercent}%) - ${currentTopic}`;
}

/**
 * Lesson Context Manager Class
 */
export class LessonContextManager {
  private currentContext: LessonContext | null = null;

  constructor() {}

  /**
   * Starts a lesson with context
   */
  startLesson(lessonData: {
    lessonId: string;
    currentTopic: string;
    lessonProgress?: string;
  }): LessonContext {
    this.currentContext = createLessonContext(lessonData);
    console.log('📚 Lesson context started:', this.currentContext);
    return this.currentContext;
  }

  /**
   * Updates current lesson block
   */
  updateCurrentBlock(block: LessonBlock, blockIndex?: number, totalBlocks?: number): LessonContext | null {
    if (!this.currentContext) return null;

    this.currentContext = updateLessonContextForBlock(
      this.currentContext,
      block,
      blockIndex,
      totalBlocks
    );

    console.log('📖 Block updated:', this.currentContext.currentBlock);
    return this.currentContext;
  }

  /**
   * Gets current system prompt for AI
   */
  getSystemPrompt(): string | null {
    if (!this.currentContext) return null;
    return generateLessonSystemPrompt(this.currentContext);
  }

  /**
   * Gets current context
   */
  getCurrentContext(): LessonContext | null {
    return this.currentContext;
  }

  /**
   * Checks if question is relevant
   */
  isQuestionRelevant(question: string): boolean {
    if (!this.currentContext) return false;
    return isQuestionRelevantToLesson(question, this.currentContext);
  }

  /**
   * Ends current lesson
   */
  endLesson(): void {
    console.log('📚 Lesson context ended');
    this.currentContext = null;
  }

  /**
   * Gets contextual reminder
   */
  getContextualReminder(): string | null {
    if (!this.currentContext) return null;
    return createContextualReminder(this.currentContext);
  }
}

