# Voice Feature Module

Модуль голосового взаимодействия с ИИ-учителем. Позволяет ученикам общаться с учителем голосом, получать ответы и проходить структурированные уроки.

## Структура

```
features/voice/
├── api/
│   ├── speechRecognitionApi.ts   # Browser Speech Recognition API
│   └── voiceApi.ts               # LLM/TTS integration for voice
├── model/
│   ├── voiceModel.ts             # State management hooks
├── ui/
│   ├── VoiceTeacherChat.tsx      # Main voice chat component
│   ├── VoiceStatusIndicator.tsx  # Voice interaction status
│   ├── VoiceLessonProgress.tsx   # Lesson progress display
│   └── VoiceConversationHistory.tsx # Conversation history
├── index.ts                      # Public API
└── README.md                     # Documentation
```

## Использование

### Основной компонент

```typescript
import { VoiceTeacherChat } from '@/features/voice';

function LessonPage() {
  return (
    <VoiceTeacherChat
      lessonTitle="Математика"
      lessonTopic="Дроби"
      lessonAspects="Введение в дроби"
      onComplete={() => console.log('Lesson completed')}
      onClose={() => console.log('Chat closed')}
    />
  );
}
```

### Управление состоянием урока

```typescript
import { useVoiceLessonModel } from '@/features/voice';

function CustomVoiceComponent() {
  const lesson = useVoiceLessonModel({
    lessonTitle: "История",
    lessonTopic: "Древний Рим",
    lessonAspects: "Императорский период"
  });

  // Инициализация урока
  useEffect(() => {
    lesson.initializeLesson();
  }, []);

  return (
    <div>
      <h2>{lesson.lessonTitle}</h2>
      <p>Прогресс: {lesson.lessonProgress}%</p>
      <p>Текущая заметка: {lesson.lessonNotes[lesson.currentNoteIndex]}</p>
    </div>
  );
}
```

### Распознавание речи

```typescript
import { useSpeechRecognition, SpeechRecognitionAPI } from '@/features/voice';

function SpeechComponent() {
  const speech = useSpeechRecognition();

  // Проверка поддержки
  if (!SpeechRecognitionAPI.isSupported()) {
    return <p>Распознавание речи не поддерживается</p>;
  }

  return (
    <div>
      <button onClick={() => speech.startListening('ru-RU')}>
        {speech.isListening ? 'Остановить' : 'Начать слушать'}
      </button>
      <p>Распознанный текст: {speech.transcript}</p>
    </div>
  );
}
```

### API для голосовых команд

```typescript
import { generateVoiceLessonNotes, processVoiceCommand } from '@/features/voice';

// Генерация заметок урока
const notes = await generateVoiceLessonNotes(
  "Математика",
  "Алгебра",
  "Линейные уравнения",
  "ru-RU"
);

// Обработка голосовой команды
const result = await processVoiceCommand(
  "повтори последний материал",
  {
    title: "Математика",
    currentNoteIndex: 2,
    totalNotes: 5
  }
);
console.log(result.action); // "repeat"
console.log(result.response); // "Повторяю материал..."
```

## Компоненты

### VoiceTeacherChat
Основной компонент для голосового урока.
- **Props:**
  - `lessonTitle: string` - Название урока
  - `lessonTopic: string` - Тема урока
  - `lessonAspects: string` - Аспекты/описание
  - `onComplete: () => void` - Callback при завершении
  - `onClose: () => void` - Callback при закрытии

### VoiceStatusIndicator
Отображает статус голосового взаимодействия.
- **Props:**
  - `isListening: boolean` - Статус прослушивания
  - `isProcessing: boolean` - Статус обработки
  - `isSpeaking: boolean` - Статус озвучки
  - `transcript?: string` - Текущий транскрипт

### VoiceLessonProgress
Показывает прогресс урока и управление.
- **Props:**
  - `currentNoteIndex: number` - Текущая заметка
  - `totalNotes: number` - Всего заметок
  - `lessonProgress: number` - Прогресс в процентах
  - `callDuration: number` - Длительность звонка
  - `conversationHistory: ConversationEntry[]` - История разговора

### VoiceConversationHistory
История разговора между учеником и учителем.
- **Props:**
  - `conversationHistory: ConversationEntry[]` - Массив сообщений

## Хуки

### useVoiceLessonModel
Управление состоянием голосового урока.

```typescript
const lesson = useVoiceLessonModel(initialData);

console.log(lesson.lessonStarted);     // boolean
console.log(lesson.currentNoteIndex);  // number
console.log(lesson.lessonProgress);    // number (0-100)

lesson.initializeLesson();             // Начать урок
lesson.handleVoiceInput("вопрос");     // Обработать голосовой ввод
lesson.nextNote();                     // Следующая заметка
lesson.finishLesson();                 // Завершить урок
```

### useSpeechRecognition
Управление распознаванием речи браузера.

```typescript
const speech = useSpeechRecognition();

speech.startListening('ru-RU');        // Начать слушать
speech.stopListening();                // Остановить
console.log(speech.transcript);        // Текущий текст
console.log(speech.isListening);       // Статус
```

## API Reference

### Speech Recognition API

- `SpeechRecognitionAPI.isSupported()` - Проверка поддержки
- `SpeechRecognitionAPI.create()` - Создать экземпляр
- `SpeechRecognitionAPI.getSupportedLanguages()` - Поддерживаемые языки
- `SpeechRecognitionAPI.detectLanguageFromContent()` - Определение языка по контенту

### Voice API

- `generateVoiceLessonNotes()` - Генерация заметок урока
- `generateVoiceDynamicContent()` - Динамический контент на основе голоса
- `generateVoiceLessonSummary()` - Итоги урока
- `processVoiceCommand()` - Обработка голосовых команд

## Поддерживаемые языки

- `ru-RU` - Русский
- `en-US` - English (US)
- `en-GB` - English (UK)
- `es-ES` - Español
- `fr-FR` - Français
- `de-DE` - Deutsch
- `it-IT` - Italiano
- `pt-BR` - Português (BR)
- И многие другие...

## Особенности

- ✅ **Speech Recognition** - Распознавание речи в браузере
- ✅ **TTS Integration** - OpenAI TTS для озвучки
- ✅ **LLM Integration** - GPT-5.1 для генерации контента
- ✅ **Multi-language** - Поддержка множества языков
- ✅ **Real-time** - Обработка голоса в реальном времени
- ✅ **Structured Lessons** - Структурированные уроки с заметками
- ✅ **Conversation History** - История разговора
- ✅ **Progress Tracking** - Отслеживание прогресса обучения

## Примеры использования

### Простой голосовой урок

```typescript
import { VoiceTeacherChat } from '@/features/voice';

function SimpleLesson() {
  return (
    <VoiceTeacherChat
      lessonTitle="Английский язык"
      lessonTopic="Present Simple"
      lessonAspects="Правильные глаголы в Present Simple"
      onComplete={() => alert('Урок завершён!')}
      onClose={() => console.log('Урок закрыт')}
    />
  );
}
```

### Кастомный голосовой интерфейс

```typescript
import {
  useVoiceLessonModel,
  useSpeechRecognition,
  VoiceStatusIndicator,
  VoiceLessonProgress
} from '@/features/voice';

function CustomVoiceInterface() {
  const lesson = useVoiceLessonModel();
  const speech = useSpeechRecognition();

  return (
    <div className="space-y-4">
      <VoiceStatusIndicator
        isListening={speech.isListening}
        isProcessing={lesson.isProcessing}
        isSpeaking={lesson.isSpeaking}
        transcript={speech.transcript}
      />

      <VoiceLessonProgress
        currentNoteIndex={lesson.currentNoteIndex}
        totalNotes={lesson.lessonNotes.length}
        lessonProgress={lesson.lessonProgress}
        callDuration={lesson.callDuration}
        conversationHistory={lesson.conversationHistory}
      />

      <button onClick={() => speech.startListening('ru-RU')}>
        {speech.isListening ? 'Остановить' : 'Говорить'}
      </button>
    </div>
  );
}
```

## Технические детали

- **Speech Recognition**: Web Speech API (браузерный)
- **TTS**: OpenAI TTS-1 API
- **LLM**: GPT-5.1 через chat completions
- **State Management**: React hooks
- **UI**: Shadcn/ui + Tailwind CSS
- **TypeScript**: Полная типизация
- **Browser Support**: Modern browsers with Web Speech API

