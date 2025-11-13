/**
 * Speech Recognition utility functions
 */

import type { SpeechRecognition, SpeechRecognitionEvent } from '@/types';
import { logger } from './logger';

/**
 * Check if Speech Recognition API is available in the browser
 */
export const isSpeechRecognitionAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;

  const SpeechRecognitionAPI =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  return Boolean(SpeechRecognitionAPI);
};

/**
 * Initialize Speech Recognition instance
 */
export const initializeSpeechRecognition = (): SpeechRecognition | null => {
  if (!isSpeechRecognitionAvailable()) {
    logger.warn('Speech Recognition API not available');
    return null;
  }

  try {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognitionAPI() as SpeechRecognition;

    // Default settings
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ru-RU';

    logger.debug('Speech Recognition initialized');
    return recognition;
  } catch (error) {
    logger.error('Failed to initialize Speech Recognition', error as Error);
    return null;
  }
};

/**
 * Setup event listeners for Speech Recognition
 */
export const setupSpeechRecognitionListeners = (
  recognition: SpeechRecognition,
  callbacks: {
    onStart?: () => void;
    onResult?: (transcript: string, isFinal: boolean) => void;
    onError?: (error: string) => void;
    onEnd?: () => void;
  }
): void => {
  recognition.onstart = () => {
    logger.debug('Speech recognition started');
    callbacks.onStart?.();
  };

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      const isFinal = event.results[i].isFinal;

      if (isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    const currentTranscript = finalTranscript || interimTranscript;
    callbacks.onResult?.(currentTranscript, Boolean(finalTranscript));
  };

  recognition.onerror = (event: any) => {
    logger.error(`Speech recognition error: ${event.error}`);
    callbacks.onError?.(event.error);
  };

  recognition.onend = () => {
    logger.debug('Speech recognition ended');
    callbacks.onEnd?.();
  };
};

/**
 * Start listening with Speech Recognition
 */
export const startListeningWithSpeechRecognition = (
  recognition: SpeechRecognition | null
): boolean => {
  if (!recognition) {
    logger.warn('Speech Recognition not initialized');
    return false;
  }

  try {
    recognition.start();
    logger.debug('Started listening');
    return true;
  } catch (error) {
    logger.error('Failed to start listening', error as Error);
    return false;
  }
};

/**
 * Stop listening with Speech Recognition
 */
export const stopListeningWithSpeechRecognition = (
  recognition: SpeechRecognition | null
): boolean => {
  if (!recognition) {
    logger.warn('Speech Recognition not initialized');
    return false;
  }

  try {
    recognition.stop();
    logger.debug('Stopped listening');
    return true;
  } catch (error) {
    logger.error('Failed to stop listening', error as Error);
    return false;
  }
};

/**
 * Abort speech recognition
 */
export const abortSpeechRecognition = (
  recognition: SpeechRecognition | null
): void => {
  if (recognition) {
    try {
      recognition.abort();
      logger.debug('Speech recognition aborted');
    } catch (error) {
      logger.error('Failed to abort speech recognition', error as Error);
    }
  }
};

/**
 * Set language for speech recognition
 */
export const setSpeechRecognitionLanguage = (
  recognition: SpeechRecognition,
  language: string
): void => {
  try {
    recognition.lang = language;
    logger.debug(`Speech recognition language set to: ${language}`);
  } catch (error) {
    logger.error('Failed to set speech recognition language', error as Error);
  }
};

/**
 * Get supported languages
 */
export const SUPPORTED_LANGUAGES = {
  ru: 'ru-RU',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  zh: 'zh-CN',
  ja: 'ja-JP',
} as const;

export type SupportedLanguageCode = keyof typeof SUPPORTED_LANGUAGES;

export const getSpeechRecognitionLanguage = (
  code: SupportedLanguageCode
): string | undefined => {
  return SUPPORTED_LANGUAGES[code];
};

