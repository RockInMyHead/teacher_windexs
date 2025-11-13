/**
 * Chat Components - Barrel export
 */

export { ChatContainer } from './ChatContainer';
export { ChatMessages } from './ChatMessages';
export { ChatInput } from './ChatInput';
export { VoiceChatControls } from './VoiceChatControls';
export { TTSControls } from './TTSControls';
export { FileUploadArea } from './FileUploadArea';
export { AssessmentPanel, AudioTaskPanel, TestQuestionPanel } from './ChatPanels';

// Types
export type {
  ChatMessageProps,
  ChatInputProps,
  ChatMessagesProps,
  VoiceChatControlsProps,
  TTSControlsProps,
  FileUploadAreaProps,
  AssessmentPanelProps,
  AudioTaskPanelProps,
  TestQuestionPanelProps,
  ChatContainerProps,
  ChatInternalState,
} from './types';

