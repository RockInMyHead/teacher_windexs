// UI types - component props and states
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface ChatUIState extends LoadingState {
  messages: Array<{
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
  }>;
  isTyping: boolean;
}

export interface VoiceUIState extends LoadingState {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  volume: number;
}

export interface CourseUIState extends LoadingState {
  courses: any[];
  selectedCourse?: any;
  progress: Record<string, number>;
}

export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
