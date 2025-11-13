/**
 * useTextToSpeech Hook - Manage TTS functionality
 */

import { useState, useCallback, useRef } from 'react';
import type { UseTextToSpeechReturn, AudioSpeechRequest, AppError } from '@/types';
import { OpenAITTS } from '@/lib/openaiTTS';
import { handleApiError } from '@/services/api/errorHandler';
import { logger } from '@/utils/logger';

interface UseTextToSpeechOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: AppError) => void;
}

export const useTextToSpeech = (options: UseTextToSpeechOptions = {}): UseTextToSpeechReturn => {
  const { onStart, onEnd, onError } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [totalSentences, setTotalSentences] = useState(0);
  const [error, setError] = useState<AppError | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Split text into sentences
   */
  const splitIntoSentences = useCallback((text: string): string[] => {
    return text
      .split(/([.!?])\s+/)
      .reduce((acc: string[], item, index, arr) => {
        if (index % 2 === 0 && item) {
          const sentence = item + (arr[index + 1] || '');
          if (sentence.trim()) {
            acc.push(sentence.trim());
          }
        }
        return acc;
      }, []);
  }, []);

  /**
   * Speak text sentence by sentence
   */
  const speak = useCallback(
    async (text: string, options?: Partial<AudioSpeechRequest>) => {
      try {
        setError(null);
        onStart?.();
        setIsSpeaking(true);

        const sentences = splitIntoSentences(text);
        setTotalSentences(sentences.length);

        abortControllerRef.current = new AbortController();

        for (let i = 0; i < sentences.length; i++) {
          if (abortControllerRef.current?.signal.aborted) {
            break;
          }

          setCurrentSentence(i + 1);

          const sentence = sentences[i];
          logger.debug(`Speaking sentence ${i + 1}/${sentences.length}`, { length: sentence.length });

          try {
            await OpenAITTS.speak(sentence, options);
          } catch (err) {
            const appError = handleApiError(err);
            setError(appError);
            onError?.(appError);
            logger.error('TTS error for sentence', err as Error);

            // Continue with next sentence instead of breaking
            continue;
          }
        }

        logger.debug('All sentences spoken');
        setIsSpeaking(false);
        onEnd?.();
      } catch (err) {
        const appError = handleApiError(err);
        setError(appError);
        onError?.(appError);
        logger.error('TTS error', err as Error);
        setIsSpeaking(false);
      }
    },
    [splitIntoSentences, onStart, onEnd, onError]
  );

  /**
   * Stop speaking
   */
  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    OpenAITTS.stop();
    setIsSpeaking(false);
    setCurrentSentence(0);
    setTotalSentences(0);

    logger.debug('TTS stopped');
    onEnd?.();
  }, [onEnd]);

  /**
   * Pause (same as stop for now)
   */
  const pause = useCallback(() => {
    stop();
  }, [stop]);

  /**
   * Resume (not fully implemented yet)
   */
  const resume = useCallback(() => {
    logger.warn('Resume not yet implemented');
  }, []);

  /**
   * Get progress
   */
  const getProgress = useCallback((): number => {
    if (totalSentences === 0) return 0;
    return Math.round((currentSentence / totalSentences) * 100);
  }, [currentSentence, totalSentences]);

  /**
   * Check if TTS is available
   */
  const isAvailable = useCallback((): boolean => {
    return OpenAITTS.isAvailable();
  }, []);

  return {
    isSpeaking,
    currentSentence,
    totalSentences,
    speak,
    stop,
    pause,
    resume,
    getProgress,
    isAvailable,
    error,
  };
};

export default useTextToSpeech;

