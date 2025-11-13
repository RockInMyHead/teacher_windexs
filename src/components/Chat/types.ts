/**
 * Chat component types and interfaces
 */

import type { Message, AssessmentQuestion, AssessmentResult, TestQuestionData } from '@/types';

// ============= CHAT MESSAGE COMPONENT =============

export interface ChatMessageProps {
  message: Message;
  onSpeak?: (text: string) => Promise<void>;
  isSpeaking?: boolean;
  onRemove?: (id: string) => void;
}

// ============= CHAT INPUT COMPONENT =============

export interface ChatInputProps {
  onSendMessage: (content: string) => Promise<void>;
  onFileSelected?: (files: File[]) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  uploadedFilesCount?: number;
}

// ============= CHAT MESSAGES LIST =============

export interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
  onMessageSpeak?: (message: Message) => Promise<void>;
  isSpeakingId?: string | null;
  onMessageRemove?: (id: string) => void;
}

// ============= VOICE CHAT CONTROLS =============

export interface VoiceChatControlsProps {
  isActive: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  onToggle: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
  disabled?: boolean;
}

// ============= TTS CONTROLS =============

export interface TTSControlsProps {
  isEnabled: boolean;
  isSpeaking: boolean;
  currentSentence: number;
  totalSentences: number;
  onToggle: () => void;
  onStop: () => void;
  disabled?: boolean;
}

// ============= FILE UPLOAD AREA =============

export interface FileUploadAreaProps {
  onFilesSelected: (files: File[]) => void;
  uploadedFiles?: File[];
  onFileRemove?: (index: number) => void;
  isProcessing?: boolean;
  disabled?: boolean;
  maxFiles?: number;
}

// ============= ASSESSMENT PANEL =============

export interface AssessmentPanelProps {
  isActive: boolean;
  currentQuestion?: AssessmentQuestion | null;
  questionCount?: number;
  assessmentState?: 'initial' | 'collecting_grade' | 'collecting_topic' | 'in_progress' | 'completed';
  assessmentResult?: AssessmentResult | null;
  classGrade?: string;
  lastTopic?: string;
  onGradeSelect?: (grade: string) => void;
  onTopicSelect?: (topic: string) => void;
  onAnswerSubmit?: (answer: string) => Promise<void>;
  onClose?: () => void;
  isLoading?: boolean;
}

// ============= AUDIO TASK PANEL =============

export interface AudioTaskPanelProps {
  isActive: boolean;
  taskText?: string;
  isRecording?: boolean;
  onStart?: () => void;
  onStop?: () => void;
  onClose?: () => void;
}

// ============= TEST QUESTION PANEL =============

export interface TestQuestionPanelProps {
  isActive: boolean;
  questionData?: TestQuestionData | null;
  onAnswerSelect?: (answer: string) => void;
  onClose?: () => void;
}

// ============= CHAT CONTAINER =============

export interface ChatContainerProps {
  initialSystemPrompt?: string;
  maxMessages?: number;
  onChatStart?: () => void;
  onChatEnd?: () => void;
}

// ============= INTERNAL STATE =============

export interface ChatInternalState {
  messages: Message[];
  isLoading: boolean;
  isVoiceChatActive: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isTtsEnabled: boolean;
  uploadedFiles: File[];
  assessmentState: 'initial' | 'collecting_grade' | 'collecting_topic' | 'in_progress' | 'completed';
  currentAssessmentQuestion: AssessmentQuestion | null;
  assessmentResult: AssessmentResult | null;
  classGrade: string;
  lastTopic: string;
  questionCount: number;
  isAudioTaskActive: boolean;
  audioTaskText: string;
  isTestQuestionActive: boolean;
  testQuestionData: TestQuestionData | null;
  error: Error | null;
  apiKeyStatus: 'checking' | 'valid' | 'invalid' | 'error';
}

