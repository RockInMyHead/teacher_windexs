/**
 * ChatContainer - Main chat component combining all sub-components
 */

import React, { useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { useChat } from '@/hooks';
import { runAdaptiveAssessment } from '@/utils/adaptiveAssessment';
import { getSystemPrompt } from '@/utils/prompts';
import { logger } from '@/utils/logger';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ChatContainerProps } from './types';
import type { AssessmentQuestion } from '@/types';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { AssessmentPanel, AudioTaskPanel, TestQuestionPanel } from './ChatPanels';

export const ChatContainer = React.forwardRef<any, ChatContainerProps>(
  ({
    initialSystemPrompt = '',
    maxMessages = 100,
    onChatStart,
    onChatEnd,
  }: ChatContainerProps, ref) => {
    // State management
    const { messages, isLoading, sendMessage: sendChatMessage, error: chatError, addMessage, streamingMessage } = useChat({
      maxMessages,
    });

    // Expose addMessage via ref for external use
    React.useImperativeHandle(ref, () => ({
      addMessage,
    }), [addMessage]);




    // Local state

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
      async (content: string, images?: File[]) => {
        try {
          logger.debug('Sending message from input', {
            length: content.length,
            imageCount: images?.length || 0
          });

          const messageContent = content;

          // Send message to AI with images
          await sendChatMessage(messageContent, systemPrompt, 'gpt-4o-mini', images);
        } catch (error) {
          logger.error('Failed to send message', error as Error);
        }
      },
      [sendChatMessage, systemPrompt]
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


    return (
      <div className="space-y-4 rounded-lg bg-background p-6">

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
          streamingMessage={streamingMessage}
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
          isLoading={isLoading}
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

