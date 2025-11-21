# Chat Feature Module

Модуль чата, организованный по принципам Feature-Sliced Design Architecture.

## Структура

```
features/chat/
├── api/          # API вызовы
│   ├── chatApi.ts       # Chat completion API
│   └── lessonApi.ts     # Lesson management API
├── model/        # Бизнес-логика и состояние
│   ├── chatModel.ts     # Управление состоянием чата
│   └── audioModel.ts    # Управление аудио/TTS
├── ui/           # UI компоненты
│   ├── MessageList.tsx       # Список сообщений
│   ├── MessageInput.tsx      # Поле ввода
│   ├── ChatHeader.tsx        # Заголовок чата
│   ├── LessonProgress.tsx    # Прогресс урока
│   └── LoadingIndicator.tsx  # Индикаторы загрузки
└── index.ts      # Public API модуля
```

## Использование

### API Layer

```typescript
import { sendChatCompletion, generateLessonPlan } from '@/features/chat';

// Отправить запрос к LLM
const response = await sendChatCompletion(
  [{ role: 'user', content: 'Привет!' }],
  { model: 'gpt-5.1', temperature: 0.7 }
);

// Сгенерировать план урока
const plan = await generateLessonPlan(
  'Математика',
  'Дроби',
  'Введение в дроби'
);
```

### Model Layer

```typescript
import { useChatModel, useLessonModel, useAudioModel } from '@/features/chat';

function ChatComponent() {
  const chat = useChatModel();
  const lesson = useLessonModel();
  const audio = useAudioModel();

  // Использовать состояние и методы
  chat.addMessage({ id: '1', role: 'user', content: 'Привет', timestamp: new Date() });
  lesson.nextStep();
  audio.playBeep(800, 200);
}
```

### UI Layer

```typescript
import { 
  MessageList, 
  MessageInput, 
  ChatHeader,
  LessonProgress 
} from '@/features/chat';

function Chat() {
  return (
    <div>
      <ChatHeader 
        title="Урок математики"
        isTtsEnabled={true}
        onToggleTTS={handleToggle}
      />
      <MessageList 
        messages={messages}
        speakingMessageId={speakingId}
        onSpeakMessage={handleSpeak}
      />
      <LessonProgress 
        currentStep={3}
        totalSteps={10}
        notes={['Изучили дроби', 'Решили задачи']}
      />
      <MessageInput 
        value={input}
        onChange={setInput}
        onSend={handleSend}
      />
    </div>
  );
}
```

## Преимущества

- ✅ **Модульность**: Каждый слой независим и тестируем
- ✅ **Переиспользуемость**: Компоненты и хуки можно использовать в разных местах
- ✅ **Читаемость**: Четкая структура и разделение ответственности
- ✅ **Масштабируемость**: Легко добавлять новые функции
- ✅ **Типобезопасность**: TypeScript типы для всех интерфейсов

## API Reference

### Chat API

- `sendChatCompletion(messages, options)` - Отправить запрос к LLM
- `generateLessonPlan(title, topic, aspects)` - Сгенерировать план урока
- `generateDynamicLessonContent(context, input, history)` - Динамический контент
- `processTextMessage(content, context)` - Обработать текстовое сообщение

### Lesson API

- `createLessonSession(data)` - Создать сессию урока
- `updateLessonProgress(sessionId, progress)` - Обновить прогресс
- `completeLessonSession(sessionId, finalData)` - Завершить сессию
- `getGeneratedLessons(limit)` - Получить список уроков
- `saveGeneratedLesson(data)` - Сохранить урок
- `updateGeneratedLesson(id, updates)` - Обновить урок
- `getGeneratedLesson(id)` - Получить урок по ID
- `deleteGeneratedLesson(id)` - Удалить урок

### Hooks

- `useChatModel()` - Управление состоянием чата
- `useLessonModel()` - Управление состоянием урока
- `useAudioModel()` - Управление аудио/TTS

### Utils

- `parseLessonContent(content)` - Парсинг контента урока
- `convertPlanToSteps(plan)` - Конвертация плана в шаги
- `splitIntoSentences(text)` - Разбить текст на предложения


