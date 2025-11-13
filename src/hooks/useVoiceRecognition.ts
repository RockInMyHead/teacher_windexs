/**
 * useVoiceRecognition Hook - Manage speech recognition
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { UseVoiceRecognitionReturn, SpeechRecognition, AppError } from '@/types';
import {
  isSpeechRecognitionAvailable,
  initializeSpeechRecognition,
  setupSpeechRecognitionListeners,
  startListeningWithSpeechRecognition,
  stopListeningWithSpeechRecognition,
  setSpeechRecognitionLanguage,
} from '@/utils/speechRecognition';
import { handleApiError } from '@/services/api/errorHandler';
import { logger } from '@/utils/logger';

interface UseVoiceRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: AppError) => void;
}

export const useVoiceRecognition = (
  options: UseVoiceRecognitionOptions = {}
): UseVoiceRecognitionReturn => {
  const {
    language = 'ru-RU',
    continuous = true,
    interimResults = true,
    onTranscript,
    onError,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [error, setError] = useState<AppError | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const interimRef = useRef('');
  const finalRef = useRef('');

  /**
   * Initialize speech recognition
   */
  useEffect(() => {
    if (!recognitionRef.current && isSpeechRecognitionAvailable()) {
      const recognition = initializeSpeechRecognition();
      if (recognition) {
        recognition.continuous = continuous;
        recognition.interimResults = interimResults;
        recognitionRef.current = recognition;

        setupSpeechRecognitionListeners(recognition, {
          onStart: () => {
            logger.debug('Speech recognition started');
            setIsListening(true);
          },
          onResult: (transcript: string, isFinal: boolean) => {
            if (isFinal) {
              finalRef.current = transcript;
              setFinalTranscript(transcript);
              interimRef.current = '';
              setInterimTranscript('');
            } else {
              interimRef.current = transcript;
              setInterimTranscript(transcript);
            }
            onTranscript?.(transcript, isFinal);
          },
          onError: (errorCode: string) => {
            const appError = new Error(`Speech recognition error: ${errorCode}`);
            const error = handleApiError(appError);
            setError(error);
            onError?.(error);
            logger.error(`Speech recognition error: ${errorCode}`);
          },
          onEnd: () => {
            logger.debug('Speech recognition ended');
            setIsListening(false);
          },
        });

        setSpeechRecognitionLanguage(recognition, language);
      }
    }

    return () => {
      // Cleanup not needed as we reuse the same instance
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Update language
   */
  useEffect(() => {
    if (recognitionRef.current) {
      setSpeechRecognitionLanguage(recognitionRef.current, language);
    }
  }, [language]);

  /**
   * Start listening
   */
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      const appError = new Error('Speech recognition not initialized');
      const error = handleApiError(appError);
      setError(error);
      onError?.(error);
      return;
    }

    // Reset transcripts
    interimRef.current = '';
    finalRef.current = '';
    setInterimTranscript('');
    setFinalTranscript('');

    const success = startListeningWithSpeechRecognition(recognitionRef.current);
    if (!success) {
      const appError = new Error('Failed to start listening');
      const error = handleApiError(appError);
      setError(error);
      onError?.(error);
    }
  }, [onError]);

  /**
   * Stop listening
   */
  const stopListening = useCallback(() => {
    const success = stopListeningWithSpeechRecognition(recognitionRef.current);
    if (!success) {
      const appError = new Error('Failed to stop listening');
      const error = handleApiError(appError);
      setError(error);
      onError?.(error);
    }
  }, [onError]);

  /**
   * Abort recognition
   */
  const abort = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      setIsListening(false);
      logger.debug('Speech recognition aborted');
    }
  }, []);

  /**
   * Get current transcript
   */
  const getTranscript = useCallback((): string => {
    return finalRef.current || interimRef.current;
  }, []);

  /**
   * Clear transcripts
   */
  const clearTranscripts = useCallback(() => {
    interimRef.current = '';
    finalRef.current = '';
    setInterimTranscript('');
    setFinalTranscript('');
  }, []);

  /**
   * Check if available
   */
  const isAvailable = useCallback((): boolean => {
    return isSpeechRecognitionAvailable();
  }, []);

  return {
    isListening,
    interimTranscript,
    finalTranscript,
    startListening,
    stopListening,
    abort,
    getTranscript,
    clearTranscripts,
    isAvailable,
    error,
  };
};

export default useVoiceRecognition;

