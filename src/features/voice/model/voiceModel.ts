/**
 * Voice Model Module
 * State management and business logic for voice interactions
 * @module features/voice/model/voiceModel
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import type { SpeechRecognition, SpeechRecognitionErrorCode } from '../api/speechRecognitionApi';
import { generateVoiceLessonNotes, generateVoiceDynamicContent, generateVoiceLessonSummary, processVoiceCommand } from '../api/voiceApi';

/**
 * Voice lesson state interface
 */
export interface VoiceLessonState {
  // Lesson content
  lessonTitle: string;
  lessonTopic: string;
  lessonAspects: string;

  // Generation state
  isGeneratingLesson: boolean;
  generationStep: string;

  // Lesson content
  lessonNotes: string[];
  currentNoteIndex: number;
  lessonProgress: number;

  // Voice interaction
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  userTranscript: string;

  // Lesson flow
  lessonStarted: boolean;
  callDuration: number;
  isReadingLesson: boolean;

  // Conversation
  conversationHistory: Array<{ role: 'teacher' | 'student'; text: string }>;

  // Language
  selectedLanguage: string;
}

/**
 * Custom hook for managing voice lesson state
 */
export function useVoiceLessonModel(initialData?: {
  lessonTitle: string;
  lessonTopic: string;
  lessonAspects: string;
}) {
  // Initialize state
  const [state, setState] = useState<VoiceLessonState>({
    lessonTitle: initialData?.lessonTitle || '',
    lessonTopic: initialData?.lessonTopic || '',
    lessonAspects: initialData?.lessonAspects || '',
    isGeneratingLesson: false,
    generationStep: '',
    lessonNotes: [],
    currentNoteIndex: 0,
    lessonProgress: 0,
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    userTranscript: '',
    lessonStarted: false,
    callDuration: 0,
    isReadingLesson: false,
    conversationHistory: [],
    selectedLanguage: 'ru-RU'
  });

  // Refs for timers and audio
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const callStartTimeRef = useRef<number | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const thinkingSoundIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Update state partially
   */
  const updateState = useCallback((updates: Partial<VoiceLessonState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Initialize the lesson
   */
  const initializeLesson = useCallback(async () => {
    if (!state.lessonTitle || !state.lessonTopic) return;

    updateState({ isGeneratingLesson: true, generationStep: 'Анализирую тему урока...' });

    try {
      // Simulate generation steps
      setTimeout(() => updateState({ generationStep: 'Изучаю учебный материал...' }), 600);
      setTimeout(() => updateState({ generationStep: 'Создаю заметки урока...' }), 1200);

      // Generate lesson notes
      const notes = await generateVoiceLessonNotes(
        state.lessonTitle,
        state.lessonTopic,
        state.lessonAspects,
        state.selectedLanguage
      );

      updateState({
        lessonNotes: notes,
        isGeneratingLesson: false,
        generationStep: '',
        lessonStarted: true
      });

      // Start call duration timer
      callStartTimeRef.current = Date.now();
      durationIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - (callStartTimeRef.current || 0)) / 1000);
        updateState({ callDuration: elapsed });
      }, 1000);

      // Add initial conversation entry
      updateState({
        conversationHistory: [{
          role: 'teacher',
          text: `Здравствуйте! Сегодня мы изучаем "${state.lessonTitle}". Я буду зачитывать материалы урока, а вы можете задавать вопросы голосом.`
        }]
      });

    } catch (error) {
      console.error('Failed to initialize lesson:', error);
      updateState({
        isGeneratingLesson: false,
        generationStep: 'Ошибка при создании урока. Попробуйте еще раз.'
      });
    }
  }, [state.lessonTitle, state.lessonTopic, state.lessonAspects, state.selectedLanguage, updateState]);

  /**
   * Handle voice input from student
   */
  const handleVoiceInput = useCallback(async (transcript: string) => {
    if (!transcript.trim()) return;

    updateState({
      isProcessing: true,
      userTranscript: transcript
    });

    try {
      // Add student input to conversation
      const newHistory = [...state.conversationHistory, {
        role: 'student',
        text: transcript
      }];
      updateState({ conversationHistory: newHistory });

      // Process the voice input
      const response = await generateVoiceDynamicContent(
        {
          title: state.lessonTitle,
          topic: state.lessonTopic,
          currentNote: state.lessonNotes[state.currentNoteIndex],
          progress: state.lessonProgress
        },
        transcript,
        newHistory,
        state.selectedLanguage
      );

      // Add teacher response to conversation
      updateState({
        conversationHistory: [...newHistory, {
          role: 'teacher',
          text: response
        }],
        isProcessing: false,
        userTranscript: ''
      });

      return response;

    } catch (error) {
      console.error('Failed to process voice input:', error);
      updateState({
        isProcessing: false,
        userTranscript: ''
      });
      return 'Извините, произошла ошибка при обработке вашего вопроса.';
    }
  }, [state, updateState]);

  /**
   * Move to next lesson note
   */
  const nextNote = useCallback(() => {
    if (state.currentNoteIndex < state.lessonNotes.length - 1) {
      const newIndex = state.currentNoteIndex + 1;
      const progress = Math.round(((newIndex + 1) / state.lessonNotes.length) * 100);

      updateState({
        currentNoteIndex: newIndex,
        lessonProgress: progress
      });
    }
  }, [state.currentNoteIndex, state.lessonNotes.length, updateState]);

  /**
   * Repeat current note
   */
  const repeatNote = useCallback(() => {
    // Note will be re-read by the parent component
    console.log('Repeating current note:', state.lessonNotes[state.currentNoteIndex]);
  }, [state.currentNoteIndex, state.lessonNotes]);

  /**
   * Finish the lesson
   */
  const finishLesson = useCallback(async () => {
    try {
      // Generate summary
      const summary = await generateVoiceLessonSummary(
        state.lessonTitle,
        state.conversationHistory,
        Math.floor(state.callDuration / 60)
      );

      updateState({
        conversationHistory: [...state.conversationHistory, {
          role: 'teacher',
          text: summary
        }],
        lessonProgress: 100
      });

      return summary;
    } catch (error) {
      console.error('Failed to generate lesson summary:', error);
      return 'Спасибо за урок! До новых встреч в обучении.';
    }
  }, [state, updateState]);

  /**
   * Reset lesson state
   */
  const resetLesson = useCallback(() => {
    // Clear intervals
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    if (thinkingSoundIntervalRef.current) {
      clearInterval(thinkingSoundIntervalRef.current);
      thinkingSoundIntervalRef.current = null;
    }

    // Reset state
    setState(prev => ({
      ...prev,
      isGeneratingLesson: false,
      generationStep: '',
      lessonNotes: [],
      currentNoteIndex: 0,
      lessonProgress: 0,
      isListening: false,
      isProcessing: false,
      isSpeaking: false,
      userTranscript: '',
      lessonStarted: false,
      callDuration: 0,
      isReadingLesson: false,
      conversationHistory: []
    }));

    callStartTimeRef.current = null;
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (thinkingSoundIntervalRef.current) {
        clearInterval(thinkingSoundIntervalRef.current);
      }
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.abort();
      }
    };
  }, []);

  return {
    // State
    ...state,

    // Actions
    updateState,
    initializeLesson,
    handleVoiceInput,
    nextNote,
    repeatNote,
    finishLesson,
    resetLesson,

    // Refs (for parent components that need direct access)
    speechRecognitionRef,
    audioContextRef
  };
}

/**
 * Custom hook for speech recognition
 */
export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  /**
   * Start speech recognition
   */
  const startListening = useCallback((language: string = 'ru-RU') => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event: any) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  /**
   * Stop speech recognition
   */
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  /**
   * Get final transcript and reset
   */
  const getFinalTranscript = useCallback(() => {
    const finalTranscript = transcript;
    setTranscript('');
    return finalTranscript;
  }, [transcript]);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    getFinalTranscript
  };
}


