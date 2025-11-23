/**
 * Audio Model Module
 * State management and utilities for audio/TTS functionality
 * @module features/chat/model/audioModel
 */

import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook for managing audio and TTS state
 */
export function useAudioModel() {
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const [isGeneratingTTS, setIsGeneratingTTS] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [totalSentences, setTotalSentences] = useState(0);
  const [ttsInterrupted, setTtsInterrupted] = useState(false);

  // Refs for audio management
  const ttsContinueRef = useRef<boolean>(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const soundIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const interruptionCheckIntervalsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  /**
   * Initialize audio context
   */
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  /**
   * Play a beep sound
   */
  const playBeep = useCallback(async (
    frequency: number = 800,
    duration: number = 200,
    type: OscillatorType = 'sine'
  ) => {
    try {
      const audioContext = initAudioContext();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Could not play audio feedback:', error);
    }
  }, [initAudioContext]);

  /**
   * Start continuous sound (for thinking/loading states)
   */
  const startContinuousSound = useCallback((
    frequency: number = 600,
    interval: number = 800
  ) => {
    if (soundIntervalRef.current) {
      clearInterval(soundIntervalRef.current);
    }

    soundIntervalRef.current = setInterval(() => {
      playBeep(frequency, 100, 'sine');
    }, interval);
  }, [playBeep]);

  /**
   * Stop continuous sound
   */
  const stopContinuousSound = useCallback(() => {
    if (soundIntervalRef.current) {
      clearInterval(soundIntervalRef.current);
      soundIntervalRef.current = null;
    }
  }, []);

  /**
   * Clear all interruption check intervals
   */
  const clearAllInterruptionChecks = useCallback(() => {
    interruptionCheckIntervalsRef.current.forEach(interval => {
      clearInterval(interval);
    });
    interruptionCheckIntervalsRef.current.clear();
  }, []);

  /**
   * Toggle TTS on/off
   */
  const toggleTTS = useCallback(() => {
    setIsTtsEnabled(prev => !prev);
  }, []);

  /**
   * Stop current audio playback
   */
  const stopAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    ttsContinueRef.current = false;
    setSpeakingMessageId(null);
    setIsGeneratingTTS(false);
    stopContinuousSound();
    clearAllInterruptionChecks();
  }, [stopContinuousSound, clearAllInterruptionChecks]);

  /**
   * Cleanup audio resources
   */
  const cleanupAudio = useCallback(() => {
    stopAudio();
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, [stopAudio]);

  return {
    // State
    speakingMessageId,
    isTtsEnabled,
    isGeneratingTTS,
    currentSentence,
    totalSentences,
    ttsInterrupted,

    // Refs
    ttsContinueRef,
    audioContextRef,
    currentAudioRef,
    soundIntervalRef,
    interruptionCheckIntervalsRef,

    // Setters
    setSpeakingMessageId,
    setIsTtsEnabled,
    setIsGeneratingTTS,
    setCurrentSentence,
    setTotalSentences,
    setTtsInterrupted,

    // Actions
    initAudioContext,
    playBeep,
    startContinuousSound,
    stopContinuousSound,
    clearAllInterruptionChecks,
    toggleTTS,
    stopAudio,
    cleanupAudio
  };
}

/**
 * Split text into sentences for TTS
 */
export function splitIntoSentences(text: string): string[] {
  if (!text) return [];

  // Split by periods, exclamation marks, question marks
  const sentences = text
    .split(/([.!?]+\s+)/)
    .filter(s => s.trim().length > 0);

  // Combine sentence text with punctuation
  const result: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) {
    const sentence = sentences[i];
    const punctuation = sentences[i + 1] || '';
    result.push(sentence + punctuation);
  }

  return result.filter(s => s.trim().length > 2);
}





