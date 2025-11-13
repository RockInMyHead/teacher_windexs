# ⚡ ФАЗА 1: Быстрый старт

Как начать использовать новую архитектуру в 5 минут?

---

## 1️⃣ Использование Types

```typescript
import type { Message, ChatState, AppError } from '@/types';

// Используйте везде вместо any
const messages: Message[] = [];
const error: AppError | null = null;
```

---

## 2️⃣ Использование Hooks

### Chat
```typescript
import { useChat } from '@/hooks';
import { getSystemPrompt } from '@/utils/prompts';

const { messages, sendMessage, error } = useChat();

// Отправить сообщение
await sendMessage('Hello AI', getSystemPrompt('DEFAULT_TEACHER'));
```

### Text-to-Speech
```typescript
import { useTextToSpeech } from '@/hooks';

const { speak, stop, isSpeaking } = useTextToSpeech();

// Произнести текст
await speak('Hello world');
```

### Voice Recognition
```typescript
import { useVoiceRecognition } from '@/hooks';

const { isListening, finalTranscript, startListening } = useVoiceRecognition();

// Начать слушать
startListening();

// Получить транскрипт
console.log(finalTranscript);
```

### File Processing
```typescript
import { useFileProcessing } from '@/hooks';

const { processedFiles, processSingleFile, getCombinedText } = useFileProcessing();

// Обработать файл
const result = await processSingleFile(file);

// Получить текст
const allTexts = getCombinedText();
```

---

## 3️⃣ Использование Утилит

### Speech Recognition
```typescript
import { 
  isSpeechRecognitionAvailable, 
  initializeSpeechRecognition 
} from '@/utils/speechRecognition';

if (isSpeechRecognitionAvailable()) {
  const recognition = initializeSpeechRecognition();
  recognition?.start();
}
```

### Audio Processing
```typescript
import { 
  initializeAudioContext, 
  playBeep 
} from '@/utils/audioProcessing';

// Воспроизвести звук
await playBeep(800, 200); // frequency, duration
```

### File Processing
```typescript
import { 
  processFile, 
  extractTextFromPDF 
} from '@/utils/fileProcessing';

// Обработать файл
const result = await processFile(file);

// Или извлечь текст из PDF
const text = await extractTextFromPDF(pdfFile);
```

### Logging
```typescript
import { logger } from '@/utils/logger';

logger.debug('Debug message', { data: 'value' });
logger.error('Error occurred', error);

// Скачать все логи
logger.downloadLogs();
```

### Constants
```typescript
import { 
  TIMEOUT_DURATIONS,
  ERROR_MESSAGES,
  CEFR_LEVELS,
  getErrorMessage
} from '@/utils/constants';

const timeout = TIMEOUT_DURATIONS.API_CALL;
const errorMsg = getErrorMessage('NETWORK_ERROR');
```

### Prompts
```typescript
import { getSystemPrompt } from '@/utils/prompts';

const prompt = getSystemPrompt('DEFAULT_TEACHER');
const voicePrompt = getSystemPrompt('VOICE_CHAT');
```

---

## 4️⃣ Использование API Services

### Chat Service
```typescript
import { chatService } from '@/services/api';

const response = await chatService.sendMessage({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: 'You are helpful' },
    { role: 'user', content: 'Hello' }
  ],
  max_tokens: 2000,
  temperature: 0.7,
});

console.log(response.choices[0].message.content);
```

### Error Handling
```typescript
import { 
  handleApiError,
  getUserFriendlyErrorMessage,
  retryWithBackoff
} from '@/services/api/errorHandler';

try {
  await chatService.sendMessage(request);
} catch (error) {
  const appError = handleApiError(error);
  const message = getUserFriendlyErrorMessage(appError);
  console.error(message);
}

// Retry with backoff
await retryWithBackoff(() => chatService.sendMessage(request), 3);
```

---

## 📋 Примеры компонентов

### Простой чат компонент
```typescript
import React from 'react';
import { useChat } from '@/hooks';
import { getSystemPrompt } from '@/utils/prompts';

export const SimpleChatComponent = () => {
  const { messages, sendMessage, isLoading, error } = useChat();
  const [input, setInput] = React.useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    
    await sendMessage(input, getSystemPrompt('DEFAULT_TEACHER'));
    setInput('');
  };

  return (
    <div>
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>

      {error && <div className="error">{error.message}</div>}

      <input 
        value={input} 
        onChange={e => setInput(e.target.value)}
        placeholder="Type message..." 
      />
      <button onClick={handleSend} disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
};
```

### Чат с голосом
```typescript
import { useChat, useVoiceRecognition, useTextToSpeech } from '@/hooks';
import { getSystemPrompt } from '@/utils/prompts';

export const VoiceChatComponent = () => {
  const { messages, sendMessage } = useChat();
  const { isListening, finalTranscript, startListening, stopListening } = useVoiceRecognition();
  const { speak, isSpeaking } = useTextToSpeech();

  const handleVoiceMessage = async () => {
    startListening();
    
    // After user speaks:
    await sendMessage(finalTranscript, getSystemPrompt('VOICE_CHAT'));
    
    // Auto-speak response
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === 'assistant') {
      await speak(lastMsg.content);
    }
  };

  return (
    <div>
      <button onClick={handleVoiceMessage} disabled={isListening || isSpeaking}>
        🎤 {isListening ? 'Listening...' : 'Speak'}
      </button>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  );
};
```

### Загрузка файлов
```typescript
import { useFileProcessing, useChat } from '@/hooks';

export const FileUploadComponent = () => {
  const { processedFiles, processSingleFile, error } = useFileProcessing();
  const { sendMessage } = useChat();

  const handleFile = async (file: File) => {
    const result = await processSingleFile(file);
    
    if (result.success && result.file) {
      // Use extracted text
      await sendMessage(
        `Please analyze: ${result.file.extractedText.substring(0, 500)}...`
      );
    }
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={e => handleFile(e.target.files?.[0]!)}
      />
      <p>Processed files: {processedFiles.length}</p>
      {error && <p>{error.message}</p>}
    </div>
  );
};
```

---

## 🎯 Типичный workflow

### Старый способ (было):
```typescript
// 1. Кучу состояний
const [messages, setMessages] = useState<any[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [isListening, setIsListening] = useState(false);
// ... и еще 10 состояний

// 2. Много кода для инициализации
useEffect(() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognitionRef.current = new SpeechRecognition();
  // ... 50+ строк setup кода
}, []);

// 3. Ручное управление API
const sendMessage = async () => {
  setIsLoading(true);
  try {
    const response = await fetch(`${window.location.origin}/api/chat/completions`, {
      method: 'POST',
      body: JSON.stringify({...})
    });
    // ... обработка ошибок
  } finally {
    setIsLoading(false);
  }
};
```

### Новый способ (сейчас):
```typescript
// 1. Одна строка вместо 15+
const { messages, isLoading, sendMessage } = useChat();
const { isListening, startListening } = useVoiceRecognition();

// 2. Сразу готово к использованию
// Нет необходимости в useEffect для инициализации

// 3. Типизированный API
await sendMessage(content, getSystemPrompt('DEFAULT_TEACHER'));
```

**Экономия: 20 строк → 2 строки!** 🎉

---

## 🚀 Начните прямо сейчас

### Шаг 1: Импортируйте Hook
```typescript
import { useChat } from '@/hooks';
```

### Шаг 2: Используйте в компоненте
```typescript
const { messages, sendMessage } = useChat();
```

### Шаг 3: Отправьте сообщение
```typescript
await sendMessage('Hello', getSystemPrompt('DEFAULT_TEACHER'));
```

**Готово!** 🎊

---

## 📚 Больше информации

- [PHASE_1_COMPLETE.md](./PHASE_1_COMPLETE.md) - Полная документация
- [PHASE_1_SUMMARY.md](./PHASE_1_SUMMARY.md) - Краткое резюме
- [REFACTORING_PLAN.md](./REFACTORING_PLAN.md) - Полный план всех фаз

---

**Статус:** ✅ Ready to use  
**Все типы:** ✅ Полная типизация  
**ESLint:** ✅ Passed  

**Начните использовать новую архитектуру сегодня!** 🚀

