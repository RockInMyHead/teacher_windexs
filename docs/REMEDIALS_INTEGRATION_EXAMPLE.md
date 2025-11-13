# 🔧 Пример интеграции системы ремедиалов в Chat.tsx

## Полный пример использования

```typescript
// src/pages/Chat.tsx

import React, { useState, useRef, useEffect } from 'react';
import { 
  LessonProgressTracker, 
  generateRemedialsPrompt,
  insertRemedialsIntoLesson,
  generateRemedialsReport 
} from '../utils/adaptiveLessonFlow';
import { RemedialsSystemComponent, RemedialsBlock } from '../components/RemedialsSystem';

interface LessonState {
  blocks: any[];
  currentBlockIndex: number;
  tracker: LessonProgressTracker | null;
  remedialsGenerated: boolean;
}

export const Chat: React.FC = () => {
  const [lessonState, setLessonState] = useState<LessonState>({
    blocks: [],
    currentBlockIndex: 0,
    tracker: null,
    remedialsGenerated: false
  });

  const [showRemedialsStats, setShowRemedialsStats] = useState(false);

  // === ИНИЦИАЛИЗАЦИЯ УРОКА ===
  const initializeLessonWithTracking = (lessonBlocks: any[]) => {
    const tracker = new LessonProgressTracker('lesson-001', lessonBlocks.length);
    
    setLessonState({
      blocks: lessonBlocks,
      currentBlockIndex: 0,
      tracker,
      remedialsGenerated: false
    });
  };

  // === ОБРАБОТКА ОТВЕТА НА ВОПРОС ===
  const handlePracticeAnswer = (
    blockId: number,
    blockTitle: string,
    questionId: string,
    question: string,
    userAnswer: string,
    correctAnswer: string,
    difficulty: string
  ) => {
    const { tracker, blocks } = lessonState;
    
    if (!tracker) return;

    // Записываем ответ
    const isCorrect = tracker.recordAnswer(
      blockId,
      'practice',
      blockTitle,
      'current_topic',
      questionId,
      question,
      userAnswer,
      correctAnswer,
      difficulty
    );

    // Визуальная обратная связь
    if (isCorrect) {
      console.log('✅ Правильно!');
    } else {
      console.log('❌ Неправильно. Этот блок будет повторен в конце урока.');
    }

    // Проверяем, завершен ли урок
    if (lessonState.currentBlockIndex === blocks.length - 1) {
      // Урок завершен - пора добавлять ремедиалы
      checkAndAddRemedials();
    }
  };

  // === ПРОВЕРКА И ДОБАВЛЕНИЕ РЕМЕДИАЛОВ ===
  const checkAndAddRemedials = async () => {
    const { tracker, blocks } = lessonState;
    
    if (!tracker || lessonState.remedialsGenerated) return;

    // Если есть ошибки - генерируем ремедиалы
    if (tracker.shouldAddRemedials()) {
      try {
        // 1. Получаем список неправильных блоков
        const failedBlocks = tracker.getFailedBlocks();
        
        // 2. Генерируем промпт
        const remedialsPrompt = generateRemedialsPrompt(failedBlocks, 'English Language');
        
        // 3. Отправляем в OpenAI API
        const response = await fetch(`${window.location.origin}/api/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'Ты помощник по генерированию учебных материалов.' },
              { role: 'user', content: remedialsPrompt }
            ],
            max_tokens: 3000,
            temperature: 0.7
          })
        });

        const data = await response.json();
        const remedialsJsonStr = data.choices[0].message.content;
        
        // 4. Парсим JSON (может быть обернут в ```json ... ```)
        let remedialsBlocks: any[] = [];
        try {
          // Удаляем markdown обертку если есть
          const jsonStr = remedialsJsonStr
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();
          
          remedialsBlocks = JSON.parse(jsonStr);
        } catch (e) {
          console.error('Ошибка парсинга ремедиалов:', e);
          remedialsBlocks = [];
        }

        // 5. Вставляем ремедиалы в урок
        const fullLesson = insertRemedialsIntoLesson(blocks, remedialsBlocks);
        
        // 6. Регистрируем в трекере
        tracker.recordRemedialsAdded(
          failedBlocks.map(b => b.blockId),
          blocks.length // После последнего оригинального блока
        );

        // 7. Обновляем состояние урока
        setLessonState(prev => ({
          ...prev,
          blocks: fullLesson,
          remedialsGenerated: true
        }));

        console.log(`✅ Добавлено ${remedialsBlocks.length} ремедиальных блоков`);
      } catch (error) {
        console.error('Ошибка при генерировании ремедиалов:', error);
      }
    } else {
      // Если нет ошибок - отмечаем урок как завершенный
      tracker.completeLesson();
      console.log('✅ Урок завершен! Ошибок не найдено.');
    }
  };

  // === РЕНДЕР ПРАКТИЧЕСКОГО БЛОКА ===
  const renderPracticeBlock = (block: any) => {
    if (block.type !== 'practice') return null;

    return (
      <div key={block.id} className="p-4 bg-card rounded-lg border border-border">
        <h3 className="font-semibold mb-3">✍️ {block.title}</h3>
        <p className="text-sm mb-4">{block.content}</p>

        <div className="space-y-3">
          {block.questions?.map((question: any, qIdx: number) => (
            <div key={question.id} className="p-3 bg-muted/50 rounded">
              <p className="font-medium text-sm mb-2">
                {qIdx + 1}. {question.question}
              </p>
              <div className="space-y-1">
                {question.options.map((option: string, optIdx: number) => (
                  <button
                    key={optIdx}
                    onClick={() => handlePracticeAnswer(
                      block.id,
                      block.title,
                      question.id,
                      question.question,
                      option,
                      question.options[question.correctAnswer],
                      block.difficulty
                    )}
                    className="w-full text-left p-2 rounded hover:bg-primary/10 text-sm"
                  >
                    {String.fromCharCode(65 + optIdx)}) {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // === РЕНДЕР РЕМЕДИАЛЬНОГО БЛОКА ===
  const renderRemedialsBlock = (block: any) => {
    if (block.type !== 'practice' || !block.isRemedial) return null;

    return (
      <RemedialsBlock
        key={block.id}
        block={block}
        onAnswerSubmit={(questionId, answer, isCorrect) => {
          handlePracticeAnswer(
            block.id,
            block.title,
            questionId,
            block.questions[0]?.question || '',
            answer,
            block.questions[0]?.options[block.questions[0]?.correctAnswer] || '',
            block.difficulty
          );
        }}
      />
    );
  };

  // === РЕНДЕР РАЗДЕЛИТЕЛЯ ===
  const renderSeparator = (block: any) => {
    if (block.type !== 'separator') return null;

    return (
      <div key={block.id} className="my-6 p-4 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900 dark:to-amber-900 rounded-lg border-2 border-orange-300 dark:border-orange-700">
        <h2 className="text-xl font-bold text-orange-900 dark:text-orange-100">
          {block.title}
        </h2>
        <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
          {block.content}
        </p>
      </div>
    );
  };

  // === ГЛАВНЫЙ РЕНДЕР ===
  return (
    <div className="space-y-4">
      {/* Статистика ремедиалов */}
      {lessonState.tracker && (
        <button
          onClick={() => setShowRemedialsStats(!showRemedialsStats)}
          className="w-full p-2 text-left rounded border border-border hover:bg-muted"
        >
          📊 Показать статистику прогресса
        </button>
      )}

      {showRemedialsStats && lessonState.tracker && (
        <RemedialsSystemComponent tracker={lessonState.tracker} />
      )}

      {/* Блоки урока */}
      <div className="space-y-4">
        {lessonState.blocks.map((block) => {
          if (block.type === 'separator') {
            return renderSeparator(block);
          } else if (block.type === 'practice' && block.isRemedial) {
            return renderRemedialsBlock(block);
          } else if (block.type === 'practice') {
            return renderPracticeBlock(block);
          } else {
            // Рендер других типов блоков...
            return <div key={block.id}>{block.title}</div>;
          }
        })}
      </div>
    </div>
  );
};

export default Chat;
```

## Альтернативный вариант: Hook для управления ремедиалами

```typescript
// src/hooks/useRemedialsSystem.ts

import { useState, useCallback } from 'react';
import { 
  LessonProgressTracker, 
  generateRemedialsPrompt,
  insertRemedialsIntoLesson 
} from '../utils/adaptiveLessonFlow';

export function useRemedialsSystem(initialLessonBlocks: any[]) {
  const [tracker] = useState(() => 
    new LessonProgressTracker('lesson', initialLessonBlocks.length)
  );
  
  const [blocks, setBlocks] = useState(initialLessonBlocks);
  const [remedialsGenerated, setRemedialsGenerated] = useState(false);

  const handleAnswer = useCallback((
    blockId: number,
    blockTitle: string,
    questionId: string,
    question: string,
    userAnswer: string,
    correctAnswer: string,
    difficulty: string
  ) => {
    const isCorrect = tracker.recordAnswer(
      blockId,
      'practice',
      blockTitle,
      'topic',
      questionId,
      question,
      userAnswer,
      correctAnswer,
      difficulty
    );

    return isCorrect;
  }, [tracker]);

  const generateRemedials = useCallback(async (courseName: string) => {
    if (remedialsGenerated || !tracker.shouldAddRemedials()) {
      return false;
    }

    try {
      const failedBlocks = tracker.getFailedBlocks();
      const prompt = generateRemedialsPrompt(failedBlocks, courseName);
      
      const response = await fetch(`${window.location.origin}/api/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'user', content: prompt }
          ],
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
      
      tracker.recordRemedialsAdded(
        failedBlocks.map(b => b.blockId),
        initialLessonBlocks.length
      );

      setBlocks(fullLesson);
      setRemedialsGenerated(true);
      
      return true;
    } catch (error) {
      console.error('Error generating remedials:', error);
      return false;
    }
  }, [tracker, blocks, remedialsGenerated, initialLessonBlocks.length]);

  return {
    tracker,
    blocks,
    remedialsGenerated,
    handleAnswer,
    generateRemedials
  };
}
```

## Использование Hook'а

```typescript
const Chat: React.FC = () => {
  const { tracker, blocks, handleAnswer, generateRemedials } = useRemedialsSystem(initialBlocks);

  const onLessonComplete = async () => {
    await generateRemedials('English Language');
  };

  return (
    // ... JSX ...
  );
};
```

## Обработка ошибок при генерировании

```typescript
const generateRemedialsWithFallback = async (failedBlocks: any[], courseName: string) => {
  try {
    const prompt = generateRemedialsPrompt(failedBlocks, courseName);
    const response = await fetch(`${window.location.origin}/api/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Безопасный парсинг JSON
    let remedialsBlocks: any[] = [];
    const content = data.choices[0]?.message?.content || '';
    
    try {
      const jsonStr = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      remedialsBlocks = JSON.parse(jsonStr);
      
      // Валидация структуры
      if (!Array.isArray(remedialsBlocks)) {
        throw new Error('Invalid response format');
      }
    } catch (parseError) {
      console.warn('Failed to parse remedials JSON:', parseError);
      // Fallback: создаем простые ремедиалы
      remedialsBlocks = failedBlocks.map((block, idx) => ({
        id: `remedial_${block.blockId}_fallback`,
        type: 'practice',
        title: `Повторение: ${block.blockTitle} (Практика)`,
        originalBlockId: block.blockId,
        content: 'Давайте еще раз разберемся в этой теме.',
        instructions: 'Попробуй снова',
        difficulty: block.difficulty,
        questions: [
          {
            id: `q${idx + 1}`,
            question: 'Попробуй ответить еще раз на этот вопрос',
            options: ['Вариант A', 'Вариант B', 'Вариант C'],
            correctAnswer: 0,
            explanation: 'Продолжай обучение!'
          }
        ]
      }));
    }

    return remedialsBlocks;
  } catch (error) {
    console.error('Error in generateRemedialsWithFallback:', error);
    return [];
  }
};
```

