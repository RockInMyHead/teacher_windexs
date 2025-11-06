# 🎤 Голосовое общение в чате

## Обзор

Система голосового общения в приложении позволяет пользователям взаимодействовать с AI-помощником голосом в режиме реального времени. Это включает как распознавание речи пользователя, так и синтез речи для ответов AI.

## 🏗️ Архитектура

### Основные компоненты

1. **Speech Recognition API** - для распознавания речи пользователя
2. **OpenAI TTS (Text-to-Speech)** - для озвучки ответов AI
3. **Web Audio API** - для управления аудио потоками
4. **React State Management** - для управления состоянием голосового чата

### Ключевые файлы

- `src/pages/Lesson.tsx` - основная реализация голосового чата
- `src/lib/openaiTTS.ts` - библиотека для работы с OpenAI TTS
- `src/contexts/AuthContext.tsx` - управление состоянием пользователя

## 🎯 Функциональность

### 1. Голосовой чат в уроке

#### Запуск голосового чата
```typescript
const startLessonVoiceChat = async () => {
  try {
    setIsVoiceChatActive(true);
    ttsContinueRef.current = true;

    // Останавливаем озвучку урока, если она активна
    if (isLessonPlaying) {
      OpenAITTS.stop();
      setIsLessonPlaying(false);
    }

    // Инициализируем Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Ваш браузер не поддерживает распознавание речи');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'ru-RU'; // Русский язык
```

#### Обработка результатов распознавания
```typescript
recognitionRef.current.onresult = async (event) => {
  let interimTranscript = '';
  let finalTranscript = '';

  for (let i = event.resultIndex; i < event.results.length; i++) {
    const transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      finalTranscript += transcript;
    } else {
      interimTranscript += transcript;
    }
  }

  if (finalTranscript.trim() && !isProcessing) {
    isProcessing = true;
    setIsListening(false);

    // Создаем сообщение пользователя
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: finalTranscript.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
```

### 2. Озвучка уроков

#### Функция озвучки контента
```typescript
const speakLesson = async () => {
  if (!currentLesson.theory || isLessonPlaying) return;

  try {
    setIsLessonPlaying(true);

    // Преобразуем markdown в читаемый текст
    const cleanText = currentLesson.theory
      .replace(/#{1,6}\s+/g, '') // Убираем заголовки markdown
      .replace(/\*\*(.*?)\*\*/g, '$1') // Убираем жирный текст
      .replace(/\*(.*?)\*/g, '$1') // Убираем курсив
      .replace(/```[\s\S]*?```/g, '') // Убираем кодовые блоки
      .replace(/`([^`]+)`/g, '$1') // Убираем инлайновый код
      .replace(/!\[.*?\]\(.*?\)/g, '') // Убираем изображения
      .replace(/\[.*?\]\(.*?\)/g, '') // Убираем ссылки
      .replace(/\n+/g, ' ') // Заменяем переносы строк на пробелы
      .replace(/\s+/g, ' ') // Убираем лишние пробелы
      .trim();

    if (cleanText.length > 50) {
      await OpenAITTS.speakText(cleanText, {
        voice: 'alloy', // alloy - хороший нейтральный голос для образовательного контента
        speed: 1.0
      });
    }
  } catch (error) {
    console.error('Ошибка озвучки урока:', error);
  } finally {
    setIsLessonPlaying(false);
  }
};
```

### 3. Управление состоянием

#### State переменные
```typescript
const [isVoiceChatActive, setIsVoiceChatActive] = useState(false);
const [isListening, setIsListening] = useState(false);
const [autoStartVoice, setAutoStartVoice] = useState(false);
const [isLessonPlaying, setIsLessonPlaying] = useState(false);
```

#### Refs для управления
```typescript
const recognitionRef = useRef<SpeechRecognition | null>(null);
const ttsContinueRef = useRef<boolean>(true);
```

## 🔧 Технические детали

### Speech Recognition API

#### Настройки распознавания
- `continuous: false` - однократное распознавание
- `interimResults: true` - промежуточные результаты
- `lang: 'ru-RU'` - русский язык

#### Обработчики событий
```typescript
recognitionRef.current.onstart = () => {
  setIsListening(true);
  console.log('🎤 Распознавание речи запущено в уроке');
};

recognitionRef.current.onresult = async (event) => {
  // Обработка результатов распознавания
};

recognitionRef.current.onerror = (event) => {
  console.error('Ошибка распознавания речи:', event.error);
  setIsListening(false);
  setIsVoiceChatActive(false);
};

recognitionRef.current.onend = () => {
  setIsListening(false);
  if (isVoiceChatActive) {
    // Автоматически перезапускаем, если голосовой чат активен
    setTimeout(() => {
      if (recognitionRef.current && isVoiceChatActive) {
        recognitionRef.current.start();
      }
    }, 100);
  }
};
```

### OpenAI TTS Integration

#### Использование
```typescript
await OpenAITTS.speakText(text, {
  voice: 'alloy',
  speed: 1.0
});
```

#### Остановка синтеза
```typescript
OpenAITTS.stop();
ttsContinueRef.current = false;
```

## 🎨 Пользовательский интерфейс

### Индикатор состояния голосового чата
```jsx
{isVoiceChatActive && (
  <div className="p-4 border-t border-border/50">
    <div className="flex items-center justify-center gap-4">
      {isListening ? (
        <div className="flex items-center gap-2 text-green-600">
          <Mic className="w-5 h-5 animate-pulse" />
          <span>Слушаю...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-muted-foreground">
          <MicOff className="w-5 h-5" />
          <span>Голосовой чат неактивен</span>
        </div>
      )}
      <Button
        onClick={stopVoiceChat}
        variant="outline"
        size="sm"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        Остановить
      </Button>
    </div>
  </div>
)}
```

### Кнопки управления
```jsx
<Button
  onClick={() => setShowChat(!showChat)}
  variant={showChat ? "default" : "outline"}
  size="sm"
>
  <MessageCircle className="w-4 h-4 mr-2" />
  Общение
</Button>

<Button
  onClick={isLessonPlaying ? stopLessonTTS : startLessonTTS}
  variant="outline"
  size="sm"
>
  {isLessonPlaying ? (
    <>
      <Volume2 className="w-4 h-4 mr-2" /> Остановить
    </>
  ) : (
    <>
      <Volume2 className="w-4 h-4 mr-2" /> Озвучить
    </>
  )}
</Button>
```

## 🔒 Безопасность и приватность

### Обработка данных
- Речевая информация обрабатывается локально в браузере
- Финальные транскрипции отправляются на сервер OpenAI для генерации ответов
- Временные данные очищаются при завершении сессии

### Permissions API
- Запрашивается разрешение на использование микрофона
- Проверка поддержки Speech Recognition API

## 🐛 Обработка ошибок

### Возможные ошибки
1. **Браузер не поддерживает Speech Recognition**
   ```javascript
   if (!SpeechRecognition) {
     alert('Ваш браузер не поддерживает распознавание речи');
     return;
   }
   ```

2. **Ошибка доступа к микрофону**
   - Обработка через `onerror` callback
   - Показ пользовательского сообщения

3. **Сетевая ошибка при TTS**
   - Graceful fallback на текстовый режим
   - Logging ошибок для отладки

## 📊 Метрики и аналитика

### Отслеживаемые события
- Время использования голосового чата
- Количество распознанных сообщений
- Качество распознавания речи
- Время отклика AI

### Achievement система
```typescript
// Track achievement progress for AI questions
updateAchievementProgress('chatty-student', 1);
updateAchievementProgress('ai-disciple', 1);
updateAchievementProgress('question-asker', 1);
```

## 🚀 Будущие улучшения

### Планируемые фичи
1. **Многоязычная поддержка** - распознавание других языков
2. **Голосовые команды** - управление приложением голосом
3. **Эмоциональный анализ** - определение настроения пользователя
4. **Адаптивные голоса** - персонализация голоса AI
5. **Оффлайн режим** - локальное распознавание речи

### Технические оптимизации
1. **WebRTC Integration** - улучшенное качество аудио
2. **Web Audio API** - продвинутые эффекты обработки
3. **Machine Learning** - улучшенное распознавание в шумных условиях
4. **Edge Computing** - обработка на устройстве пользователя

## 📚 API Reference

### Speech Recognition API
- `SpeechRecognition` - основной интерфейс
- `SpeechRecognitionEvent` - события распознавания
- `SpeechRecognitionResultList` - результаты распознавания

### OpenAI TTS API
- `speakText(text, options)` - озвучка текста
- `stop()` - остановка синтеза
- `isSpeaking()` - проверка состояния

### React Hooks
- `useState` - управление состоянием
- `useRef` - ссылки на DOM элементы и объекты
- `useEffect` - побочные эффекты

---

## 🎯 Заключение

Система голосового общения предоставляет интуитивный и естественный способ взаимодействия с AI-помощником. Реализация сочетает современные веб-технологии с мощью ИИ, обеспечивая высокое качество пользовательского опыта.

Ключевые преимущества:
- ✅ **Доступность** - работает в современных браузерах
- ✅ **Приватность** - локальная обработка речи
- ✅ **Надежность** - обработка ошибок и fallback'ы
- ✅ **Производительность** - оптимизированная архитектура
- ✅ **Расширяемость** - модульная структура для будущих улучшений

