/**
 * React hooks for stores
 * Integrates store subscriptions with React re-renders
 */

import { useEffect, useState } from 'react';
import type {
  ChatStore,
  VoiceStore,
  TTSStore,
  FileStore,
  AssessmentStore,
  UIStore,
} from './types';
import { chatStore } from './chatStore';
import { voiceStore } from './voiceStore';
import { ttsStore } from './ttsStore';
import { fileStore } from './fileStore';
import { assessmentStore } from './assessmentStore';
import { uiStore } from './uiStore';
import { logger } from '@/utils/logger';

/**
 * Hook for Chat store
 */
export const useChatStore = (): ChatStore => {
  const [state, setState] = useState<ChatStore>(chatStore.getState());

  useEffect(() => {
    logger.debug('Subscribing to chat store');
    const unsubscribe = chatStore.subscribe(setState);
    return () => {
      unsubscribe();
      logger.debug('Unsubscribed from chat store');
    };
  }, []);

  return state;
};

/**
 * Hook for Voice store
 */
export const useVoiceStore = (): VoiceStore => {
  const [state, setState] = useState<VoiceStore>(voiceStore.getState());

  useEffect(() => {
    logger.debug('Subscribing to voice store');
    const unsubscribe = voiceStore.subscribe(setState);
    return () => {
      unsubscribe();
      logger.debug('Unsubscribed from voice store');
    };
  }, []);

  return state;
};

/**
 * Hook for TTS store
 */
export const useTTSStore = (): TTSStore => {
  const [state, setState] = useState<TTSStore>(ttsStore.getState());

  useEffect(() => {
    logger.debug('Subscribing to TTS store');
    const unsubscribe = ttsStore.subscribe(setState);
    return () => {
      unsubscribe();
      logger.debug('Unsubscribed from TTS store');
    };
  }, []);

  return state;
};

/**
 * Hook for File store
 */
export const useFileStore = (): FileStore => {
  const [state, setState] = useState<FileStore>(fileStore.getState());

  useEffect(() => {
    logger.debug('Subscribing to file store');
    const unsubscribe = fileStore.subscribe(setState);
    return () => {
      unsubscribe();
      logger.debug('Unsubscribed from file store');
    };
  }, []);

  return state;
};

/**
 * Hook for Assessment store
 */
export const useAssessmentStore = (): AssessmentStore => {
  const [state, setState] = useState<AssessmentStore>(assessmentStore.getState());

  useEffect(() => {
    logger.debug('Subscribing to assessment store');
    const unsubscribe = assessmentStore.subscribe(setState);
    return () => {
      unsubscribe();
      logger.debug('Unsubscribed from assessment store');
    };
  }, []);

  return state;
};

/**
 * Hook for UI store
 */
export const useUIStore = (): UIStore => {
  const [state, setState] = useState<UIStore>(uiStore.getState());

  useEffect(() => {
    logger.debug('Subscribing to UI store');
    const unsubscribe = uiStore.subscribe(setState);
    return () => {
      unsubscribe();
      logger.debug('Unsubscribed from UI store');
    };
  }, []);

  return state;
};

/**
 * Combined hook for all stores
 */
export const useAppStore = () => {
  const chat = useChatStore();
  const voice = useVoiceStore();
  const tts = useTTSStore();
  const files = useFileStore();
  const assessment = useAssessmentStore();
  const ui = useUIStore();

  return {
    chat,
    voice,
    tts,
    files,
    assessment,
    ui,
  };
};

export default useAppStore;

