# 🏗️ Архитектура системы ремедиалов

## Обзор системы

```
┌─────────────────────────────────────────────────────────────┐
│                   ADAPTER LEARNING SYSTEM                   │
│                   (Система адаптивного обучения)            │
└─────────────────────────────────────────────────────────────┘
                              ↓
      ┌───────────────────────────────────────────┐
      │     REMEDIALS TRACKING & GENERATION       │
      │     (Трекинг и генерирование ремедиалов)  │
      └───────────────────────────────────────────┘
          ├─ Слой отслеживания
          ├─ Слой анализа
          ├─ Слой генерирования
          └─ Слой интеграции
```

## Слоистая архитектура

### 1️⃣ **LAYER 1: Tracking Layer** (adaptiveLessonFlow.ts)

```typescript
┌─────────────────────────────────────────┐
│    LessonProgressTracker                │
├─────────────────────────────────────────┤
│ Ответственность:                        │
│ ✓ Инициализация урока                   │
│ ✓ Запись каждого ответа                 │
│ ✓ Отслеживание ошибок                   │
│ ✓ Ведение истории производительности    │
└─────────────────────────────────────────┘

Методы:
├─ constructor(lessonId, totalBlocks)
├─ recordAnswer(...) → boolean
├─ getFailedBlocks() → FailedBlockEntry[]
├─ shouldAddRemedials() → boolean
├─ getStatistics() → Statistics
└─ getProgress() → LessonProgress
```

**Типы данных:**

```typescript
// Input
BlockPerformance {
  blockId: number
  blockType: string
  blockTitle: string
  topic: string
  questionId: string
  question: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  timestamp: Date
  difficulty: string
}

// Output
FailedBlockEntry {
  blockId: number
  blockTitle: string
  topic: string
  failureCount: number
  lastFailedAt: Date
  difficulty: string
}

LessonProgress {
  lessonId: string
  performanceHistory: BlockPerformance[]
  failedBlocks: FailedBlockEntry[]
  remedialsAdded: RemedialsAddedEntry[]
  currentBlockIndex: number
  isCompleted: boolean
}
```

### 2️⃣ **LAYER 2: Analysis Layer** (adaptiveLessonFlow.ts)

```typescript
┌─────────────────────────────────────────┐
│    Analysis Functions                   │
├─────────────────────────────────────────┤
│ generateRemedialsPrompt()                │
│ generateRemedialsReport()                │
└─────────────────────────────────────────┘

Функции:
├─ generateRemedialsPrompt(
│   failedBlocks,
│   courseName
│ ) → string
│
└─ generateRemedialsReport(
    progress
  ) → string
```

**Что происходит:**

1. Берет список `failedBlocks`
2. Форматирует описание для AI
3. Создает детальный промпт с инструкциями
4. Возвращает строку для OpenAI API

**Пример промпта:**

```
Ты - опытный преподаватель English Language.

Студент ответил неправильно на следующие практические блоки:
1. "Модальные глаголы" (Тема: modals, Неправильных ответов: 1)

ЗАДАЧА: Создай ремедиальные блоки для повторения...

ТРЕБОВАНИЯ:
1. Для каждого неправильного блока создай 1-2 ремедиальных блока
2. Используй ДРУГИЕ формулировки и ДРУГИЕ примеры
...

ФОРМАТ ОТВЕТА (ТОЛЬКО JSON):
[
  {
    "id": "remedial_2_v1",
    "type": "practice",
    "title": "Повторение: Модальные глаголы (Подход #2)",
    ...
  }
]
```

### 3️⃣ **LAYER 3: Generation Layer** (OpenAI API)

```
┌──────────────────────────────────┐
│      OpenAI API (gpt-4o-mini)    │
├──────────────────────────────────┤
│ Input:  Промпт с инструкциями    │
│ Output: JSON с ремедиалами       │
└──────────────────────────────────┘

Процесс:
1. Отправляем POST запрос с промптом
2. AI генерирует новые ремедиальные блоки
3. Получаем JSON в ответе
4. Парсим и валидируем JSON
```

**Структура ремедиального блока (OUTPUT):**

```json
{
  "id": "remedial_2_v1",
  "type": "practice",
  "title": "Повторение: Модальные глаголы (Подход #2)",
  "originalBlockId": 2,
  "content": "Давайте разберем эту же концепцию с другой стороны...",
  "instructions": "Попробуй снова с новыми примерами",
  "difficulty": "beginner",
  "questions": [
    {
      "id": "q1",
      "question": "Новый вопрос на ту же тему",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 1,
      "explanation": "Пошаговое объяснение..."
    }
  ]
}
```

### 4️⃣ **LAYER 4: Integration Layer** (insertRemedialsIntoLesson)

```typescript
┌──────────────────────────────────────────┐
│   insertRemedialsIntoLesson()            │
├──────────────────────────────────────────┤
│ Input:  originalBlocks, remedialsBlocks │
│ Output: fullLessonBlocks                │
└──────────────────────────────────────────┘

Процесс:
1. Копирует исходные блоки (1-15)
2. Добавляет разделитель
3. Добавляет ремедиальные блоки (1000+)
4. Добавляет финальный блок
5. Возвращает полный урок
```

**Структура полного урока:**

```
[
  Block 1 (original),
  Block 2 (original),
  ...
  Block 15 (original),
  
  {
    id: 999,
    type: 'separator',
    title: '🔄 Повторение трудного материала'
  },
  
  Block 1000 (remedial from AI),
  Block 1001 (remedial from AI),
  ...
  
  {
    id: 2000,
    type: 'summary',
    title: '✅ Отлично! Вы готовы продолжать'
  }
]
```

### 5️⃣ **LAYER 5: UI Layer** (RemedialsSystem.tsx)

```typescript
┌────────────────────────────────────────┐
│     RemedialsSystemComponent           │
├────────────────────────────────────────┤
│ Props:                                 │
│ ├─ tracker: LessonProgressTracker      │
│ └─ onRemedialsGenerated?: callback     │
│                                        │
│ Рендерит:                              │
│ ├─ Статистика (4 карточки)             │
│ ├─ Прогресс-бар                        │
│ ├─ Список ошибок                       │
│ └─ Инструкции                          │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│       RemedialsBlock                   │
├────────────────────────────────────────┤
│ Props:                                 │
│ ├─ block: RemedialsBlockData           │
│ └─ onAnswerSubmit?: callback           │
│                                        │
│ Рендерит:                              │
│ ├─ Заголовок ремедиала                │
│ ├─ Объяснение                          │
│ ├─ Вопросы с вариантами                │
│ └─ Объяснение ответа                   │
└────────────────────────────────────────┘
```

## Полный поток данных

```
STUDENT INPUT
    ↓
handlePracticeAnswer(blockId, userAnswer, correctAnswer)
    ↓
tracker.recordAnswer(...)
    ├─ Запись в performanceHistory
    ├─ Сравнение ответов
    └─ if !isCorrect → addFailedBlock()
    ↓
tracker.getFailedBlocks()  [FailedBlockEntry[]]
    ↓
generateRemedialsPrompt(failedBlocks)  [string]
    ↓
fetch(OpenAI API)
    ├─ POST /chat/completions
    ├─ Отправить промпт
    └─ Получить JSON
    ↓
JSON.parse(response)  [RemedialsBlocks[]]
    ↓
insertRemedialsIntoLesson(blocks, remedialsBlocks)  [FullLesson[]]
    ↓
setBlocks(fullLesson)
    ↓
RENDER FULL LESSON
    ├─ Оригинальные блоки
    ├─ Разделитель
    ├─ Ремедиальные блоки
    └─ Финальный блок
```

## Обработка ошибок

```
try {
  const failedBlocks = tracker.getFailedBlocks();
  
  if (failedBlocks.length === 0) {
    // Нет ошибок → завершить урок
    return;
  }
  
  const prompt = generateRemedialsPrompt(failedBlocks, courseName);
  const response = await fetch(apiEndpoint, { ... });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  const data = response.json();
  const jsonStr = parseMarkdown(data.choices[0].message.content);
  const remedialsBlocks = JSON.parse(jsonStr);
  
  if (!Array.isArray(remedialsBlocks)) {
    throw new Error('Invalid response format');
  }
  
  const fullLesson = insertRemedialsIntoLesson(blocks, remedialsBlocks);
  setBlocks(fullLesson);
  
  tracker.recordRemedialsAdded(
    failedBlocks.map(b => b.blockId),
    originalBlocks.length
  );
  
} catch (error) {
  // Fallback: простые ремедиалы
  const fallbackRemedials = createSimpleRemedials(failedBlocks);
  const fullLesson = insertRemedialsIntoLesson(blocks, fallbackRemedials);
  setBlocks(fullLesson);
}
```

## Схема классов

```
┌─────────────────────────────────┐
│   LessonProgressTracker         │
├─────────────────────────────────┤
│ - progress: LessonProgress      │
├─────────────────────────────────┤
│ + recordAnswer(): boolean       │
│ + getFailedBlocks(): []         │
│ + shouldAddRemedials(): bool    │
│ + getStatistics(): Stats        │
│ + getProgress(): LessonProgress │
│ + completeLesson(): void        │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│   LessonProgress (interface)    │
├─────────────────────────────────┤
│ + lessonId: string              │
│ + performanceHistory: []        │
│ + failedBlocks: []              │
│ + remedialsAdded: []            │
│ + isCompleted: boolean          │
└─────────────────────────────────┘
```

## Расширяемость

### Добавить свой источник ремедиалов

```typescript
interface RemedialsProvider {
  generateRemedials(failedBlocks: FailedBlockEntry[]): Promise<RemedialsBlock[]>;
}

class CustomProvider implements RemedialsProvider {
  async generateRemedials(failedBlocks) {
    // Ваша логика
  }
}
```

### Добавить свою метрику производительности

```typescript
interface PerformanceMetric {
  calculateMetric(performance: LessonProgress): number;
}

class AccuracyMetric implements PerformanceMetric {
  calculateMetric(progress) {
    return (progress.performanceHistory.filter(p => p.isCorrect).length / 
            progress.performanceHistory.length) * 100;
  }
}
```

## Оптимизация

### Кэширование промпта

```typescript
const promptCache = new Map<string, string>();

function getPrompt(failedBlockIds: string[], course: string): string {
  const key = `${failedBlockIds.join(',')}_${course}`;
  if (promptCache.has(key)) {
    return promptCache.get(key)!;
  }
  // Генерируем промпт
  return prompt;
}
```

### Пакетная обработка ошибок

```typescript
function batchFailedBlocks(failedBlocks: FailedBlockEntry[]): FailedBlockEntry[][] {
  const batches: FailedBlockEntry[][] = [];
  const batchSize = 3;
  
  for (let i = 0; i < failedBlocks.length; i += batchSize) {
    batches.push(failedBlocks.slice(i, i + batchSize));
  }
  
  return batches;
}
```

---

**Документация версии:** 1.0  
**Последнее обновление:** Ноябрь 2025

