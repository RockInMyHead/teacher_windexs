/**
 * Voice Store - Zustand-like API for voice chat state
 */

import type { VoiceStore } from './types';
import { logger } from '@/utils/logger';

type VoiceStoreListener = (state: VoiceStore) => void;

class VoiceStoreImpl implements VoiceStore {
  private listeners: Set<VoiceStoreListener> = new Set();

  // State
  isVoiceChatActive = false;
  isListening = false;
  isSpeaking = false;
  interimTranscript = '';
  finalTranscript = '';
  error: Error | null = null;
  language = 'ru-RU';

  /**
   * Subscribe to store changes
   */
  subscribe(listener: VoiceStoreListener): () => void {
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
  getState(): VoiceStore {
    return {
      isVoiceChatActive: this.isVoiceChatActive,
      isListening: this.isListening,
      isSpeaking: this.isSpeaking,
      interimTranscript: this.interimTranscript,
      finalTranscript: this.finalTranscript,
      error: this.error,
      language: this.language,
      setVoiceChatActive: this.setVoiceChatActive.bind(this),
      setIsListening: this.setIsListening.bind(this),
      setIsSpeaking: this.setIsSpeaking.bind(this),
      setInterimTranscript: this.setInterimTranscript.bind(this),
      setFinalTranscript: this.setFinalTranscript.bind(this),
      addTranscript: this.addTranscript.bind(this),
      clearTranscripts: this.clearTranscripts.bind(this),
      setError: this.setError.bind(this),
      setLanguage: this.setLanguage.bind(this),
      getFullTranscript: this.getFullTranscript.bind(this),
    };
  }

  // ============= ACTIONS =============

  setVoiceChatActive(active: boolean): void {
    if (this.isVoiceChatActive === active) return;
    logger.debug('Setting voice chat active', { active });
    this.isVoiceChatActive = active;
    if (!active) {
      this.clearTranscripts();
      this.setIsListening(false);
      this.setIsSpeaking(false);
    }
    this.notifyListeners();
  }

  setIsListening(listening: boolean): void {
    if (this.isListening === listening) return;
    logger.debug('Setting listening state', { listening });
    this.isListening = listening;
    this.notifyListeners();
  }

  setIsSpeaking(speaking: boolean): void {
    if (this.isSpeaking === speaking) return;
    logger.debug('Setting speaking state', { speaking });
    this.isSpeaking = speaking;
    this.notifyListeners();
  }

  setInterimTranscript(transcript: string): void {
    logger.debug('Setting interim transcript', { length: transcript.length });
    this.interimTranscript = transcript;
    this.error = null;
    this.notifyListeners();
  }

  setFinalTranscript(transcript: string): void {
    logger.debug('Setting final transcript', { length: transcript.length });
    this.finalTranscript = transcript;
    this.interimTranscript = ''; // Clear interim when final is set
    this.error = null;
    this.notifyListeners();
  }

  addTranscript(transcript: string): void {
    logger.debug('Adding transcript', { length: transcript.length });
    this.finalTranscript += (this.finalTranscript ? ' ' : '') + transcript;
    this.error = null;
    this.notifyListeners();
  }

  clearTranscripts(): void {
    logger.debug('Clearing transcripts');
    this.interimTranscript = '';
    this.finalTranscript = '';
    this.error = null;
    this.notifyListeners();
  }

  setError(error: Error | null): void {
    if (error) {
      logger.error('Voice store error', error);
    }
    this.error = error;
    this.notifyListeners();
  }

  setLanguage(language: string): void {
    logger.debug('Setting language', { language });
    this.language = language;
    this.notifyListeners();
  }

  // ============= COMPUTED =============

  getFullTranscript(): string {
    return this.finalTranscript + (this.interimTranscript ? ' ' + this.interimTranscript : '');
  }
}

export const voiceStore = new VoiceStoreImpl();

export const useVoiceStore = (): VoiceStore => voiceStore.getState();

export const subscribeToVoiceStore = (listener: VoiceStoreListener): (() => void) => {
  return voiceStore.subscribe(listener);
};

export default voiceStore;

