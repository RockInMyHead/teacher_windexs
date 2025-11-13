/**
 * Lesson Structure Generator
 * Creates 15-block lessons with alternating theory and practice
 * Includes pronunciation tasks for languages
 */

export interface LessonBlock {
  id: number;
  type: 'theory' | 'practice' | 'pronunciation' | 'exercise' | 'interactive';
  title: string;
  content: string;
  instructions?: string;
  questions?: LessonQuestion[];
  pronunciationWords?: PronunciationTask[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface LessonQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface PronunciationTask {
  word: string;
  translation: string;
  example: string;
  exampleTranslation: string;
}

export interface CompleteLesson {
  title: string;
  topic: string;
  level: string;
  language: string;
  blocks: LessonBlock[];
}

// Languages that require pronunciation
const PRONUNCIATION_LANGUAGES = ['английский', 'english', 'китайский', 'chinese', 'русский', 'russian', 'арабский', 'arabic'];

export function generateLessonPrompt(
  topic: string,
  level: string,
  language: string,
  courseName: string
): string {
  const hasPronunciation = PRONUNCIATION_LANGUAGES.some(lang => 
    language.toLowerCase().includes(lang.toLowerCase())
  );

  return `Ты - опытный преподаватель ${courseName}. Создай ПОЛНЫЙ интерактивный урок по теме "${topic}" для уровня "${level}".

СТРУКТУРА УРОКА: 15 БЛОКОВ с чередованием теории и практики

Порядок блоков:
1. Введение в тему (theory)
2. Практическое задание 1 (practice)
${hasPronunciation ? '3. Произношение: ключевые слова (pronunciation)\n' : '3. Упражнение 1 (exercise)\n'}
4. Основная теория - Часть 1 (theory)
5. Практическое задание 2 (practice)
6. ${hasPronunciation ? 'Произношение: фразы (pronunciation)' : 'Упражнение 2 (exercise)'}
7. Основная теория - Часть 2 (theory)
8. Интерактивное упражнение 1 (interactive)
9. ${hasPronunciation ? 'Произношение: сложные конструкции (pronunciation)' : 'Практическое задание 3 (practice)'}
10. Расширенная теория (theory)
11. Практическое задание 4 (practice)
12. ${hasPronunciation ? 'Произношение: диалоги (pronunciation)' : 'Упражнение 3 (exercise)'}
13. Примеры и кейсы (theory + examples)
14. Итоговое интерактивное задание (interactive)
15. Заключение и домашнее задание (summary)

${hasPronunciation ? `ТРЕБОВАНИЯ К ПРОИЗНОШЕНИЮ:
- Для каждого блока произношения включи 5-7 слов/фраз
- Каждое слово должно иметь: слово, перевод, пример предложения, перевод примера
- Структурируй от простого к сложному
- Фокусируйся на трудных для произношения моментах` : ''}

ТРЕБОВАНИЯ К ПРАКТИКЕ:
- Каждое практическое задание: 3-4 вопроса с множественным выбором
- Включай объяснения для правильных ответов
- Прогрессирующая сложность

ТРЕБОВАНИЯ К ИНТЕРАКТИВНЫМ ЗАДАНИЯМ:
- Симуляция реальных ситуаций
- Составление собственных предложений
- Применение знаний в контексте

Верни ответ в формате JSON:
{
  "title": "Название урока",
  "topic": "${topic}",
  "level": "${level}",
  "language": "${language}",
  "blocks": [
    {
      "id": 1,
      "type": "theory",
      "title": "Название блока",
      "content": "Основной контент",
      "difficulty": "beginner"
    },
    {
      "id": 2,
      "type": "practice",
      "title": "Практика 1",
      "content": "Инструкция",
      "instructions": "Выполни задание",
      "difficulty": "beginner",
      "questions": [
        {
          "id": "q1",
          "question": "Текст вопроса",
          "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
          "correctAnswer": 0,
          "explanation": "Объяснение"
        }
      ]
    },
    ${hasPronunciation ? `{
      "id": 3,
      "type": "pronunciation",
      "title": "Произношение",
      "content": "Ключевые слова этого урока",
      "difficulty": "beginner",
      "pronunciationWords": [
        {
          "word": "слово",
          "translation": "перевод",
          "example": "пример предложения",
          "exampleTranslation": "перевод примера"
        }
      ]
    },` : ''}
    // ... остальные 12-14 блоков в той же структуре
  ]
}

ВАЖНЫЕ ПРАВИЛА:
1. Начни с простого, заканчивай сложным
2. После каждой теории следует практика
3. Чередуй типы заданий для разнообразия
4. Используй реальные примеры и контекст
5. Добавь мотивацию и интерес к теме
6. НЕ добавляй никакого текста кроме JSON`;
}

export function isLanguageWithPronunciation(language: string): boolean {
  return PRONUNCIATION_LANGUAGES.some(lang => 
    language.toLowerCase().includes(lang.toLowerCase())
  );
}

export function formatLessonForDisplay(lesson: CompleteLesson): string {
  let result = `# ${lesson.title}\n\n`;
  result += `📚 Тема: ${lesson.topic}\n`;
  result += `📈 Уровень: ${lesson.level}\n`;
  result += `🌐 Язык: ${lesson.language}\n\n`;
  result += `Всего блоков: ${lesson.blocks.length}\n\n`;

  lesson.blocks.forEach((block, index) => {
    result += `---\n\n## Блок ${block.id}: ${block.title}\n\n`;
    result += `**Тип**: ${getBlockTypeLabel(block.type)}\n`;
    result += `**Сложность**: ${getDifficultyLabel(block.difficulty)}\n\n`;
    result += `${block.content}\n\n`;

    if (block.instructions) {
      result += `📝 ${block.instructions}\n\n`;
    }

    if (block.questions && block.questions.length > 0) {
      result += `**Вопросы:**\n`;
      block.questions.forEach((q, qIndex) => {
        result += `${qIndex + 1}. ${q.question}\n`;
        q.options.forEach((opt, optIndex) => {
          result += `   ${String.fromCharCode(65 + optIndex)}) ${opt}\n`;
        });
        result += `\n`;
      });
    }

    if (block.pronunciationWords && block.pronunciationWords.length > 0) {
      result += `**Произношение:**\n`;
      block.pronunciationWords.forEach(word => {
        result += `• **${word.word}** (${word.translation})\n`;
        result += `  Пример: "${word.example}"\n`;
        result += `  Перевод: "${word.exampleTranslation}"\n\n`;
      });
    }
  });

  return result;
}

function getBlockTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    theory: '📖 Теория',
    practice: '✍️ Практика',
    pronunciation: '🎤 Произношение',
    exercise: '🏋️ Упражнение',
    interactive: '🎯 Интерактив',
    summary: '📋 Резюме'
  };
  return labels[type] || type;
}

function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    beginner: '🟢 Начинающий',
    intermediate: '🟡 Средний',
    advanced: '🔴 Продвинутый'
  };
  return labels[difficulty] || difficulty;
}

// Валидация структуры урока
export function validateLessonStructure(lesson: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!lesson.blocks || lesson.blocks.length < 15) {
    errors.push(`Уроки должны содержать 15 блоков, найдено: ${lesson.blocks?.length || 0}`);
  }

  // Проверяем чередование типов
  let theoryCount = 0;
  let practiceCount = 0;
  let pronunciationCount = 0;

  lesson.blocks.forEach((block: LessonBlock, index: number) => {
    if (!block.id || !block.type || !block.title || !block.content) {
      errors.push(`Блок ${index + 1}: не хватает обязательных полей (id, type, title, content)`);
    }

    if (block.type === 'theory') theoryCount++;
    if (block.type === 'practice') practiceCount++;
    if (block.type === 'pronunciation') pronunciationCount++;

    if (block.type === 'practice' && (!block.questions || block.questions.length < 2)) {
      errors.push(`Блок ${block.id} (practice): должно быть минимум 2 вопроса`);
    }

    if (block.type === 'pronunciation' && (!block.pronunciationWords || block.pronunciationWords.length < 5)) {
      errors.push(`Блок ${block.id} (pronunciation): должно быть минимум 5 слов/фраз`);
    }
  });

  if (theoryCount < 3) {
    errors.push(`Недостаточно блоков теории: ${theoryCount} (минимум 3)`);
  }

  if (practiceCount < 3) {
    errors.push(`Недостаточно блоков практики: ${practiceCount} (минимум 3)`);
  }

  if (isLanguageWithPronunciation(lesson.language) && pronunciationCount < 3) {
    errors.push(`Для языков нужно минимум 3 блока произношения, найдено: ${pronunciationCount}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

