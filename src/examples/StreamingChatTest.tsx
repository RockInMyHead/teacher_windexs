/**
 * StreamingChatTest - Test component for streaming chat functionality
 */

import React, { useRef } from 'react';
import { ChatContainer } from '@/components/Chat';

const MONACO_TEXT = `Монако — это маленькое, но очень интересное государство, расположенное на побережье Средиземного моря, между Францией и Италией. Давай разберем, что такое Монако, на несколько простых блоков.

## География и размер
- **Место**: Монако находится на юге Европы. Это карликовое государство, его площадь всего около 2,02 квадратных километра. Для сравнения, это меньше, чем многие крупные парки!
- **Окружение**: С одной стороны его омывает море, а с других — границы с Францией.

## Политическая система
- **Монархия**: Монако — это конституционная монархия, что означает, что здесь есть князь, который управляет страной. В данный момент это принц Альбер II.
- **Правительство**: Хотя князь имеет значительные полномочия, есть также совет министров и парламент.

## Экономика
- **Деньги**: Монако известно своим богатством. Здесь низкие налоги, что привлекает много состоятельных людей и бизнесов.
- **Туризм**: Монако популярно среди туристов благодаря своим казино, роскошным отелям и ярким событиям, таким как Гран-при Формулы-1.

## Культура и развлечения
- **Культура**: В Монако проводится много культурных мероприятий, включая оперные спектакли и художественные выставки. Здесь также много музеев.
- **Спорт**: Один из самых известных спортивных событий — Гран-при Монако по Формуле-1, который проходит по улицам города.

## Природа
- **Красивые виды**: В Монако много живописных мест, включая морские пейзажи и парки. Можно гулять по набережной и наслаждаться видами.

---

> Монако — это не только место для богатых и знаменитых, но и удивительная страна с богатой историей и культурой.

**Вопросы на размышление:**
- Что тебя больше всего интересует в Монако: его культура, экономика или что-то другое?
- Знаешь ли ты какие-то знаменитые события, которые проходят в Монако?

Если у тебя есть еще вопросы или ты хочешь узнать что-то конкретное, не стесняйся спрашивать!`;

export const StreamingChatTest = () => {
  const chatRef = useRef<any>(null);

  const testStreaming = () => {
    if (chatRef.current) {
      // Добавляем сообщение напрямую для тестирования
      chatRef.current.addMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: MONACO_TEXT,
        timestamp: new Date(),
      });
    }
  };

  const testStreamingWithDelay = () => {
    if (chatRef.current) {
      let index = 0;
      const text = MONACO_TEXT;
      const chunkSize = 10; // Размер чанка для имитации стриминга

      const streamInterval = setInterval(() => {
        if (index < text.length) {
          const chunk = text.slice(index, index + chunkSize);
          chatRef.current.addMessage({
            id: Date.now().toString(),
            role: 'assistant',
            content: text.slice(0, index + chunkSize),
            timestamp: new Date(),
          });
          index += chunkSize;
        } else {
          clearInterval(streamInterval);
        }
      }, 100); // Каждые 100ms добавляем новый чанк
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex gap-4 mb-4">
          <button
            onClick={testStreaming}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Тест полного сообщения
          </button>
          <button
            onClick={testStreamingWithDelay}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90"
          >
            Тест стриминга с задержкой
          </button>
        </div>

        <ChatContainer
          ref={chatRef}
          initialSystemPrompt="Ты полезный помощник, который дает подробные и интересные ответы."
        />
      </div>
    </div>
  );
};

export default StreamingChatTest;
