# ⚡ Быстрый старт: Система ремедиалов

## За 5 минут до интеграции

### 1️⃣ Импортируйте необходимое

```typescript
// В вашем Chat.tsx
import { 
  LessonProgressTracker, 
  generateRemedialsPrompt,
  insertRemedialsIntoLesson
} from '../utils/adaptiveLessonFlow';

import { RemedialsSystemComponent } from '../components/RemedialsSystem';
```

### 2️⃣ Инициализируйте трекер

```typescript
// При начале урока
const tracker = new LessonProgressTracker('lesson-1', 15);
setTracker(tracker);
```

### 3️⃣ Запишите ответ

```typescript
// Когда ученик выбирает вариант ответа
const isCorrect = tracker.recordAnswer(
  2,                          // blockId
  'practice',                 // blockType
  'Модальные глаголы',       // blockTitle
  'modals',                   // topic
  'q1',                       // questionId
  'Choose must or should',    // question
  'must',                     // userAnswer
  'should',                   // correctAnswer
  'beginner'                  // difficulty
);

if (isCorrect) {
  console.log('✅ Правильно!');
} else {
  console.log('❌ Ошибка. Этот блок будет повторен.');
}
```

### 4️⃣ Отобразите статистику (опционально)

```typescript
// Где-нибудь в JSX
{tracker && <RemedialsSystemComponent tracker={tracker} />}
```

### 5️⃣ При завершении урока генерируйте ремедиалы

```typescript
const completeLesson = async () => {
  if (!tracker.shouldAddRemedials()) {
    console.log('✅ Ошибок нет!');
    return;
  }

  try {
    // Получаем неправильные блоки
    const failedBlocks = tracker.getFailedBlocks();
    
    // Генерируем промпт
    const prompt = generateRemedialsPrompt(failedBlocks, 'English Language');
    
    // Отправляем в AI
    const response = await fetch(`${window.location.origin}/api/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 3000,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    // Парсим JSON
    const jsonStr = data.choices[0].message.content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const remedialsBlocks = JSON.parse(jsonStr);
    
    // Вставляем в урок
    const fullLesson = insertRemedialsIntoLesson(originalBlocks, remedialsBlocks);
    setBlocks(fullLesson);
    
    console.log(`✅ Добавлено ${remedialsBlocks.length} ремедиалов`);
  } catch (error) {
    console.error('Ошибка при генерировании ремедиалов:', error);
  }
};
```

## 🎯 Полный минимальный пример

```typescript
import React, { useState } from 'react';
import { LessonProgressTracker, generateRemedialsPrompt, insertRemedialsIntoLesson } from '../utils/adaptiveLessonFlow';
import { RemedialsSystemComponent } from '../components/RemedialsSystem';

const LessonView: React.FC = () => {
  const [tracker, setTracker] = useState<LessonProgressTracker | null>(null);
  const [blocks, setBlocks] = useState<any[]>([]);

  // Инициализация
  const startLesson = (lessonBlocks: any[]) => {
    const newTracker = new LessonProgressTracker('lesson-id', lessonBlocks.length);
    setTracker(newTracker);
    setBlocks(lessonBlocks);
  };

  // Обработка ответа
  const handleAnswer = (blockId: number, blockTitle: string, qId: string, 
                        question: string, userAnswer: string, 
                        correctAnswer: string, difficulty: string) => {
    if (!tracker) return;
    
    const isCorrect = tracker.recordAnswer(
      blockId, 'practice', blockTitle, 'topic', qId, question, userAnswer, correctAnswer, difficulty
    );
    
    if (isCorrect) {
      alert('✅ Правильно!');
    } else {
      alert('❌ Неправильно. Ремедиал будет в конце урока.');
    }
  };

  // Завершение урока
  const finishLesson = async () => {
    if (!tracker) return;

    if (!tracker.shouldAddRemedials()) {
      alert('✅ Отлично! Ошибок не найдено.');
      return;
    }

    try {
      const failedBlocks = tracker.getFailedBlocks();
      const prompt = generateRemedialsPrompt(failedBlocks, 'English');
      
      const response = await fetch(`${window.location.origin}/api/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 3000
        })
      });

      const data = await response.json();
      const jsonStr = data.choices[0].message.content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const remedialsBlocks = JSON.parse(jsonStr);
      const fullLesson = insertRemedialsIntoLesson(blocks, remedialsBlocks);
      
      setBlocks(fullLesson);
      alert(`✅ Добавлено ${remedialsBlocks.length} ремедиалов!`);
    } catch (error) {
      alert('❌ Ошибка при генерировании ремедиалов');
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Статистика */}
      {tracker && <RemedialsSystemComponent tracker={tracker} />}

      {/* Блоки урока */}
      <div className="space-y-3">
        {blocks.map(block => (
          block.type === 'practice' ? (
            <div key={block.id} className="p-4 border rounded">
              <h3>{block.title}</h3>
              {block.questions?.map((q: any, idx: number) => (
                <div key={q.id} className="mt-3">
                  <p>{q.question}</p>
                  {q.options.map((opt: string, optIdx: number) => (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswer(
                        block.id, block.title, q.id, q.question, 
                        opt, q.options[q.correctAnswer], block.difficulty
                      )}
                      className="block w-full text-left p-2 mt-1 border rounded hover:bg-blue-50"
                    >
                      {String.fromCharCode(65 + optIdx)}) {opt}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ) : null
        ))}
      </div>

      {/* Кнопка завершения */}
      <button
        onClick={finishLesson}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Завершить урок
      </button>
    </div>
  );
};

export default LessonView;
```

## 🔍 Отладка

### Проверьте трекер

```typescript
console.log('Статистика:', tracker.getStatistics());
console.log('Ошибки:', tracker.getFailedBlocks());
console.log('Отчет:', tracker.getProgress());
```

### Проверьте промпт

```typescript
const prompt = generateRemedialsPrompt(failedBlocks, 'English');
console.log('Промпт для AI:\n', prompt);
```

### Проверьте JSON парсинг

```typescript
try {
  const remedialsBlocks = JSON.parse(jsonStr);
  console.log('✅ JSON успешно распарсен:', remedialsBlocks);
} catch (error) {
  console.error('❌ Ошибка парсинга:', error);
  console.log('Текст для парсинга:', jsonStr);
}
```

## 🎨 Кастомизация

### Изменить сообщение ремедиала

```typescript
// В generateRemedialsPrompt, измените текст:
// "Повторение: [название] (Подход #2)" 
// на что-то другое
```

### Изменить сложность ремедиалов

```typescript
// В generateRemedialsPrompt, добавьте:
// "Если failureCount > 2, упростите ремедиал еще больше"
```

### Добавить свою статистику

```typescript
const stats = tracker.getStatistics();
console.log(`
  Точность: ${stats.accuracy}%
  Блоков для повторения: ${stats.failedBlocksCount}
  Ремедиалов: ${stats.remedialsAddedCount}
`);
```

## ✅ Чеклист интеграции

- [ ] Импортированы все необходимые компоненты
- [ ] LessonProgressTracker инициализирован в начале урока
- [ ] recordAnswer вызывается при каждом ответе
- [ ] RemedialsSystemComponent отображается (опционально)
- [ ] При завершении урока вызывается checkAndAddRemedials
- [ ] Обработана ошибка JSON парсинга с fallback
- [ ] Проверена работа на тестовых данных

## 📞 Помощь

Если что-то не работает:

1. Проверьте консоль браузера (F12) на ошибки
2. Убедитесь, что OpenAI API ключ настроен в `.env`
3. Проверьте формат JSON ответа от AI
4. Посмотрите документацию в `docs/REMEDIALS_*.md`

---

**Готовы начать?** 🚀 Скопируйте минимальный пример выше и адаптируйте под ваш Chat компонент!

