# 📚 Пример интеграции контекстных вопросов в урок

## Полный пример использования

```typescript
// src/components/LessonComponent.tsx

import React, { useState, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { LessonBlock, LessonContext } from '@/utils/lessonContextManager';

interface LessonData {
  id: string;
  title: string;
  topic: string;
  blocks: LessonBlock[];
}

const LessonComponent: React.FC<{ lesson: LessonData }> = ({ lesson }) => {
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [lessonStarted, setLessonStarted] = useState(false);

  // Используем хук чата
  const {
    messages,
    sendMessage,
    startLessonMode,
    updateLessonBlock,
    endLessonMode,
    isLessonMode,
    lessonContextManager
  } = useChat();

  // Запуск урока
  const startLesson = () => {
    // Активируем режим урока в чате
    startLessonMode({
      lessonId: lesson.id,
      currentTopic: lesson.topic,
      lessonProgress: `Урок "${lesson.title}" - начало`
    });

    setLessonStarted(true);

    // Показываем приветственное сообщение
    const welcomeMessage = {
      id: Date.now().toString(),
      role: 'assistant' as const,
      content: `Привет! 🎓

Добро пожаловать на урок "${lesson.title}"!
Мы будем изучать тему: **${lesson.topic}**

У вас есть возможность задавать вопросы в любое время. Я буду отвечать, учитывая контекст текущего материала.

Начнем с первого блока!`,
      timestamp: new Date(),
    };

    // Показываем первый блок
    showCurrentBlock();
  };

  // Показать текущий блок
  const showCurrentBlock = () => {
    const currentBlock = lesson.blocks[currentBlockIndex];

    // Обновляем контекст урока
    updateLessonBlock(
      currentBlock,
      currentBlockIndex,
      lesson.blocks.length
    );

    // Добавляем сообщение с блоком
    const blockMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant' as const,
      content: formatBlockContent(currentBlock),
      timestamp: new Date(),
    };

    // В реальном коде добавьте в messages
    console.log('Показываем блок:', currentBlock.title);
  };

  // Форматирование контента блока
  const formatBlockContent = (block: LessonBlock): string => {
    let content = `## 📖 ${block.title}\n\n`;

    if (block.type === 'theory') {
      content += `${block.content}\n\n`;
      content += `💡 **Задавайте вопросы**, если что-то непонятно!`;
    } else if (block.type === 'practice') {
      content += `${block.content}\n\n`;
      content += `✍️ **Попробуйте выполнить задание**, а потом спросите, если возникнут вопросы.`;
    } else if (block.type === 'example') {
      content += `${block.content}\n\n`;
      content += `📝 **Посмотрите на примеры**. Можете спросить о чем-то конкретном!`;
    }

    return content;
  };

  // Переход к следующему блоку
  const nextBlock = () => {
    if (currentBlockIndex < lesson.blocks.length - 1) {
      setCurrentBlockIndex(prev => prev + 1);
      showCurrentBlock();
    } else {
      // Урок завершен
      finishLesson();
    }
  };

  // Завершение урока
  const finishLesson = () => {
    // Деактивируем режим урока
    endLessonMode();

    const finishMessage = {
      id: Date.now().toString(),
      role: 'assistant' as const,
      content: `🎉 **Урок завершен!**

Отличная работа! Вы прошли все блоки урока "${lesson.title}".

Теперь вы можете:
- Задать дополнительные вопросы по теме
- Попросить объяснить что-то подробнее
- Перейти к следующему уроку

Что вас интересует? 😊`,
      timestamp: new Date(),
    };

    setLessonStarted(false);
  };

  // Отправка сообщения (использует контекст урока)
  const handleSendMessage = (message: string) => {
    sendMessage(message); // Автоматически использует lesson mode если активен
  };

  return (
    <div className="lesson-container">
      {/* Заголовок урока */}
      <div className="lesson-header">
        <h1>{lesson.title}</h1>
        <p className="topic">Тема: {lesson.topic}</p>
        {lessonStarted && (
          <div className="lesson-progress">
            Блок {currentBlockIndex + 1} из {lesson.blocks.length}
          </div>
        )}
      </div>

      {/* Кнопка старта */}
      {!lessonStarted && (
        <button
          onClick={startLesson}
          className="start-lesson-btn"
        >
          🚀 Начать урок
        </button>
      )}

      {/* Контент урока */}
      {lessonStarted && (
        <>
          {/* Чат с возможностью вопросов */}
          <div className="lesson-chat">
            <div className="chat-messages">
              {messages.map(message => (
                <div key={message.id} className={`message ${message.role}`}>
                  <div className="message-content">
                    {message.content}
                  </div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Инпут для вопросов */}
            <div className="chat-input">
              <input
                type="text"
                placeholder={
                  isLessonMode
                    ? `Задайте вопрос по теме "${lesson.topic}"...`
                    : "Задайте вопрос..."
                }
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button onClick={() => {
                const input = document.querySelector('.chat-input input') as HTMLInputElement;
                handleSendMessage(input.value);
                input.value = '';
              }}>
                Отправить
              </button>
            </div>
          </div>

          {/* Навигация по блокам */}
          <div className="lesson-navigation">
            <button
              onClick={nextBlock}
              disabled={currentBlockIndex >= lesson.blocks.length - 1}
            >
              {currentBlockIndex >= lesson.blocks.length - 1 ? 'Завершить урок' : 'Следующий блок'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LessonComponent;
```

## Пример данных урока

```typescript
const sampleLesson: LessonData = {
  id: 'modal-verbs-lesson',
  title: 'Модальные глаголы в английском языке',
  topic: 'Модальные глаголы (can, must, should)',
  blocks: [
    {
      id: 1,
      title: 'Введение в модальные глаголы',
      content: `Модальные глаголы - это вспомогательные глаголы, которые выражают:
- Возможность (can, may)
- Необходимость (must, have to)
- Рекомендацию (should, ought to)
- Запрет (must not, cannot)

Они не изменяются по временам и не имеют формы -ing.`,
      type: 'theory'
    },
    {
      id: 2,
      title: 'Практика: can и cannot',
      content: `Посмотрите на примеры:

✅ I can swim. (Я умею плавать)
❌ I cannot fly. (Я не умею летать)
❓ Can you help me? (Ты можешь мне помочь?)

**Задание:** Напишите 3 предложения с can и 2 с cannot.`,
      type: 'practice'
    },
    {
      id: 3,
      title: 'Must и should',
      content: `Must выражает сильную необходимость:
- You must do your homework. (Ты должен сделать домашнее задание)

Should выражает рекомендацию:
- You should eat vegetables. (Тебе следует есть овощи)

**Разница:** Must = обязательно, should = желательно`,
      type: 'theory'
    },
    {
      id: 4,
      title: 'Практика: must, should, must not',
      content: `**Задание:** Заполните пропуски:

1. You ___ (must) wear a seatbelt in the car.
2. You ___ (should) drink more water.
3. Students ___ (must not) run in the corridor.

**Подсказка:** Задавайте вопросы, если что-то непонятно!`,
      type: 'practice'
    }
  ]
};
```

## Пример использования с хуком чата

```typescript
// src/hooks/useChat.ts (расширение существующего хука)

import { useState } from 'react';
import { LessonContextManager } from '@/utils/lessonContextManager';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [lessonContextManager] = useState(() => new LessonContextManager());
  const [isLessonMode, setIsLessonMode] = useState(false);

  const startLessonMode = (lessonData) => {
    lessonContextManager.startLesson(lessonData);
    setIsLessonMode(true);
  };

  const updateLessonBlock = (block, blockIndex, totalBlocks) => {
    lessonContextManager.updateCurrentBlock(block, blockIndex, totalBlocks);
  };

  const endLessonMode = () => {
    lessonContextManager.endLesson();
    setIsLessonMode(false);
  };

  const sendMessage = async (content: string) => {
    // Определяем какую функцию использовать
    const isLessonQuestion = isLessonMode && lessonContextManager.getCurrentContext();

    if (isLessonQuestion) {
      // Используем sendLessonQuestion из Chat.tsx
      await sendLessonQuestion(content);
    } else {
      // Используем обычный sendMessage из Chat.tsx
      await sendRegularMessage(content);
    }
  };

  return {
    messages,
    sendMessage,
    startLessonMode,
    updateLessonBlock,
    endLessonMode,
    isLessonMode,
    lessonContextManager
  };
};
```

## Пример взаимодействия

```
Ученик начинает урок → startLessonMode() вызывается
AI показывает: "Привет! Сегодня изучаем модальные глаголы"

Ученик видит первый блок теории
Ученик спрашивает: "Что значит модальный глагол?"

AI отвечает: "Отлично! В рамках нашего урока модальные глаголы - это..."

Ученик переходит к практике
AI показывает: "Теперь практика с can/cannot"

Ученик спрашивает: "А можно пример с едой?"
AI отвечает: "Конечно! I can eat pizza, but I cannot eat stones"

Ученик завершает урок
AI говорит: "Урок завершен! Можете задавать дополнительные вопросы"
```

## Ключевые моменты

1. **Всегда активируйте режим урока** перед началом
2. **Обновляйте контекст** при переходе между блоками
3. **Используйте контекстные плейсхолдеры** для подсказок
4. **Позволяйте вопросы в любое время** - это улучшает обучение
5. **Завершайте режим** когда урок окончен

---

**Этот пример можно адаптировать под любую структуру уроков!**

