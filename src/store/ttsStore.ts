/**
 * TTS Store - Zustand-like API for text-to-speech state
 */

import type { TTSStore } from './types';
import { logger } from '@/utils/logger';

type TTSStoreListener = (state: TTSStore) => void;

class TTSStoreImpl implements TTSStore {
  private listeners: Set<TTSStoreListener> = new Set();

  // State
  isEnabled = false;
  isSpeaking = false;
  currentSentence = 0;
  totalSentences = 0;
  error: Error | null = null;
  model = 'tts-1';
  voice = 'nova';

  /**
   * Subscribe to store changes
   */
  subscribe(listener: TTSStoreListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  /**
   * Get current state
   */
  getState(): TTSStore {
    return {
      isEnabled: this.isEnabled,
      isSpeaking: this.isSpeaking,
      currentSentence: this.currentSentence,
      totalSentences: this.totalSentences,
      error: this.error,
      model: this.model,
      voice: this.voice,
      setIsEnabled: this.setIsEnabled.bind(this),
      setIsSpeaking: this.setIsSpeaking.bind(this),
      setCurrentSentence: this.setCurrentSentence.bind(this),
      setTotalSentences: this.setTotalSentences.bind(this),
      incrementSentence: this.incrementSentence.bind(this),
      resetProgress: this.resetProgress.bind(this),
      setError: this.setError.bind(this),
      setModel: this.setModel.bind(this),
      setVoice: this.setVoice.bind(this),
      getProgress: this.getProgress.bind(this),
      isComplete: this.isComplete.bind(this),
    };
  }

  // ============= ACTIONS =============

  setIsEnabled(enabled: boolean): void {
    if (this.isEnabled === enabled) return;
    logger.debug('Setting TTS enabled', { enabled });
    this.isEnabled = enabled;
    if (!enabled) {
      this.resetProgress();
    }
    this.notifyListeners();
  }

  setIsSpeaking(speaking: boolean): void {
    if (this.isSpeaking === speaking) return;
    logger.debug('Setting speaking state', { speaking });
    this.isSpeaking = speaking;
    this.notifyListeners();
  }

  setCurrentSentence(sentence: number): void {
    logger.debug('Setting current sentence', { sentence });
    this.currentSentence = Math.max(0, sentence);
    this.error = null;
    this.notifyListeners();
  }

  setTotalSentences(total: number): void {
    logger.debug('Setting total sentences', { total });
    this.totalSentences = Math.max(0, total);
    this.error = null;
    this.notifyListeners();
  }

  incrementSentence(): void {
    this.setCurrentSentence(this.currentSentence + 1);
  }

  resetProgress(): void {
    logger.debug('Resetting progress');
    this.currentSentence = 0;
    this.totalSentences = 0;
    this.isSpeaking = false;
    this.error = null;
    this.notifyListeners();
  }

  setError(error: Error | null): void {
    if (error) {
      logger.error('TTS store error', error);
    }
    this.error = error;
    this.notifyListeners();
  }

  setModel(model: string): void {
    logger.debug('Setting TTS model', { model });
    this.model = model;
    this.notifyListeners();
  }

  setVoice(voice: string): void {
    logger.debug('Setting TTS voice', { voice });
    this.voice = voice;
    this.notifyListeners();
  }

  // ============= COMPUTED =============

  getProgress(): number {
    if (this.totalSentences === 0) return 0;
    return Math.round((this.currentSentence / this.totalSentences) * 100);
  }

  isComplete(): boolean {
    return this.totalSentences > 0 && this.currentSentence >= this.totalSentences;
  }
}

export const ttsStore = new TTSStoreImpl();

export const useTTSStore = (): TTSStore => ttsStore.getState();

export const subscribeToTTSStore = (listener: TTSStoreListener): (() => void) => {
  return ttsStore.subscribe(listener);
};

export default ttsStore;

