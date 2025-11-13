/**
 * Audio processing utility functions
 */

import type { BeepOptions, AudioContextOptions } from '@/types';
import { logger } from './logger';

let audioContext: AudioContext | null = null;

/**
 * Initialize Web Audio Context
 */
export const initializeAudioContext = (): AudioContext | null => {
  if (audioContext) return audioContext;

  try {
    const AudioContextConstructor =
      (window as any).AudioContext || (window as any).webkitAudioContext;

    if (!AudioContextConstructor) {
      logger.warn('Web Audio API not supported');
      return null;
    }

    audioContext = new AudioContextConstructor();
    logger.debug('Audio context initialized');
    return audioContext;
  } catch (error) {
    logger.error('Failed to initialize audio context', error as Error);
    return null;
  }
};

/**
 * Get or create audio context
 */
export const getAudioContext = (): AudioContext | null => {
  if (!audioContext) {
    return initializeAudioContext();
  }
  return audioContext;
};

/**
 * Resume audio context (required by browsers)
 */
export const resumeAudioContext = async (): Promise<void> => {
  const context = getAudioContext();
  if (context && context.state === 'suspended') {
    try {
      await context.resume();
      logger.debug('Audio context resumed');
    } catch (error) {
      logger.error('Failed to resume audio context', error as Error);
    }
  }
};

/**
 * Play a beep sound
 */
export const playBeep = async (
  frequency: number = 800,
  duration: number = 200,
  type: OscillatorType = 'sine'
): Promise<void> => {
  try {
    const context = getAudioContext();
    if (!context) {
      logger.warn('Audio context not available');
      return;
    }

    // Resume context if suspended
    await resumeAudioContext();

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    // Fade in
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.05);

    // Fade out
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + duration / 1000);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration / 1000);

    logger.debug(`Beep played: ${frequency}Hz for ${duration}ms`);
  } catch (error) {
    logger.error('Failed to play beep', error as Error);
  }
};

/**
 * Play continuous sound (for thinking indicator)
 */
export const startContinuousSound = (
  frequency: number = 600,
  duration: number = 2000
): NodeJS.Timeout | null => {
  try {
    const context = getAudioContext();
    if (!context) {
      logger.warn('Audio context not available');
      return null;
    }

    const intervalId = setInterval(() => {
      playBeep(frequency, 100, 'sine').catch(err => {
        logger.error('Error in continuous beep', err);
      });
    }, 300);

    // Auto-stop after duration
    setTimeout(() => {
      clearInterval(intervalId);
    }, duration);

    logger.debug(`Continuous sound started: ${frequency}Hz`);
    return intervalId;
  } catch (error) {
    logger.error('Failed to start continuous sound', error as Error);
    return null;
  }
};

/**
 * Stop continuous sound
 */
export const stopContinuousSound = (intervalId: NodeJS.Timeout | null): void => {
  if (intervalId) {
    clearInterval(intervalId);
    logger.debug('Continuous sound stopped');
  }
};

/**
 * Get audio input devices
 */
export const getAudioInputDevices = async (): Promise<MediaDeviceInfo[]> => {
  try {
    if (!navigator.mediaDevices?.enumerateDevices) {
      logger.warn('enumerateDevices not supported');
      return [];
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputs = devices.filter(device => device.kind === 'audioinput');

    logger.debug(`Found ${audioInputs.length} audio input devices`);
    return audioInputs;
  } catch (error) {
    logger.error('Failed to get audio input devices', error as Error);
    return [];
  }
};

/**
 * Request microphone access
 */
export const requestMicrophoneAccess = async (): Promise<MediaStream | null> => {
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      logger.warn('getUserMedia not supported');
      return null;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    logger.debug('Microphone access granted');
    return stream;
  } catch (error) {
    logger.error('Failed to get microphone access', error as Error);
    return null;
  }
};

/**
 * Release microphone stream
 */
export const releaseMicrophoneStream = (stream: MediaStream | null): void => {
  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
    logger.debug('Microphone stream released');
  }
};

/**
 * Check if microphone is available
 */
export const isMicrophoneAvailable = async (): Promise<boolean> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some(device => device.kind === 'audioinput');
  } catch (error) {
    logger.error('Failed to check microphone availability', error as Error);
    return false;
  }
};

/**
 * Get audio volume from stream
 */
export const getAudioVolume = (analyser: AnalyserNode): number => {
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);

  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i];
  }

  return Math.round(sum / dataArray.length);
};

/**
 * Create analyser node for audio visualization
 */
export const createAnalyserNode = (stream: MediaStream): AnalyserNode | null => {
  try {
    const context = getAudioContext();
    if (!context) return null;

    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();

    analyser.fftSize = 256;
    source.connect(analyser);

    return analyser;
  } catch (error) {
    logger.error('Failed to create analyser node', error as Error);
    return null;
  }
};

