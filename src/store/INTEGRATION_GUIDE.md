# 🔗 INTEGRATION GUIDE - Использование PHASE 3 Stores

## Быстрый старт

### 1. Импортировать Store Hook

```typescript
import { useAppStore } from '@/store';
```

### 2. Использовать в Компоненте

```typescript
export const ChatContainer = () => {
  // Получить все stores
  const { chat, voice, tts, files, assessment, ui } = useAppStore();

  return (
    <div>
      <p>Messages: {chat.messages.length}</p>
      <p>Listening: {voice.isListening}</p>
    </div>
  );
};
```

---

## Детальные примеры

### ChatStore - Управление сообщениями

```typescript
const { chat } = useAppStore();

// Чтение
const messages = chat.messages;
const lastMessage = chat.getLastMessage();
const context = chat.getContext(10);
const tokenCount = chat.getTotalTokens();

// Запись
chat.addMessage({
  id: 'msg-1',
  role: 'user',
  content: 'Hello',
  timestamp: new Date(),
});

chat.updateMessage('msg-1', { content: 'Updated' });
chat.removeMessage('msg-1');
chat.clearMessages();

// Ошибки
chat.setError(new Error('Failed'));
chat.setIsLoading(true);

// Система
chat.setSystemPrompt('You are a teacher...');
```

---

### VoiceStore - Управление голосом

```typescript
const { voice } = useAppStore();

// Чтение
const isListening = voice.isListening;
const transcript = voice.finalTranscript;
const fullTranscript = voice.getFullTranscript();
const language = voice.language;

// Запись
voice.setIsListening(true);
voice.setInterimTranscript('interim text...');
voice.setFinalTranscript('final text');
voice.addTranscript('more text');
voice.clearTranscripts();
voice.setLanguage('en-US');

// Состояние
voice.setVoiceChatActive(true);
voice.setIsSpeaking(true);
voice.setError(null);
```

---

### TTSStore - Text-to-Speech

```typescript
const { tts } = useAppStore();

// Чтение
const isEnabled = tts.isEnabled;
const progress = tts.getProgress(); // 0-100
const isComplete = tts.isComplete();
const currentSentence = tts.currentSentence;
const totalSentences = tts.totalSentences;

// Запись
tts.setIsEnabled(true);
tts.setTotalSentences(5);
tts.setCurrentSentence(1);
tts.incrementSentence();
tts.resetProgress();

// Конфиг
tts.setModel('tts-1');
tts.setVoice('nova');

// Состояние
tts.setIsSpeaking(true);
tts.setError(null);
```

---

### FileStore - Управление файлами

```typescript
const { files } = useAppStore();

// Чтение
const uploadedCount = files.getFileCount();
const combinedText = files.getCombinedText();
const uploadedFiles = files.uploadedFiles;
const processedFiles = files.processedFiles;

// Запись
files.addFiles([file1, file2]);
files.removeFile(0);
files.clearFiles();

// Обработка
files.setIsProcessing(true);
files.setProcessedFiles([
  { name: 'doc.pdf', content: '...', type: 'pdf' },
  { name: 'img.png', content: '...', type: 'image' },
]);
files.addProcessedFile({ name: 'new.txt', content: '...', type: 'text' });

// Ошибки
files.setError(null);
```

---

### AssessmentStore - Управление тестированием

```typescript
const { assessment } = useAppStore();

// Чтение
const isActive = assessment.isActive;
const state = assessment.state; // 'collecting_grade' | 'in_progress'...
const currentQuestion = assessment.currentQuestion;
const result = assessment.result;

// Проверки
const isCollecting = assessment.isCollectingGrade();
const isInProgress = assessment.isInProgress();
const isCompleted = assessment.isCompleted();

// Запись
assessment.startAssessment();
assessment.endAssessment();
assessment.setClassGrade('10');
assessment.setLastTopic('Math');
assessment.setState('in_progress');
assessment.setCurrentQuestion(question);
assessment.setResult(result);
assessment.reset();

// Количество
assessment.setQuestionCount(5);
assessment.incrementQuestionCount();
```

---

### UIStore - UI состояние

```typescript
const { ui } = useAppStore();

// Чтение
const isDark = ui.isDarkMode();
const cameraActive = ui.isCameraActive;
const theme = ui.selectedTheme;
const sidebarOpen = ui.sidebarOpen;
const tooltipsEnabled = ui.tooltipsEnabled;

// Запись
ui.setTheme('dark');
ui.setCameraActive(true);
ui.setAudioTaskActive(false);
ui.setTestQuestionActive(true);
ui.setShowSphere(true);
ui.toggleSidebar();
ui.setSidebarOpen(true);
ui.setTooltipsEnabled(false);

// Ошибки
ui.setError(null);
```

---

## Реальный пример: ChatMessages компонент

### До (использование hooks)

```typescript
import { useChat, useTextToSpeech } from '@/hooks';

export const ChatMessages = () => {
  const { messages } = useChat();
  const { isTtsEnabled, speakingMessageId, currentSentence, totalSentences } = useTextToSpeech();

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id} className="message">
          {msg.content}
        </div>
      ))}
    </div>
  );
};
```

### После (использование store)

```typescript
import { useAppStore } from '@/store';

export const ChatMessages = () => {
  const { chat, tts } = useAppStore();

  return (
    <div>
      {chat.messages.map(msg => (
        <div key={msg.id} className="message">
          <p>{msg.content}</p>
          {tts.isSpeaking && msg.id === tts.currentSentence && (
            <p>Speaking: {tts.getProgress()}%</p>
          )}
        </div>
      ))}
    </div>
  );
};
```

### Преимущества:
✅ Меньше параметров в props  
✅ Все состояние в одном месте  
✅ Проще комбинировать логику  
✅ Масштабируется на сотни компонентов  

---

## Обновление ChatContainer

### Текущая версия (PHASE 2)

```typescript
export const ChatContainer: React.FC<ChatContainerProps> = ({
  initialSystemPrompt,
  maxMessages,
}) => {
  const { messages, inputMessage, isLoading, uploadedFiles } = useChat(initialSystemPrompt, maxMessages);
  const { isTtsEnabled, speakingMessageId, currentSentence, totalSentences } = useTextToSpeech();
  const { isListening, interimTranscript, finalTranscript } = useVoiceRecognition();
  const { uploadedFiles, isProcessingFile } = useFileProcessing();

  // ... логика компонента
};
```

### Новая версия (PHASE 3)

```typescript
export const ChatContainer: React.FC<ChatContainerProps> = ({
  initialSystemPrompt,
  maxMessages,
}) => {
  const { chat, voice, tts, files, assessment, ui } = useAppStore();

  // Инициализировать при монтировании
  useEffect(() => {
    chat.setSystemPrompt(initialSystemPrompt);
    return () => chat.clearMessages();
  }, []);

  // Использовать напрямую
  return (
    <div>
      <ChatMessages />
      <VoiceControls />
      <FileUpload />
      {/* ... */}
    </div>
  );
};
```

---

## Middleware Usage

### Сохранение состояния

```typescript
import { persistChatState, persistAssessmentState } from '@/store';

export const ChatContainer = () => {
  const { chat, assessment } = useAppStore();

  // Сохранять при изменении
  useEffect(() => {
    persistChatState(chat);
  }, [chat.messages, chat.systemPrompt]);

  useEffect(() => {
    persistAssessmentState(assessment);
  }, [assessment.state, assessment.classGrade]);
};
```

### Восстановление состояния

```typescript
import { restoreChatState, restoreAssessmentState } from '@/store';

export const App = () => {
  useEffect(() => {
    // При запуске приложения
    const chatState = restoreChatState();
    if (chatState) {
      // Применить восстановленное состояние
      Object.entries(chatState).forEach(([key, value]) => {
        // ...
      });
    }
  }, []);
};
```

### Экспортировать для debugging

```typescript
import { exportStoreState } from '@/store';

export const DebugPanel = () => {
  const allStores = useAppStore();

  const downloadDebugInfo = () => {
    const json = exportStoreState(allStores);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'debug-state.json';
    a.click();
  };

  return <button onClick={downloadDebugInfo}>Download Debug Info</button>;
};
```

---

## Лучшие практики

### ✅ DO

```typescript
// Используй правильный store
const { chat } = useAppStore();

// Комбинируй действия логично
const handleMessage = (text: string) => {
  chat.addMessage({ /* ... */ });
  voice.clearTranscripts();
};

// Используй computed методы
const progress = tts.getProgress();
const isDark = ui.isDarkMode();
```

### ❌ DON'T

```typescript
// Не используй весь store если нужен один
const store = useAppStore();  // ❌
const { messages } = store.chat;

// Используй вместо этого
const { chat } = useAppStore();  // ✅
const { messages } = chat;

// Не игнорируй ошибки
chat.addMessage(msg);  // ❌ Может быть ошибка

// Используй try-catch если нужно
try {
  chat.addMessage(msg);  // ✅
} catch (err) {
  console.error(err);
}
```

---

## TypeScript типизация

### Правильная типизация

```typescript
import type { ChatStore, VoiceStore, UIStore } from '@/store';

interface ComponentProps {
  onMessageAdd: (message: ChatStore['messages'][0]) => void;
  isDarkMode: UIStore['isDarkMode'];
}

export const Component: React.FC<ComponentProps> = ({ onMessageAdd }) => {
  const { chat } = useAppStore();
  // ...
};
```

---

## Тестирование

### Unit тест

```typescript
import { chatStore } from '@/store';

describe('ChatStore', () => {
  beforeEach(() => {
    chatStore.clearMessages();
  });

  it('should add message', () => {
    const msg = { id: '1', role: 'user', content: 'test', timestamp: new Date() };
    chatStore.addMessage(msg);
    expect(chatStore.getState().messages).toHaveLength(1);
  });

  it('should get context', () => {
    // ... добавить сообщения ...
    const context = chatStore.getContext(5);
    expect(context).toBeDefined();
  });
});
```

### Component тест

```typescript
import { renderHook, act } from '@testing-library/react';
import { useChatStore } from '@/store';

describe('useChatStore hook', () => {
  it('should update when message is added', () => {
    const { result } = renderHook(() => useChatStore());

    act(() => {
      result.current.addMessage({
        id: '1',
        role: 'user',
        content: 'test',
        timestamp: new Date(),
      });
    });

    expect(result.current.messages).toHaveLength(1);
  });
});
```

---

## FAQ

### Q: Когда использовать отдельный store vs useAppStore?

**A:** Используй useAppStore когда тебе нужно несколько stores, и отдельные hooks когда нужен только один:

```typescript
// Один store
const { messages } = useChatStore();

// Несколько stores
const { chat, voice, tts } = useAppStore();
```

### Q: Как обновить store вне компонента?

**A:** Используй singleton:

```typescript
import { chatStore } from '@/store';

// Прямой доступ
chatStore.getState().addMessage(msg);
```

### Q: Как отладить store?

**A:** Используй middleware:

```typescript
import { exportStoreState } from '@/store';

const allStores = {
  chat: chatStore.getState(),
  voice: voiceStore.getState(),
  // ...
};

console.log(exportStoreState(allStores));
```

### Q: Готово ли к production?

**A:** ✅ ДА! Zustand-like реализация полностью production-ready.  
Можешь мигрировать на Zustand позже без изменения кода компонентов.

---

**Готово к использованию! 🚀**

