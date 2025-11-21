/**
 * Chat Model Module
 * State management and business logic for chat functionality
 * @module features/chat/model/chatModel
 */

import { useState, useCallback, useRef } from 'react';
import type { Message } from '@/types';

/**
 * Custom hook for managing chat state and logic
 */
export function useChatModel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Add a new message to the chat
   */
  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  /**
   * Update an existing message
   */
  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessages(prev =>
      prev.map(msg => (msg.id === id ? { ...msg, ...updates } : msg))
    );
  }, []);

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  /**
   * Get the last message
   */
  const getLastMessage = useCallback((): Message | null => {
    return messages.length > 0 ? messages[messages.length - 1] : null;
  }, [messages]);

  /**
   * Get recent messages for context
   */
  const getRecentMessages = useCallback((limit: number = 10): Message[] => {
    return messages.slice(-limit);
  }, [messages]);

  return {
    messages,
    inputMessage,
    isLoading,
    setInputMessage,
    setIsLoading,
    addMessage,
    updateMessage,
    clearMessages,
    getLastMessage,
    getRecentMessages
  };
}

/**
 * Custom hook for managing lesson state
 */
export function useLessonModel() {
  const [isLessonMode, setIsLessonMode] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [lessonPlan, setLessonPlan] = useState<any>(null);
  const [currentLessonStep, setCurrentLessonStep] = useState(0);
  const [lessonStarted, setLessonStarted] = useState(false);
  const [lessonProgress, setLessonProgress] = useState(0);

  // Lesson generation states
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generationError, setGenerationError] = useState('');

  // Interactive lesson states
  const [currentLessonSections, setCurrentLessonSections] = useState<any[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [waitingForAnswer, setWaitingForAnswer] = useState(false);
  const [currentSectionTask, setCurrentSectionTask] = useState<any>(null);

  // Lesson notes and conversation
  const [lessonNotes, setLessonNotes] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: 'teacher' | 'student'; text: string }>
  >([]);
  const [callTranscript, setCallTranscript] = useState('');

  // Session tracking
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);

  /**
   * Add a note to the lesson
   */
  const addLessonNote = useCallback((note: string) => {
    setLessonNotes(prev => [...prev, note]);
  }, []);

  /**
   * Add to conversation history
   */
  const addToConversation = useCallback((
    role: 'teacher' | 'student',
    text: string
  ) => {
    setConversationHistory(prev => [...prev, { role, text }]);
  }, []);

  /**
   * Move to next lesson section
   */
  const nextSection = useCallback(() => {
    setCurrentSectionIndex(prev => prev + 1);
    setCurrentSectionTask(null);
    setWaitingForAnswer(false);
  }, []);

  /**
   * Move to next lesson step
   */
  const nextStep = useCallback(() => {
    setCurrentLessonStep(prev => prev + 1);
    setCurrentLessonSections([]);
    setCurrentSectionIndex(0);
  }, []);

  /**
   * Reset lesson state
   */
  const resetLesson = useCallback(() => {
    setCurrentLesson(null);
    setLessonPlan(null);
    setCurrentLessonStep(0);
    setLessonStarted(false);
    setLessonProgress(0);
    setCurrentLessonSections([]);
    setCurrentSectionIndex(0);
    setLessonNotes([]);
    setConversationHistory([]);
    setCallTranscript('');
    setCurrentSessionId(null);
    setIsGeneratingPlan(false);
    setGenerationStep('');
    setGenerationError('');
  }, []);

  return {
    // State
    isLessonMode,
    currentLesson,
    lessonPlan,
    currentLessonStep,
    lessonStarted,
    lessonProgress,
    isGeneratingPlan,
    generationStep,
    generationError,
    currentLessonSections,
    currentSectionIndex,
    waitingForAnswer,
    currentSectionTask,
    lessonNotes,
    conversationHistory,
    callTranscript,
    currentSessionId,

    // Setters
    setIsLessonMode,
    setCurrentLesson,
    setLessonPlan,
    setCurrentLessonStep,
    setLessonStarted,
    setLessonProgress,
    setIsGeneratingPlan,
    setGenerationStep,
    setGenerationError,
    setCurrentLessonSections,
    setCurrentSectionIndex,
    setWaitingForAnswer,
    setCurrentSectionTask,
    setLessonNotes,
    setConversationHistory,
    setCallTranscript,
    setCurrentSessionId,

    // Actions
    addLessonNote,
    addToConversation,
    nextSection,
    nextStep,
    resetLesson
  };
}

/**
 * Parse lesson content into sections
 */
export function parseLessonContent(content: string): any[] {
  if (!content) return [{ title: 'Содержание', content: 'Контент не найден.' }];

  const sections: any[] = [];
  const lines = content.split('\n');

  let currentSection: any = null;
  let currentContent = '';

  for (const line of lines) {
    // Check for headers (### or ## or #)
    if (line.startsWith('### ')) {
      if (currentSection) {
        currentSection.content = currentContent.trim();
        sections.push(currentSection);
      }
      currentSection = {
        title: line.replace(/^###\s*/, '').trim(),
        content: ''
      };
      currentContent = '';
    } else if (line.startsWith('## ')) {
      if (currentSection) {
        currentSection.content = currentContent.trim();
        sections.push(currentSection);
      }
      currentSection = {
        title: line.replace(/^##\s*/, '').trim(),
        content: ''
      };
      currentContent = '';
    } else if (line.startsWith('# ')) {
      if (currentSection) {
        currentSection.content = currentContent.trim();
        sections.push(currentSection);
      }
      currentSection = {
        title: line.replace(/^#\s*/, '').trim(),
        content: ''
      };
      currentContent = '';
    } else if (currentSection) {
      currentContent += line + '\n';
    } else {
      currentSection = {
        title: 'Основной материал',
        content: line + '\n'
      };
    }
  }

  // Save the last section
  if (currentSection) {
    currentSection.content = currentContent.trim();
    sections.push(currentSection);
  }

  // If no sections were found, create one
  if (sections.length === 0) {
    sections.push({
      title: 'Содержание урока',
      content: content
    });
  }

  return sections;
}

/**
 * Convert lesson plan to steps format
 */
export function convertPlanToSteps(plan: any): any[] {
  const steps = [];

  // Main content step
  if (plan.content) {
    steps.push({
      step: 1,
      type: 'content',
      title: 'Основной материал',
      description: plan.content,
      duration: Math.floor(parseInt(plan.duration) * 0.6) || 30,
      content: plan.content
    });
  }

  // Practice steps
  if (plan.practice && plan.practice.length > 0) {
    plan.practice.forEach((practice: any, index: number) => {
      steps.push({
        step: steps.length + 1,
        type: 'practice',
        title: `Практика ${index + 1}: ${practice.type}`,
        description: practice.description,
        duration: Math.floor(parseInt(plan.duration) * 0.2 / plan.practice.length) || 5,
        content: `${practice.description}\n\nПример: ${practice.example}`
      });
    });
  }

  // Assessment step
  if (plan.assessment) {
    steps.push({
      step: steps.length + 1,
      type: 'assessment',
      title: 'Проверка знаний',
      description: plan.assessment,
      duration: Math.floor(parseInt(plan.duration) * 0.2) || 10,
      content: plan.assessment
    });
  }

  return steps;
}




