/**
 * Simplified Chat Component Example
 * Demonstrates how to use the new modular chat feature
 * This file serves as a reference for refactoring Chat.tsx
 * 
 * Key improvements:
 * - Uses feature modules instead of inline logic
 * - Clean separation of concerns
 * - Reusable hooks and components
 * - ~200 lines instead of 1984
 */

import React, { useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import {
  // Hooks
  useChatModel,
  useLessonModel,
  useAudioModel,
  // API
  sendChatCompletion,
  generateLessonPlan,
  generateDynamicLessonContent,
  createLessonSession,
  updateLessonProgress,
  // UI Components
  ChatHeader,
  MessageList,
  MessageInput,
  LessonProgress,
  LoadingIndicator,
  GenerationStepsIndicator,
  // Utils
  parseLessonContent,
  convertPlanToSteps,
} from '@/features/chat';
import { OpenAITTS } from '@/lib/openaiTTS';

export function ChatSimple() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Use feature hooks for state management
  const chat = useChatModel();
  const lesson = useLessonModel();
  const audio = useAudioModel();

  // Initialize lesson mode from URL params
  useEffect(() => {
    const mode = searchParams.get('mode');
    const isLessonMode = mode === 'lesson';
    lesson.setIsLessonMode(isLessonMode);

    if (isLessonMode) {
      loadLessonFromStorage();
    }
  }, [searchParams]);

  // Load lesson data from localStorage
  const loadLessonFromStorage = useCallback(() => {
    const storedLesson = localStorage.getItem('currentLesson');
    if (storedLesson) {
      try {
        const lessonData = JSON.parse(storedLesson);
        lesson.setCurrentLesson(lessonData);

        // Auto-generate lesson if requested
        if (searchParams.get('auto') === 'true') {
          handleGenerateLesson(lessonData);
        }
      } catch (error) {
        console.error('Failed to load lesson:', error);
      }
    }
  }, [searchParams]);

  // Generate lesson plan using API
  const handleGenerateLesson = useCallback(async (lessonData: any) => {
    if (lesson.isGeneratingPlan) return;

    lesson.setIsGeneratingPlan(true);
    lesson.setGenerationStep('Анализирую тему урока...');

    try {
      // Use API function instead of inline fetch
      const plan = await generateLessonPlan(
        lessonData.title,
        lessonData.topic,
        lessonData.aspects || lessonData.description
      );

      // Convert plan to steps format
      const steps = convertPlanToSteps(plan);
      
      lesson.setLessonPlan({ ...plan, steps });
      lesson.setLessonStarted(true);

      // Create lesson session
      const session = await createLessonSession({
        lessonId: lessonData.id,
        studentId: 'current-user',
        lessonTitle: lessonData.title,
        lessonTopic: lessonData.topic,
      });
      lesson.setCurrentSessionId(session.id);

      // Generate first step content
      if (steps.length > 0) {
        const sections = parseLessonContent(steps[0].content);
        lesson.setCurrentLessonSections(sections);
        lesson.setCurrentSectionIndex(0);
      }
    } catch (error) {
      console.error('Failed to generate lesson:', error);
      lesson.setGenerationError('Не удалось создать урок. Попробуйте еще раз.');
    } finally {
      lesson.setIsGeneratingPlan(false);
      lesson.setGenerationStep('');
    }
  }, [lesson]);

  // Handle sending message
  const handleSendMessage = useCallback(async () => {
    if (!chat.inputMessage.trim() || chat.isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: chat.inputMessage,
      timestamp: new Date(),
    };

    chat.addMessage(userMessage);
    chat.setInputMessage('');
    chat.setIsLoading(true);

    try {
      let response: string;

      if (lesson.isLessonMode && lesson.currentLesson) {
        // Use lesson-specific API
        response = await generateDynamicLessonContent(
          {
            title: lesson.currentLesson.title,
            topic: lesson.currentLesson.topic,
            currentSection: lesson.currentLessonSections[lesson.currentSectionIndex]?.title,
          },
          userMessage.content,
          lesson.conversationHistory
        );

        // Add to conversation history
        lesson.addToConversation('student', userMessage.content);
        lesson.addToConversation('teacher', response);
      } else {
        // Regular chat completion
        response = await sendChatCompletion(
          [...chat.messages, userMessage].map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
          { model: 'gpt-5.1', temperature: 0.7, max_tokens: 800 }
        );
      }

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: response,
        timestamp: new Date(),
      };

      chat.addMessage(assistantMessage);

      // Auto-speak if TTS enabled
      if (audio.isTtsEnabled) {
        await handleSpeakMessage(assistantMessage.id, response);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      chat.addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Извините, произошла ошибка. Попробуйте еще раз.',
        timestamp: new Date(),
      });
    } finally {
      chat.setIsLoading(false);
    }
  }, [chat, lesson, audio]);

  // Handle speaking message with OpenAI TTS
  const handleSpeakMessage = useCallback(async (messageId: string, text: string) => {
    if (audio.speakingMessageId) {
      audio.stopAudio();
      return;
    }

    audio.setSpeakingMessageId(messageId);

    try {
      await OpenAITTS.speak(text, {
        voice: 'nova',
        model: 'tts-1',
        format: 'mp3',
        onStart: () => console.log('🔊 TTS started'),
        onEnd: () => {
          audio.setSpeakingMessageId(null);
          console.log('✅ TTS completed');
        },
      });
    } catch (error) {
      console.error('TTS error:', error);
      audio.setSpeakingMessageId(null);
    }
  }, [audio]);

  // Move to next lesson section
  const handleNextSection = useCallback(async () => {
    if (lesson.currentSectionIndex < lesson.currentLessonSections.length - 1) {
      lesson.nextSection();
    } else {
      // Move to next step
      if (lesson.currentLessonStep < (lesson.lessonPlan?.steps?.length || 0) - 1) {
        lesson.nextStep();
        const nextStep = lesson.lessonPlan.steps[lesson.currentLessonStep + 1];
        const sections = parseLessonContent(nextStep.content);
        lesson.setCurrentLessonSections(sections);
        lesson.setCurrentSectionIndex(0);

        // Update progress
        if (lesson.currentSessionId) {
          await updateLessonProgress(lesson.currentSessionId, {
            currentStep: lesson.currentLessonStep + 1,
          });
        }
      } else {
        // Lesson completed
        lesson.setLessonStarted(false);
        chat.addMessage({
          id: Date.now().toString(),
          role: 'assistant',
          content: '🎉 Поздравляю! Вы завершили урок!',
          timestamp: new Date(),
        });
      }
    }
  }, [lesson, chat]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audio.cleanupAudio();
      OpenAITTS.stop();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Chat Header */}
        <ChatHeader
          title={lesson.currentLesson?.title || 'Учитель ИИ'}
          subtitle={lesson.currentLesson?.topic}
          isTtsEnabled={audio.isTtsEnabled}
          onToggleTTS={audio.toggleTTS}
          onBack={() => navigate('/')}
          showBackButton
        />

        {/* Lesson Progress */}
        {lesson.isLessonMode && lesson.lessonStarted && (
          <LessonProgress
            currentStep={lesson.currentLessonStep + 1}
            totalSteps={lesson.lessonPlan?.steps?.length || 0}
            currentStepTitle={lesson.lessonPlan?.steps?.[lesson.currentLessonStep]?.title}
            notes={lesson.lessonNotes}
            className="m-4"
          />
        )}

        {/* Loading State */}
        {lesson.isGeneratingPlan && (
          <GenerationStepsIndicator
            currentStep={lesson.generationStep}
            className="m-4"
          />
        )}

        {/* Message List */}
        <MessageList
          messages={chat.messages}
          speakingMessageId={audio.speakingMessageId}
          onSpeakMessage={handleSpeakMessage}
          showSpeakButton={true}
        />

        {/* Loading Indicator */}
        {chat.isLoading && (
          <LoadingIndicator message="Обрабатываю запрос" className="m-4" />
        )}

        {/* Message Input */}
        <MessageInput
          value={chat.inputMessage}
          onChange={chat.setInputMessage}
          onSend={handleSendMessage}
          disabled={chat.isLoading}
          placeholder="Введите ваш вопрос..."
        />
      </div>
    </div>
  );
}

export default ChatSimple;


