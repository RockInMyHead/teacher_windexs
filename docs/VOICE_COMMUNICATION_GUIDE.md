# Руководство по голосовому общению в интерактивных уроках

## Обзор

Система голосового общения позволяет:
- **TTS (Text-to-Speech)**: Преподаватель озвучивает материал урока и ответы
- **STT (Speech-to-Text)**: Система слушает и распознаёт речь ученика
- **Интерактивное взаимодействие**: Ученик может говорить вместо того, чтобы писать

## Архитектура

### Модули системы

#### 1. `voiceComm.ts` - Основной модуль
Расширенный модуль для управления голосовым общением.

**Основные компоненты:**
- `VoiceComm` - главный класс для управления TTS и STT
- `VoiceUtils` - вспомогательные функции для проверки поддержки

**Ключевые методы:**

```typescript
// Инициализация
VoiceComm.init(options, callbacks) -> boolean

// Управление слушанием (STT)
VoiceComm.startListening() -> boolean
VoiceComm.stopListening() -> void
VoiceComm.abortListening() -> void

// Управление воспроизведением (TTS)
VoiceComm.speakText(text, options) -> Promise<void>
VoiceComm.stopSpeaking() -> void

// Состояние
VoiceComm.getStatus() -> {...}
VoiceComm.isAvailable() -> boolean
VoiceComm.reset() -> void
VoiceComm.cleanup() -> void
```

#### 2. `openaiTTS.ts` - OpenAI TTS интеграция
Обеспечивает синтез речи через OpenAI API.

**Параметры:**
- `voice`: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
- `speed`: число от 0.25 до 4.0 (по умолчанию 1.0)
- `model`: 'tts-1' | 'tts-1-hd' (по умолчанию 'tts-1')

#### 3. `InteractiveLessonChat.tsx` - Компонент урока
Компонент содержит UI для голосового взаимодействия.

## Использование

### Инициализация в компоненте

```typescript
import { VoiceComm, VoiceUtils } from '@/lib/voiceComm';

useEffect(() => {
  // Инициализируем VoiceComm
  VoiceComm.init(
    {
      language: 'ru-RU',
      ttsVoice: 'nova',
      ttsSpeed: 1.0,
      continuous: false
    },
    {
      onListeningStart: () => console.log('Началась запись'),
      onListeningEnd: () => console.log('Запись остановлена'),
      onTranscript: (text, isFinal) => {
        if (isFinal) console.log('Финальный текст:', text);
      },
      onError: (error) => console.error('Ошибка:', error),
      onPlayStart: () => console.log('TTS начато'),
      onPlayEnd: () => console.log('TTS завершено')
    }
  );

  return () => VoiceComm.cleanup();
}, []);
```

### Запуск слушания пользователя

```typescript
// Начать запись
VoiceComm.startListening();

// Остановить запись
VoiceComm.stopListening();

// Отменить запись
VoiceComm.abortListening();
```

### Озвучивание текста

```typescript
// Озвучить текст с параметрами
await VoiceComm.speakText(text, {
  language: 'ru-RU',
  ttsVoice: 'nova',
  ttsSpeed: 1.0
});

// Остановить озвучивание
VoiceComm.stopSpeaking();
```

### Проверка поддержки

```typescript
// Проверить поддержку браузером
const support = VoiceUtils.checkBrowserSupport();
console.log(support);
// { speechRecognition: true, audioAPI: true, mediaDevices: true }

// Проверить разрешение микрофона
const hasPermission = await VoiceUtils.checkMicrophonePermission();

// Получить поддерживаемые языки
const languages = VoiceUtils.getSupportedLanguages();
```

## UI компонента

### Кнопка микрофона
Позволяет ученику начать/остановить запись голоса.

- Нажата красного цвета (destructive) когда идёт запись
- Обычной кнопки когда запись не идёт
- Показывает интеримный текст при распознавании

### Визуальные индикаторы

**Во время слушания:**
```
┌─ Слушаю вас... ✨
│ [интеримный текст здесь]
└─
```

**Во время воспроизведения:**
- Кнопка Volume2 становится активной (primary цвет)
- Ученик видит анимацию воспроизведения

## Поддерживаемые языки

- Russian (ru-RU) - по умолчанию
- English US (en-US)
- English GB (en-GB)
- Spanish (es-ES)
- French (fr-FR)
- German (de-DE)
- Chinese Simplified (zh-CN)
- Japanese (ja-JP)
- Korean (ko-KR)

## Голоса TTS

| Голос | Особенности | Рекомендация |
|-------|-----------|-------------|
| nova | Женский, естественный | ✅ Для русского (по умолчанию) |
| shimmer | Женский, бодрый | Для динамичных уроков |
| alloy | Мужской, нейтральный | Для технических уроков |
| echo | Мужской, глубокий | Для важной информации |
| fable | Мужской, дружелюбный | Для детских уроков |
| onyx | Мужской, убедительный | Для мотивирующих уроков |

## Обработка ошибок

### Ошибки микрофона

| Код | Сообщение | Решение |
|-----|-----------|---------|
| no-speech | Не слышу речь | Говорить громче, проверить микрофон |
| audio-capture | Микрофон недоступен | Проверить разрешения браузера |
| network | Ошибка сети | Проверить интернет соединение |
| service-not-allowed | Сервис недоступен | Обновить браузер, проверить конфиг |

### Ошибки TTS

| Сценарий | Решение |
|----------|---------|
| Нет ключа API | Проверить VITE_OPENAI_API_KEY |
| Пустой текст | Передать непустой текст |
| Сетевая ошибка | Проверить интернет, переподключиться |

## Оптимизация производительности

### Разделение на предложения
Текст автоматически разбивается на предложения и озвучивается последовательно с паузой в 300ms между ними.

### Кэширование
- Речевой поток не кэшируется (OpenAI генерирует новый)
- Переведённые числа в слова кэшируются в памяти

### Параллелизм
- Одновременно может работать только одна операция TTS
- STT блокирует ввод текста во время записи

## Интеграция с API

### Эндпоинт TTS
```
POST /api/audio/speech
Content-Type: application/json

{
  "model": "tts-1",
  "input": "Текст для озвучивания",
  "voice": "nova",
  "response_format": "mp3",
  "speed": 1.0
}
```

## Примеры кода

### Пример 1: Простое озвучивание

```typescript
const handleSpeak = async () => {
  try {
    await VoiceComm.speakText('Привет, это голосовое сообщение!');
  } catch (error) {
    console.error('Ошибка при озвучивании:', error);
  }
};
```

### Пример 2: Запись с обработкой

```typescript
const handleStartRecording = () => {
  VoiceComm.startListening();
};

const handleStopRecording = () => {
  VoiceComm.stopListening();
};

// В коллбэке onTranscript:
onTranscript: (text, isFinal) => {
  if (isFinal) {
    console.log('Ученик сказал:', text);
    // Отправить на обработку к AI
    sendUserMessage(text);
  }
}
```

### Пример 3: Контроль параллельного выполнения

```typescript
const speak = async (text) => {
  // Проверяем, не идёт ли уже озвучивание
  const status = VoiceComm.getStatus();
  if (status.isPlaying) {
    VoiceComm.stopSpeaking();
  }

  // Проверяем, не идёт ли запись
  if (status.isListening) {
    VoiceComm.stopListening();
  }

  // Теперь безопасно озвучиваем
  await VoiceComm.speakText(text);
};
```

## Тестирование

### Ручное тестирование

1. **STT тест:**
   - Нажать кнопку микрофона
   - Произнести текст на русском
   - Проверить, что текст распознан в поле ввода

2. **TTS тест:**
   - Нажать кнопку громкости
   - Проверить, что система озвучивает последнее сообщение
   - Ожидать паузы между предложениями

3. **Совместный тест:**
   - Получить ответ от ассистента
   - Нажать громкость для озвучивания
   - Во время озвучивания попытаться нажать микрофон (должен быть заблокирован)

### Автоматизированное тестирование

```typescript
describe('VoiceComm', () => {
  it('should initialize voice communication', () => {
    const available = VoiceComm.init();
    expect(available).toBeTruthy();
  });

  it('should get status', () => {
    const status = VoiceComm.getStatus();
    expect(status).toHaveProperty('isListening');
    expect(status).toHaveProperty('isPlaying');
  });

  it('should cleanup properly', () => {
    VoiceComm.cleanup();
    const status = VoiceComm.getStatus();
    expect(status.isListening).toBeFalsy();
    expect(status.isPlaying).toBeFalsy();
  });
});
```

## Поддержка браузеров

| Браузер | STT | TTS | Версия |
|---------|-----|-----|--------|
| Chrome | ✅ | ✅ | 71+ |
| Firefox | ✅ | ✅ | 95+ |
| Safari | ✅ | ✅ | 14.1+ |
| Edge | ✅ | ✅ | 79+ |

## Требования

### Переменные окружения
```env
VITE_OPENAI_API_KEY=sk-...
```

### Разрешения браузера
- `microphone` - для STT (Speech-to-Text)
- Интернет соединение для TTS (OpenAI API)

## Лучшие практики

1. **Всегда очищайте ресурсы**
   ```typescript
   useEffect(() => {
     VoiceComm.init(...);
     return () => VoiceComm.cleanup();
   }, []);
   ```

2. **Проверяйте поддержку перед использованием**
   ```typescript
   if (VoiceComm.isAvailable()) {
     VoiceComm.startListening();
   }
   ```

3. **Обрабатывайте ошибки**
   ```typescript
   onError: (error) => {
     console.error('Ошибка голоса:', error);
     showNotification(error);
   }
   ```

4. **Блокируйте UI при активности**
   ```typescript
   const disabled = isListening || isPlaying;
   <Input disabled={disabled} />
   ```

5. **Показывайте интеримные результаты**
   ```typescript
   onTranscript: (text, isFinal) => {
     if (!isFinal) {
       setPlaceholder(`Слышу: "${text}..."`);
     }
   }
   ```

## Видео демонстрация

[Ссылка на видео будет добавлена]

## Поддержка

При возникновении проблем:
1. Проверьте консоль браузера (F12)
2. Убедитесь в наличии разрешения на микрофон
3. Проверьте ключ OpenAI API
4. Проверьте стабильность интернета
5. Обновите браузер до последней версии

