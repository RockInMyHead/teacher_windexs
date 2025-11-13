# 🔄 План Рефакторинга Проекта Teacher App

**Статус:** Актуален для версии v1.0 (Single-Port)  
**Дата:** Ноябрь 2024  
**Приоритет:** Medium-High для Production  

---

## 📊 Оценка Проекта

### ✅ Что хорошо
- **Architecture**: Single-Port setup работает корректно
- **Documentation**: Обширная документация
- **Features**: Полный функционал (AI, TTS, Voice, Assessments)
- **Testing**: Vitest + Playwright интеграция
- **DevOps**: Nginx, Docker, CI/CD скрипты готовы

### ⚠️ Что нужно улучшить
- **Code Organization**: Монолитные компоненты (Chat.tsx: 2328 строк, Lesson.tsx: 2700+ строк)
- **Type Safety**: Много `any` типов, неполные интерфейсы
- **State Management**: Разреженное состояние, сложные зависимости
- **Testing**: Недостаточное покрытие, отсутствуют unit тесты для логики
- **Error Handling**: Непоследовательная обработка ошибок
- **Performance**: Отсутствует мемоизация, возможны лишние ре-рендеры

---

## 🎯 Фазы Рефакторинга

### ФАЗА 1: АРХИТЕКТУРА И СТРУКТУРА (1-2 недели)
**Цель**: Разделить монолитные компоненты, создать чистую архитектуру

#### 1.1 Выделение типов и интерфейсов
```typescript
// src/types/index.ts
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  ttsPlayed?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  uploadedFiles: File[];
}

export interface VoiceState {
  isVoiceChatActive: boolean;
  isListening: boolean;
  isTtsEnabled: boolean;
}

// Экспортируем все типы из одного места
// Это упрощает импорты и повышает maintainability
```

**Файлы для создания:**
- `src/types/index.ts` - все интерфейсы
- `src/types/api.ts` - типы API ответов
- `src/types/models.ts` - модели данных
- `src/types/assessment.ts` - типы оценок
- `src/types/voice.ts` - типы голосовых функций

#### 1.2 Выделение утилит и хуков
**Создать custom hooks:**

```typescript
// src/hooks/useChat.ts
interface UseChatOptions {
  onMessage?: (msg: Message) => void;
  apiEndpoint?: string;
}

export const useChat = (options?: UseChatOptions) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const sendMessage = async (content: string) => {
    // Logic здесь
  };
  
  return { messages, isLoading, sendMessage };
};

// src/hooks/useVoiceChat.ts
export const useVoiceChat = () => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const startListening = () => { /* ... */ };
  const stopListening = () => { /* ... */ };
  
  return { isListening, startListening, stopListening };
};

// src/hooks/useTextToSpeech.ts
export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const speak = async (text: string) => { /* ... */ };
  const stop = () => { /* ... */ };
  
  return { isSpeaking, speak, stop };
};

// src/hooks/useVoiceRecognition.ts
export const useVoiceRecognition = () => {
  // Инкапсулируем вся логика Speech Recognition
};

// src/hooks/useFileProcessing.ts
export const useFileProcessing = () => {
  // Обработка файлов (PDF, изображения)
};

// src/hooks/useAssessment.ts
export const useAssessment = () => {
  // Логика адаптивных тестов
};
```

**Файлы для создания:**
- `src/hooks/useChat.ts`
- `src/hooks/useVoiceChat.ts`
- `src/hooks/useTextToSpeech.ts`
- `src/hooks/useVoiceRecognition.ts`
- `src/hooks/useFileProcessing.ts`
- `src/hooks/useAssessment.ts`
- `src/hooks/useApiKey.ts`
- `src/hooks/index.ts` (barrel export)

#### 1.3 Выделение утилит
```typescript
// src/utils/speechRecognition.ts
export const initializeSpeechRecognition = () => { /* ... */ };
export const isSpeechRecognitionAvailable = () => { /* ... */ };

// src/utils/audioProcessing.ts
export const initAudioContext = () => { /* ... */ };
export const playBeep = (frequency, duration) => { /* ... */ };

// src/utils/fileProcessing.ts
export const extractTextFromPDF = (file: File) => { /* ... */ };
export const compressImage = (file: File) => { /* ... */ };
export const validateFile = (file: File) => { /* ... */ };

// src/utils/prompts.ts
export const SYSTEM_PROMPTS = {
  voiceChat: '...',
  assessment: '...',
  lesson: '...',
};

// src/utils/constants.ts
export const TIMEOUT_DURATIONS = {
  TTS_GENERATION: 30000,
  VOICE_RECOGNITION: 60000,
};
```

**Файлы для создания/изменения:**
- `src/utils/speechRecognition.ts`
- `src/utils/audioProcessing.ts`
- `src/utils/fileProcessing.ts`
- `src/utils/prompts.ts` (перенести из компонентов)
- `src/utils/constants.ts`

#### 1.4 Рефакторинг сервисов API
```typescript
// src/services/api/chatService.ts
export class ChatService {
  private baseUrl: string;
  
  async sendMessage(message: string, context: Message[]): Promise<string> {
    // Централизованная логика отправки сообщений
  }
  
  async generateVoiceResponse(text: string): Promise<string> {
    // TTS логика
  }
}

// src/services/api/assessmentService.ts
export class AssessmentService {
  async runAdaptiveTest(grade: string, topic: string): Promise<AssessmentResult> {
    // Логика адаптивного тестирования
  }
}

// src/services/api/index.ts
export const chatService = new ChatService();
export const assessmentService = new AssessmentService();
```

**Файлы для создания:**
- `src/services/api/chatService.ts`
- `src/services/api/assessmentService.ts`
- `src/services/api/lessonService.ts`
- `src/services/api/fileService.ts`
- `src/services/api/index.ts`

---

### ФАЗА 2: КОМПОНЕНТЫ (2-3 недели)
**Цель**: Декомпозировать монолитные компоненты, создать переиспользуемые UI компоненты

#### 2.1 Разделение Chat.tsx (2328 строк)

**Текущая проблема:**
- 27 состояний
- Множество вложенных функций
- Смешанная логика (UI + бизнес-логика)
- Сложная обработка голоса, файлов, TTS

**Решение:**

```
components/
├── Chat/
│   ├── ChatContainer.tsx          # Main component
│   ├── ChatMessages.tsx           # Отображение сообщений
│   ├── ChatInput.tsx              # Input field + attachment
│   ├── VoiceChatControls.tsx      # Voice chat UI
│   ├── TTSControls.tsx            # TTS UI
│   ├── FileUploadArea.tsx         # File handling UI
│   ├── AssessmentPanel.tsx        # Assessment UI
│   ├── AudioTaskPanel.tsx         # Audio tasks UI
│   ├── TestQuestionPanel.tsx      # Test questions UI
│   └── ChatSettings.tsx           # Settings modal
```

**ChatContainer.tsx:**
```typescript
const ChatContainer: React.FC = () => {
  // Используем custom hooks вместо прямого useState
  const { messages, isLoading, sendMessage } = useChat();
  const { isVoiceChatActive, startVoice, stopVoice } = useVoiceChat();
  const { isSpeaking, speak, stopSpeaking } = useTextToSpeech();
  
  return (
    <div className="chat-container">
      <ChatMessages messages={messages} />
      <VoiceChatControls active={isVoiceChatActive} onToggle={startVoice} />
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
};
```

#### 2.2 Разделение Lesson.tsx (2700+ строк)

**Решение:**
```
components/
├── Lesson/
│   ├── LessonContainer.tsx        # Main component
│   ├── LessonContent.tsx          # Контент урока
│   ├── LessonControls.tsx         # Кнопки управления
│   ├── InteractiveLessonPanel.tsx # Интерактивная часть
│   ├── VoiceAssistant.tsx         # Голосовой помощник
│   ├── LessonProgress.tsx         # Прогресс
│   ├── LessonAssessment.tsx       # Встроенное тестирование
│   └── LessonSettings.tsx         # Настройки
```

#### 2.3 Создание UI компонентов для переиспользования

```typescript
// components/ui/Message.tsx
interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  onSpeak?: () => void;
  isSpeaking?: boolean;
}

export const Message: React.FC<MessageProps> = ({ role, content, onSpeak, isSpeaking }) => {
  return (
    <div className={`message message-${role}`}>
      <div className="message-content">{content}</div>
      {role === 'assistant' && (
        <Button onClick={onSpeak} disabled={isSpeaking}>
          <Volume2 size={16} />
        </Button>
      )}
    </div>
  );
};

// components/ui/AudioVisualizer.tsx
interface AudioVisualizerProps {
  isActive: boolean;
  frequency?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive }) => {
  return <div className="audio-visualizer" />;
};

// components/ui/FileUploadZone.tsx
interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFormats?: string[];
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onFilesSelected }) => {
  return <div className="file-upload-zone" />;
};
```

**Файлы для создания:**
- `src/components/Chat/` (папка с подкомпонентами)
- `src/components/Lesson/` (папка с подкомпонентами)
- `src/components/ui/Message.tsx`
- `src/components/ui/AudioVisualizer.tsx`
- `src/components/ui/FileUploadZone.tsx`
- `src/components/ui/VoiceInput.tsx`
- `src/components/ui/AssessmentQuestion.tsx`

---

### ФАЗА 3: STATE MANAGEMENT (1-2 недели)
**Цель**: Централизовать управление состоянием, упростить передачу данных

#### 3.1 Выделение контекстов

```typescript
// src/contexts/ChatContext.tsx
interface ChatContextType {
  messages: Message[];
  addMessage: (msg: Message) => void;
  clearMessages: () => void;
  updateMessage: (id: string, content: Partial<Message>) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  const value: ChatContextType = {
    messages,
    addMessage: (msg) => setMessages(prev => [...prev, msg]),
    clearMessages: () => setMessages([]),
    updateMessage: (id, updates) => {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    },
  };
  
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};

// src/contexts/VoiceContext.tsx
interface VoiceContextType {
  isListening: boolean;
  isSpeaking: boolean;
  startListening: () => Promise<void>;
  stopListening: () => void;
  speak: (text: string) => Promise<void>;
  stopSpeaking: () => void;
}

// src/contexts/AssessmentContext.tsx
interface AssessmentContextType {
  currentQuestion: AssessmentQuestion | null;
  score: number;
  answered: number;
  startAssessment: (grade: string, topic: string) => Promise<void>;
  submitAnswer: (answer: string) => Promise<void>;
}
```

**Файлы для создания:**
- `src/contexts/ChatContext.tsx`
- `src/contexts/VoiceContext.tsx`
- `src/contexts/AssessmentContext.tsx`
- `src/contexts/UIContext.tsx` (для модалей, уведомлений и т.д.)

#### 3.2 Использование Zustand (альтернатива Context)

Если проект растёт, рассмотрите **Zustand** для более масштабируемого state management:

```typescript
// src/store/chatStore.ts
import create from 'zustand';

interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  addMessage: (msg: Message) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  addMessage: (msg) => set(state => ({ messages: [...state.messages, msg] })),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
```

---

### ФАЗА 4: TYPE SAFETY (1 неделя)
**Цель**: Устранить все `any`, создать полные интерфейсы

#### 4.1 Улучшение типов

**Текущее состояние:**
```typescript
const onerror: ((event: any) => void) | null;  // ❌ any
```

**Нужно:**
```typescript
interface SpeechRecognitionErrorEvent extends Event {
  error: SpeechRecognitionErrorCode;
}

type SpeechRecognitionErrorCode = 
  | 'no-speech'
  | 'audio-capture'
  | 'network'
  | 'not-allowed'
  | 'service-not-allowed'
  | 'bad-grammar'
  | 'service-unavailable';

const onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;  // ✅
```

#### 4.2 Создание типизированного API

```typescript
// src/lib/apiClient.ts - улучшить

interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  // Типизированная API логика
}
```

#### 4.3 Enum для констант

```typescript
// src/utils/constants.ts

export enum ApiEndpoint {
  CHAT_COMPLETIONS = '/chat/completions',
  AUDIO_SPEECH = '/audio/speech',
  IMAGES_GENERATIONS = '/images/generations',
}

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export enum TtsModel {
  TTS_1 = 'tts-1',
  TTS_1_HD = 'tts-1-hd',
}

export enum VoiceType {
  ALLOY = 'alloy',
  ECHO = 'echo',
  FABLE = 'fable',
  NOVA = 'nova',
}
```

---

### ФАЗА 5: ERROR HANDLING И LOGGING (1 неделя)
**Цель**: Централизованная обработка ошибок, логирование

#### 5.1 Error Boundary Component

```typescript
// src/components/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
    this.setState({ hasError: true, error });
    // Отправить в analytics/logging service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

#### 5.2 Логирование

```typescript
// src/utils/logger.ts
enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export const logger = {
  debug: (message: string, data?: any) => log(LogLevel.DEBUG, message, data),
  info: (message: string, data?: any) => log(LogLevel.INFO, message, data),
  warn: (message: string, data?: any) => log(LogLevel.WARN, message, data),
  error: (message: string, error?: Error) => log(LogLevel.ERROR, message, error),
};

function log(level: LogLevel, message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`, data);
  // Отправить в логирование сервис (например, Sentry)
}
```

#### 5.3 Обработка API ошибок

```typescript
// src/utils/apiErrorHandler.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Response) {
    // Обработка HTTP errors
    return new ApiError(error.status, 'HTTP_ERROR', error.statusText);
  }
  
  if (error instanceof Error) {
    return new ApiError(500, 'UNKNOWN_ERROR', error.message);
  }
  
  return new ApiError(500, 'UNKNOWN_ERROR', 'Unknown error occurred');
};
```

---

### ФАЗА 6: PERFORMANCE (1-2 недели)
**Цель**: Оптимизация рендеринга, кеширование, ленивая загрузка

#### 6.1 Мемоизация компонентов

```typescript
// Оборачиваем тяжелые компоненты
export const ChatMessages = React.memo(({ messages }: ChatMessagesProps) => {
  return (
    <div>
      {messages.map(msg => <Message key={msg.id} {...msg} />)}
    </div>
  );
}, (prevProps, nextProps) => {
  // Кастомное сравнение props
  return prevProps.messages === nextProps.messages;
});
```

#### 6.2 Virtualisation больших списков

```typescript
import { FixedSizeList as List } from 'react-window';

const VirtualMessageList: React.FC<{ messages: Message[] }> = ({ messages }) => {
  return (
    <List
      height={600}
      itemCount={messages.length}
      itemSize={100}
      width="100%"
    >
      {({ index, style }) => (
        <Message key={messages[index].id} {...messages[index]} style={style} />
      )}
    </List>
  );
};
```

#### 6.3 Code Splitting

```typescript
// src/App.tsx
const Chat = lazy(() => import('./pages/Chat'));
const Lesson = lazy(() => import('./pages/Lesson'));
const Assessment = lazy(() => import('./pages/Assessment'));

<Suspense fallback={<LoadingSpinner />}>
  <Route path="/chat" element={<Chat />} />
</Suspense>
```

#### 6.4 Query Caching

```typescript
// Использовать React Query для кеширования
const { data: messages, isLoading } = useQuery(
  ['messages'],
  fetchMessages,
  {
    staleTime: 5 * 60 * 1000,  // 5 минут
    cacheTime: 10 * 60 * 1000, // 10 минут
  }
);
```

---

### ФАЗА 7: TESTING (2-3 недели)
**Цель**: Повысить покрытие тестами, добавить unit и integration тесты

#### 7.1 Unit тесты для утилит

```typescript
// src/utils/__tests__/speechRecognition.test.ts
describe('Speech Recognition Utils', () => {
  test('isSpeechRecognitionAvailable returns true when API exists', () => {
    expect(isSpeechRecognitionAvailable()).toBe(true);
  });

  test('initializeSpeechRecognition creates recognition instance', () => {
    const recognition = initializeSpeechRecognition();
    expect(recognition).toBeDefined();
  });
});
```

#### 7.2 Component тесты

```typescript
// src/components/Chat/__tests__/ChatContainer.test.tsx
describe('ChatContainer', () => {
  test('renders messages correctly', () => {
    const { getByText } = render(<ChatContainer />);
    expect(getByText('Send message')).toBeInTheDocument();
  });

  test('sends message on button click', async () => {
    const { getByText, getByPlaceholderText } = render(<ChatContainer />);
    const input = getByPlaceholderText('Type message...');
    const sendButton = getByText('Send');

    await userEvent.type(input, 'Hello');
    await userEvent.click(sendButton);

    // Проверяем что сообщение было отправлено
  });
});
```

#### 7.3 Integration тесты

```typescript
// src/__tests__/integration/chatFlow.test.ts
describe('Chat Flow Integration', () => {
  test('complete message exchange flow', async () => {
    // Setup
    const { getByText, getByPlaceholderText } = render(
      <ChatProvider>
        <ChatContainer />
      </ChatProvider>
    );

    // User sends message
    await userEvent.type(getByPlaceholderText('Type...'), 'Hello AI');
    await userEvent.click(getByText('Send'));

    // Wait for response
    await waitFor(() => {
      expect(getByText(/AI response/)).toBeInTheDocument();
    });
  });
});
```

#### 7.4 E2E тесты (Playwright)

```typescript
// e2e/chat.spec.ts
test('complete voice chat flow', async ({ page }) => {
  await page.goto('http://localhost:1031/chat');
  
  // Click voice button
  await page.click('[data-testid="voice-toggle"]');
  
  // Wait for listening state
  await expect(page.locator('[data-testid="listening-indicator"]')).toBeVisible();
  
  // Simulate speech
  // ... (зависит от того, как вы мокируете Web Speech API)
  
  // Check response
  await expect(page.locator('[data-testid="ai-response"]')).toContainText(/response/);
});
```

---

### ФАЗА 8: ДОКУМЕНТАЦИЯ И BEST PRACTICES (1 неделя)
**Цель**: Обновить документацию, установить стандарты кодирования

#### 8.1 Архитектурная документация

**Создать файлы:**
- `ARCHITECTURE.md` - Общая архитектура
- `CODE_STRUCTURE.md` - Структура проекта
- `CONTRIBUTING.md` - Гайд для контрибьютеров
- `TESTING_GUIDE.md` - Как писать тесты
- `API_DOCUMENTATION.md` - API endpoints

#### 8.2 ESLint и Prettier конфиг

```javascript
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-types": "error",
    "prefer-const": "error",
    "no-var": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

#### 8.3 Pre-commit hooks

```bash
# .husky/pre-commit
#!/bin/sh
npm run lint
npm run test:run
```

---

## 📈 График реализации

| Фаза | Описание | Время | Приоритет |
|------|---------|-------|-----------|
| 1 | Архитектура & Структура | 1-2 недели | 🔴 High |
| 2 | Компоненты | 2-3 недели | 🔴 High |
| 3 | State Management | 1-2 недели | 🟡 Medium |
| 4 | Type Safety | 1 неделя | 🔴 High |
| 5 | Error Handling | 1 неделя | 🟡 Medium |
| 6 | Performance | 1-2 недели | 🟡 Medium |
| 7 | Testing | 2-3 недели | 🟡 Medium |
| 8 | Документация | 1 неделя | 🟢 Low |

**Итого:** 10-15 недель полного рефакторинга

---

## ✅ Контрольный список для каждой фазы

### Перед началом
- [ ] Создать новую ветку `refactor/phase-N`
- [ ] Обновить документацию плана
- [ ] Уведомить команду о изменениях

### Во время разработки
- [ ] Писать тесты одновременно с кодом
- [ ] Запускать линтер перед коммитом
- [ ] Документировать сложную логику

### После завершения
- [ ] Пройти code review
- [ ] Запустить full test suite
- [ ] Обновить документацию
- [ ] Слить в `main` с PR

---

## 🚀 Быстрый старт (если спешите)

Если нужны результаты быстро, начните с **приоритетных задач**:

1. **Выделить типы** (ФАЗА 1.1) - 2 часа
2. **Создать custom hooks** (ФАЗА 1.2) - 4 часа
3. **Разделить Chat.tsx** (ФАЗА 2.1) - 1 день
4. **Добавить Error Boundary** (ФАЗА 5.1) - 2 часа
5. **Базовые unit тесты** (ФАЗА 7.1) - 1 день

**Результат:** Основной рефакторинг за 3-4 дня

---

## 📝 Примеры команд для начала

```bash
# Создать структуру папок
mkdir -p src/types src/services/api src/hooks src/contexts src/utils/{__tests__,audio}

# Создать основные файлы
touch src/types/index.ts
touch src/services/api/chatService.ts
touch src/hooks/useChat.ts
touch src/contexts/ChatContext.tsx

# Запустить тесты с watch режимом
npm run test -- --watch

# Проверить покрытие
npm run test:coverage

# Запустить ESLint
npm run lint -- --fix
```

---

## 💡 Рекомендации

1. **Не спешить** - Хороший рефакторинг требует времени
2. **Тесты первыми** - Писать тесты перед изменениями
3. **Маленькие PR** - Мерджить по фазам, не всё сразу
4. **Code review** - Обязательно просматривать друг у друга
5. **Документировать** - Особенно сложную логику
6. **Backward compatibility** - Не ломать существующий функционал

---

## 📚 Полезные ссылки

- [React Patterns](https://reactpatterns.com/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [React Query Documentation](https://tanstack.com/query/latest/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

---

**Статус:** ✅ Документация готова  
**Последнее обновление:** Ноябрь 2024  
**Автор:** AI Assistant

