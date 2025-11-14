import { useEffect, useState, useCallback, useRef } from 'react';
import { VoiceComm, VoiceCommOptions, VoiceCommCallbacks } from '@/lib/voiceComm';

/**
 * Хук для управления голосовым общением в компонентах
 * Автоматически инициализирует и очищает VoiceComm
 */

export interface UseVoiceCommOptions {
  enabled?: boolean;
  language?: string;
  ttsVoice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  ttsSpeed?: number;
  continuous?: boolean;
}

export interface UseVoiceCommReturn {
  // Состояние
  isListening: boolean;
  isPlaying: boolean;
  interimTranscript: string;
  finalTranscript: string;
  isAvailable: boolean;
  error: string | null;

  // Методы для STT (Speech-to-Text)
  startListening: () => boolean;
  stopListening: () => void;
  abortListening: () => void;

  // Методы для TTS (Text-to-Speech)
  speak: (text: string) => Promise<void>;
  stopSpeaking: () => void;

  // Утилиты
  reset: () => void;
  getStatus: () => ReturnType<typeof VoiceComm.getStatus>;
}

export const useVoiceComm = (
  options: UseVoiceCommOptions = {},
  onTranscriptCallback?: (text: string, isFinal: boolean) => void
): UseVoiceCommReturn => {
  // Состояние
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs для отслеживания состояния
  const initializedRef = useRef(false);
  const enabledRef = useRef(options.enabled !== false);

  // Инициализация
  useEffect(() => {
    if (!enabledRef.current || initializedRef.current) return;

    console.log('🎤 Initializing useVoiceComm hook...');
    initializedRef.current = true;

    const voiceOptions: VoiceCommOptions = {
      language: options.language || 'ru-RU',
      ttsVoice: options.ttsVoice || 'nova',
      ttsSpeed: options.ttsSpeed || 1.0,
      continuous: options.continuous || false
    };

    const callbacks: VoiceCommCallbacks = {
      onListeningStart: () => {
        console.log('🎙️ Listening started (hook)');
        setIsListening(true);
        setInterimTranscript('');
        setError(null);
      },

      onListeningEnd: () => {
        console.log('🛑 Listening ended (hook)');
        setIsListening(false);
      },

      onTranscript: (text: string, isFinal: boolean) => {
        if (isFinal) {
          console.log('✅ Final transcript (hook):', text);
          setFinalTranscript(text);
          setInterimTranscript('');
        } else {
          console.log('🔄 Interim transcript (hook):', text);
          setInterimTranscript(text);
        }

        // Вызываем внешний коллбэк если передан
        onTranscriptCallback?.(text, isFinal);
      },

      onError: (errorMessage: string) => {
        console.error('❌ Voice error (hook):', errorMessage);
        setError(errorMessage);
        setIsListening(false);
      },

      onPlayStart: () => {
        console.log('🔊 TTS started (hook)');
        setIsPlaying(true);
        setError(null);
      },

      onPlayEnd: () => {
        console.log('🔊 TTS ended (hook)');
        setIsPlaying(false);
      }
    };

    // Инициализируем VoiceComm
    const available = VoiceComm.init(voiceOptions, callbacks);
    setIsAvailable(available);

    if (!available) {
      console.warn('⚠️ Voice Communication not available in this browser');
      setError('Голосовое общение не поддерживается браузером');
    }

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up useVoiceComm hook...');
      VoiceComm.cleanup();
      initializedRef.current = false;
    };
  }, [options.language, options.ttsVoice, options.ttsSpeed, options.continuous, onTranscriptCallback]);

  // Методы для STT
  const startListening = useCallback((): boolean => {
    if (!isAvailable) {
      setError('Голосовое распознавание недоступно');
      return false;
    }

    if (isListening) {
      console.warn('⚠️ Already listening');
      return false;
    }

    return VoiceComm.startListening();
  }, [isAvailable, isListening]);

  const stopListening = useCallback((): void => {
    VoiceComm.stopListening();
  }, []);

  const abortListening = useCallback((): void => {
    VoiceComm.abortListening();
  }, []);

  // Методы для TTS
  const speak = useCallback(
    async (text: string): Promise<void> => {
      if (!isAvailable) {
        setError('Синтез речи недоступен');
        return;
      }

      if (!text || text.trim().length === 0) {
        setError('Текст для озвучивания не может быть пустым');
        return;
      }

      try {
        setError(null);
        await VoiceComm.speakText(text, {
          language: options.language,
          ttsVoice: options.ttsVoice,
          ttsSpeed: options.ttsSpeed
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка при озвучивании';
        setError(errorMessage);
        console.error('❌ Error speaking:', err);
      }
    },
    [isAvailable, options.language, options.ttsVoice, options.ttsSpeed]
  );

  const stopSpeaking = useCallback((): void => {
    VoiceComm.stopSpeaking();
  }, []);

  // Утилиты
  const reset = useCallback((): void => {
    console.log('🔄 Resetting voice communication (hook)');
    VoiceComm.reset();
    setIsListening(false);
    setIsPlaying(false);
    setInterimTranscript('');
    setFinalTranscript('');
    setError(null);
  }, []);

  const getStatus = useCallback((): ReturnType<typeof VoiceComm.getStatus> => {
    return VoiceComm.getStatus();
  }, []);

  return {
    // Состояние
    isListening,
    isPlaying,
    interimTranscript,
    finalTranscript,
    isAvailable,
    error,

    // Методы для STT
    startListening,
    stopListening,
    abortListening,

    // Методы для TTS
    speak,
    stopSpeaking,

    // Утилиты
    reset,
    getStatus
  };
};

