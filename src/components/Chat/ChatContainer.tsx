/**
 * ChatContainer - Main chat component combining all sub-components
 */

import React, { useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { useChat, useTextToSpeech, useVoiceRecognition, useFileProcessing } from '@/hooks';
import { runAdaptiveAssessment } from '@/utils/adaptiveAssessment';
import { getSystemPrompt } from '@/utils/prompts';
import { logger } from '@/utils/logger';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ChatContainerProps } from './types';
import type { AssessmentQuestion } from '@/types';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import VoiceChatControls from './VoiceChatControls';
import TTSControls from './TTSControls';
import FileUploadArea from './FileUploadArea';
import { AssessmentPanel, AudioTaskPanel, TestQuestionPanel } from './ChatPanels';

export const ChatContainer = React.memo(
  ({
    initialSystemPrompt = '',
    maxMessages = 100,
    onChatStart,
    onChatEnd,
  }: ChatContainerProps) => {
    // State management
    const { messages, isLoading, sendMessage: sendChatMessage, error: chatError } = useChat({
      maxMessages,
    });

    const {
      isSpeaking,
      currentSentence,
      totalSentences,
      speak,
      stop: stopSpeaking,
    } = useTextToSpeech({
      onStart: () => logger.debug('TTS started'),
      onEnd: () => logger.debug('TTS ended'),
    });

    const {
      isListening,
      finalTranscript,
      startListening: startVoiceRecognition,
      stopListening: stopVoiceRecognition,
      clearTranscripts,
    } = useVoiceRecognition({
      language: 'ru-RU',
      onTranscript: (transcript, isFinal) => {
        if (isFinal) {
          logger.debug('Final transcript received', { length: transcript.length });
        }
      },
    });

    const {
      processedFiles,
      processSingleFile,
      getCombinedText: getCombinedText,
      clearFiles: clearProcessedFiles,
    } = useFileProcessing({
      fileProcessingOptions: {
        maxSize: 10 * 1024 * 1024,
        compressImages: true,
      },
    });

    // Local state
    const [isVoiceChatActive, setIsVoiceChatActive] = React.useState(false);
    const [isTtsEnabled, setIsTtsEnabled] = React.useState(false);
    const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
    const [speakingMessageId, setSpeakingMessageId] = React.useState<string | null>(null);

    // Assessment state
    const [isInAssessment, setIsInAssessment] = React.useState(false);
    const [assessmentState, setAssessmentState] = React.useState<'initial' | 'collecting_grade' | 'collecting_topic' | 'in_progress' | 'completed'>('initial');
    const [classGrade, setClassGrade] = React.useState('');
    const [lastTopic, setLastTopic] = React.useState('');
    const [currentAssessmentQuestion, setCurrentAssessmentQuestion] = React.useState<AssessmentQuestion | null>(null);
    const [questionCount, setQuestionCount] = React.useState(0);

    // Audio task state
    const [isAudioTaskActive, setIsAudioTaskActive] = React.useState(false);
    const [audioTaskText, setAudioTaskText] = React.useState('');

    // Test question state
    const [isTestQuestionActive, setIsTestQuestionActive] = React.useState(false);
    const [testQuestionData, setTestQuestionData] = React.useState<any>(null);

    const systemPrompt = initialSystemPrompt || getSystemPrompt('DEFAULT_TEACHER');

    /**
     * Handle sending message from input
     */
    const handleSendMessage = useCallback(
      async (content: string) => {
        try {
          logger.debug('Sending message from input', { length: content.length });

          // Include file contents if files are uploaded
          let messageContent = content;
          if (processedFiles.length > 0) {
            const fileContents = getCombinedText();
            messageContent += `\n\n--- Файлы ---\n${fileContents}`;
            clearProcessedFiles();
            setUploadedFiles([]);
          }

          // Send message to AI
          await sendChatMessage(messageContent, systemPrompt);

          // If TTS is enabled, speak the response
          if (isTtsEnabled && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage?.role === 'assistant') {
              setSpeakingMessageId(lastMessage.id);
              await speak(lastMessage.content);
              setSpeakingMessageId(null);
            }
          }
        } catch (error) {
          logger.error('Failed to send message', error as Error);
        }
      },
      [sendChatMessage, speak, isTtsEnabled, messages, processedFiles, getCombinedText, clearProcessedFiles, systemPrompt]
    );

    /**
     * Handle file selection
     */
    const handleFilesSelected = useCallback(
      async (files: File[]) => {
        try {
          logger.debug('Files selected', { count: files.length });
          setUploadedFiles(prev => [...prev, ...files]);

          // Process files
          for (const file of files) {
            await processSingleFile(file);
          }
        } catch (error) {
          logger.error('Failed to process files', error as Error);
        }
      },
      [processSingleFile]
    );

    /**
     * Handle voice chat toggle
     */
    const handleToggleVoiceChat = useCallback(() => {
      if (isVoiceChatActive) {
        logger.debug('Disabling voice chat');
        setIsVoiceChatActive(false);
        stopVoiceRecognition();
        clearTranscripts();
      } else {
        logger.debug('Enabling voice chat');
        setIsVoiceChatActive(true);
        onChatStart?.();
      }
    }, [isVoiceChatActive, stopVoiceRecognition, clearTranscripts, onChatStart]);

    /**
     * Handle TTS toggle
     */
    const handleToggleTts = useCallback(() => {
      logger.debug('Toggling TTS', { enabled: !isTtsEnabled });
      setIsTtsEnabled(!isTtsEnabled);
    }, [isTtsEnabled]);

    /**
     * Handle message speak
     */
    const handleMessageSpeak = useCallback(
      async (message: any) => {
        try {
          if (speakingMessageId === message.id) {
            stopSpeaking();
            setSpeakingMessageId(null);
          } else {
            setSpeakingMessageId(message.id);
            await speak(message.content);
            setSpeakingMessageId(null);
          }
        } catch (error) {
          logger.error('Failed to speak message', error as Error);
          setSpeakingMessageId(null);
        }
      },
      [speak, stopSpeaking, speakingMessageId]
    );

    /**
     * Start assessment
     */
    const handleStartAssessment = useCallback(() => {
      logger.debug('Starting assessment');
      setIsInAssessment(true);
      setAssessmentState('collecting_grade');
    }, []);

    /**
     * Submit grade
     */
    const handleSubmitGrade = useCallback((grade: string) => {
      logger.debug('Grade selected', { grade });
      setClassGrade(grade);
      setAssessmentState('collecting_topic');
    }, []);

    /**
     * Submit topic
     */
    const handleSubmitTopic = useCallback((topic: string) => {
      logger.debug('Topic selected', { topic });
      setLastTopic(topic);
      setAssessmentState('in_progress');

      // Start adaptive assessment
      runAdaptiveAssessment(classGrade, topic, async (question, num) => {
        setCurrentAssessmentQuestion(question);
        setQuestionCount(num);

        // Wait for user input
        return new Promise(resolve => {
          // This would be resolved from the answer submission
          const timeout = setTimeout(() => resolve(''), 60000);
          (window as any)._assessmentResolver = (answer: string) => {
            clearTimeout(timeout);
            resolve(answer);
          };
        });
      }).catch(error => {
        logger.error('Assessment error', error as Error);
        setAssessmentState('initial');
        setIsInAssessment(false);
      });
    }, [classGrade]);

    /**
     * Handle back button
     */
    const handleBack = useCallback(() => {
      logger.debug('Going back');
      if (isVoiceChatActive) {
        handleToggleVoiceChat();
      }
      onChatEnd?.();
    }, [isVoiceChatActive, handleToggleVoiceChat, onChatEnd]);

    return (
      <div className="space-y-4 rounded-lg bg-background p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Чат с AI</h1>
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Error display */}
        {chatError && (
          <Card className="border-destructive bg-destructive/10 p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <div>
                <p className="font-medium text-destructive">Ошибка</p>
                <p className="text-sm text-destructive/80">{chatError.message}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Messages */}
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          onMessageSpeak={handleMessageSpeak}
          isSpeakingId={speakingMessageId}
        />

        {/* Voice Chat Controls */}
        <VoiceChatControls
          isActive={isVoiceChatActive}
          isListening={isListening}
          isSpeaking={isSpeaking}
          onToggle={handleToggleVoiceChat}
          onStartListening={startVoiceRecognition}
          onStopListening={stopVoiceRecognition}
          disabled={isLoading || isInAssessment}
        />

        {/* TTS Controls */}
        <TTSControls
          isEnabled={isTtsEnabled}
          isSpeaking={isSpeaking}
          currentSentence={currentSentence}
          totalSentences={totalSentences}
          onToggle={handleToggleTts}
          onStop={stopSpeaking}
          disabled={isLoading}
        />

        {/* File Upload */}
        <FileUploadArea
          onFilesSelected={handleFilesSelected}
          uploadedFiles={uploadedFiles}
          onFileRemove={(index) => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
          isProcessing={false}
          disabled={isLoading || isInAssessment}
        />

        {/* Assessment Panel */}
        <AssessmentPanel
          isActive={isInAssessment}
          currentQuestion={currentAssessmentQuestion}
          questionCount={questionCount}
          assessmentState={assessmentState}
          classGrade={classGrade}
          lastTopic={lastTopic}
          onGradeSelect={handleSubmitGrade}
          onTopicSelect={handleSubmitTopic}
          onClose={() => {
            setIsInAssessment(false);
            setAssessmentState('initial');
          }}
          isLoading={isLoading}
        />

        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onFileSelected={handleFilesSelected}
          isLoading={isLoading || isSpeaking}
          uploadedFilesCount={uploadedFiles.length}
          disabled={isInAssessment}
        />

        {/* Assessment, Audio Task, Test Question Panels */}
        <AudioTaskPanel
          isActive={isAudioTaskActive}
          taskText={audioTaskText}
          onClose={() => setIsAudioTaskActive(false)}
        />

        <TestQuestionPanel
          isActive={isTestQuestionActive}
          questionData={testQuestionData}
          onClose={() => setIsTestQuestionActive(false)}
        />
      </div>
    );
  }
);

ChatContainer.displayName = 'ChatContainer';

export default ChatContainer;

