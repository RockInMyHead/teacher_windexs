/**
 * Store types and interfaces
 */

import type { Message, AssessmentQuestion, AssessmentResult } from '@/types';

// ============= CHAT STORE =============

export interface ChatStore {
  // State
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  systemPrompt: string;

  // Actions
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setSystemPrompt: (prompt: string) => void;
  
  // Computed
  getLastMessage: () => Message | null;
  getContext: (limit: number) => Message[];
  getTotalTokens: () => number;
}

// ============= VOICE STORE =============

export interface VoiceStore {
  // State
  isVoiceChatActive: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  interimTranscript: string;
  finalTranscript: string;
  error: Error | null;
  language: string;

  // Actions
  setVoiceChatActive: (active: boolean) => void;
  setIsListening: (listening: boolean) => void;
  setIsSpeaking: (speaking: boolean) => void;
  setInterimTranscript: (transcript: string) => void;
  setFinalTranscript: (transcript: string) => void;
  addTranscript: (transcript: string) => void;
  clearTranscripts: () => void;
  setError: (error: Error | null) => void;
  setLanguage: (language: string) => void;

  // Computed
  getFullTranscript: () => string;
}

// ============= TTS STORE =============

export interface TTSStore {
  // State
  isEnabled: boolean;
  isSpeaking: boolean;
  currentSentence: number;
  totalSentences: number;
  error: Error | null;
  model: string;
  voice: string;

  // Actions
  setIsEnabled: (enabled: boolean) => void;
  setIsSpeaking: (speaking: boolean) => void;
  setCurrentSentence: (sentence: number) => void;
  setTotalSentences: (total: number) => void;
  incrementSentence: () => void;
  resetProgress: () => void;
  setError: (error: Error | null) => void;
  setModel: (model: string) => void;
  setVoice: (voice: string) => void;

  // Computed
  getProgress: () => number;
  isComplete: () => boolean;
}

// ============= FILE STORE =============

export interface FileStore {
  // State
  uploadedFiles: File[];
  processedFiles: Array<{ name: string; content: string; type: string }>;
  isProcessing: boolean;
  error: Error | null;

  // Actions
  addFiles: (files: File[]) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
  setProcessedFiles: (files: Array<{ name: string; content: string; type: string }>) => void;
  addProcessedFile: (file: { name: string; content: string; type: string }) => void;
  setIsProcessing: (processing: boolean) => void;
  setError: (error: Error | null) => void;

  // Computed
  getFileCount: () => number;
  getCombinedText: () => string;
}

// ============= ASSESSMENT STORE =============

export interface AssessmentStore {
  // State
  isActive: boolean;
  state: 'initial' | 'collecting_grade' | 'collecting_topic' | 'in_progress' | 'completed';
  classGrade: string;
  lastTopic: string;
  currentQuestion: AssessmentQuestion | null;
  questionCount: number;
  result: AssessmentResult | null;
  error: Error | null;

  // Actions
  startAssessment: () => void;
  endAssessment: () => void;
  setClassGrade: (grade: string) => void;
  setLastTopic: (topic: string) => void;
  setState: (state: AssessmentStore['state']) => void;
  setCurrentQuestion: (question: AssessmentQuestion | null) => void;
  setQuestionCount: (count: number) => void;
  incrementQuestionCount: () => void;
  setResult: (result: AssessmentResult | null) => void;
  setError: (error: Error | null) => void;
  reset: () => void;

  // Computed
  isCollectingGrade: () => boolean;
  isCollectingTopic: () => boolean;
  isInProgress: () => boolean;
  isCompleted: () => boolean;
}

// ============= UI STORE =============

export interface UIStore {
  // State
  isCameraActive: boolean;
  isAudioTaskActive: boolean;
  isTestQuestionActive: boolean;
  showSphere: boolean;
  selectedTheme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  tooltipsEnabled: boolean;
  error: Error | null;

  // Actions
  setCameraActive: (active: boolean) => void;
  setAudioTaskActive: (active: boolean) => void;
  setTestQuestionActive: (active: boolean) => void;
  setShowSphere: (show: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTooltipsEnabled: (enabled: boolean) => void;
  setError: (error: Error | null) => void;

  // Computed
  isDarkMode: () => boolean;
}

// ============= ROOT STORE =============

export interface RootStore extends ChatStore, VoiceStore, TTSStore, FileStore, AssessmentStore, UIStore {
  // Reset all stores
  reset: () => void;
}

