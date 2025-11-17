/**
 * Main types and interfaces for the application
 * Re-export all types for convenient access
 */

// Type safety imports
export * from './errors';
export * from './validation';
export * from './api';

// ============= MESSAGES =============

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  ttsPlayed?: boolean;
}

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

// ============= CHAT STATE =============

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  uploadedFiles: File[];
  isProcessingFile: boolean;
}

export interface ChatContextType extends ChatState {
  addMessage: (msg: Message) => void;
  clearMessages: () => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  setIsLoading: (loading: boolean) => void;
  addFiles: (files: File[]) => void;
  clearFiles: () => void;
}

// ============= VOICE STATE =============

export interface VoiceState {
  isVoiceChatActive: boolean;
  isListening: boolean;
  isTtsEnabled: boolean;
  isSpeaking: boolean;
  currentSentence: number;
  totalSentences: number;
}

export interface VoiceContextType extends VoiceState {
  startVoiceChat: () => Promise<void>;
  stopVoiceChat: () => void;
  startListening: () => void;
  stopListening: () => void;
  enableTts: () => void;
  disableTts: () => void;
  speak: (text: string) => Promise<void>;
  stopSpeaking: () => void;
}

// ============= ASSESSMENT TYPES =============

export interface AssessmentQuestion {
  id: string;
  prompt: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  concept: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'multiple_choice' | 'fill_blank' | 'translation' | 'matching';
}

export interface AssessmentResult {
  cluster: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  profile: Array<[string, boolean]>;
  recommendations: string[];
}

export interface AssessmentState {
  isInAdaptiveMode: boolean;
  assessmentState: 'initial' | 'collecting_grade' | 'collecting_topic' | 'in_progress' | 'completed';
  classGrade: string;
  lastTopic: string;
  currentAssessmentQuestion: AssessmentQuestion | null;
  assessmentResult: AssessmentResult | null;
  questionCount: number;
}

export interface AssessmentContextType extends AssessmentState {
  startAssessment: (grade: string, topic: string) => Promise<void>;
  submitAnswer: (answer: string) => Promise<void>;
  endAssessment: () => void;
  resetAssessment: () => void;
}

// ============= FILE HANDLING =============

export interface ProcessedFile {
  originalFile: File;
  extractedText: string;
  fileType: 'pdf' | 'image' | 'text' | 'unknown';
  size: number;
  name: string;
}

export interface FileProcessingOptions {
  maxSize?: number; // bytes
  allowedFormats?: string[];
  compressImages?: boolean;
}

export interface FileProcessingResult {
  success: boolean;
  file?: ProcessedFile;
  error?: string;
}

// ============= AUDIO/TTS TYPES =============

export enum TtsModel {
  TTS_1 = 'tts-1',
  TTS_1_HD = 'tts-1-hd',
}

export enum VoiceType {
  ALLOY = 'alloy',
  ECHO = 'echo',
  FABLE = 'fable',
  NOVA = 'nova',
  ONYX = 'onyx',
  SHIMMER = 'shimmer',
}

export interface AudioContextOptions {
  sampleRate?: number;
  channels?: number;
}

export interface BeepOptions {
  frequency?: number;
  duration?: number;
  type?: OscillatorType;
}

// ============= SPEECH RECOGNITION =============

export interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

export interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
}

export type SpeechRecognitionErrorCode =
  | 'no-speech'
  | 'audio-capture'
  | 'network'
  | 'not-allowed'
  | 'service-not-allowed'
  | 'bad-grammar'
  | 'service-unavailable';

export interface SpeechRecognitionErrorEvent extends Event {
  error: SpeechRecognitionErrorCode;
}

// ============= API TYPES =============

export enum ApiEndpoint {
  CHAT_COMPLETIONS = '/chat/completions',
  AUDIO_SPEECH = '/audio/speech',
  IMAGES_GENERATIONS = '/images/generations',
  MODELS_LIST = '/models',
  HEALTH = '/health',
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  error?: {
    code: string;
    message: string;
    statusCode?: number;
  };
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  max_tokens: number;
  temperature: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionResponse {
  choices: Array<{
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AudioSpeechRequest {
  model: string;
  input: string;
  voice: VoiceType;
  response_format?: 'mp3' | 'opus' | 'aac' | 'flac';
  speed?: number;
}

// ============= UI STATE =============

export interface UIState {
  isCameraActive: boolean;
  capturedImage: string | null;
  showSphere: boolean;
  isAudioTaskActive: boolean;
  audioTaskText: string;
  isRecordingAudioTask: boolean;
  isTestQuestionActive: boolean;
  testQuestionData: TestQuestionData | null;
}

export interface TestQuestionData {
  question: string;
  options: string[];
  currentQuestion: number;
  totalQuestions: number;
}

export interface UIContextType extends UIState {
  toggleCamera: (active: boolean) => void;
  setCapturedImage: (image: string | null) => void;
  toggleSphere: (show: boolean) => void;
  startAudioTask: (text: string) => void;
  endAudioTask: () => void;
  setRecordingAudioTask: (recording: boolean) => void;
  showTestQuestion: (data: TestQuestionData) => void;
  hideTestQuestion: () => void;
}

// ============= API KEY TYPES =============

export interface ApiKeyStatus {
  status: 'checking' | 'valid' | 'invalid' | 'error';
  model?: string;
  lastChecked?: Date;
  errorMessage?: string;
}

// ============= ERROR TYPES =============

export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public context?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export type AppErrorCode =
  | 'API_ERROR'
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'AUTH_ERROR'
  | 'NOT_FOUND'
  | 'TIMEOUT'
  | 'UNKNOWN_ERROR';

// ============= HOOK RETURN TYPES =============

export interface UseVoiceChatReturn {
  isVoiceChatActive: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  startVoiceChat: () => Promise<void>;
  stopVoiceChat: () => void;
  error: AppError | null;
}

export interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string, systemPrompt?: string, model?: string) => Promise<void>;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  getLastMessage: () => Message | null;
  getContext: (limit?: number) => Message[];
  error: AppError | null;
  streamingMessage: Message | null;
}

export interface UseTextToSpeechReturn {
  isSpeaking: boolean;
  currentSentence: number;
  totalSentences: number;
  speak: (text: string, options?: Partial<AudioSpeechRequest>) => Promise<void>;
  stop: () => void;
  error: AppError | null;
}

export interface UseFileProcessingReturn {
  isProcessing: boolean;
  processedFiles: ProcessedFile[];
  processFile: (file: File) => Promise<FileProcessingResult>;
  clearFiles: () => void;
  error: AppError | null;
}

export interface UseVoiceRecognitionReturn {
  isListening: boolean;
  interimTranscript: string;
  finalTranscript: string;
  startListening: () => void;
  stopListening: () => void;
  error: AppError | null;
}

export interface UseAssessmentReturn {
  currentQuestion: AssessmentQuestion | null;
  questionCount: number;
  score: number;
  assessmentState: AssessmentState['assessmentState'];
  startAssessment: (grade: string, topic: string) => Promise<void>;
  submitAnswer: (answer: string) => Promise<void>;
  endAssessment: () => void;
  error: AppError | null;
}

export interface UseApiKeyReturn {
  status: ApiKeyStatus;
  checkApiKey: () => Promise<boolean>;
  setApiKey: (key: string) => void;
}

