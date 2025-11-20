import { replaceNumbersInText } from './numbersToWords';

export interface TTSOptions {
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  speed?: number;
  model?: 'tts-1' | 'tts-1-hd';
  format?: 'aac' | 'mp3' | 'opus' | 'flac';
}

export class OpenAITTS {
  private static audioContext: AudioContext | null = null;
  private static currentAudio: HTMLAudioElement | null = null;
  private static videoElement: HTMLVideoElement | null = null;
  private static currentAudioUrl: string | null = null;

  // Получить правильный MIME тип для аудио формата
  private static getMimeType(format: string): string {
    switch (format) {
      case 'aac': return 'audio/aac';
      case 'mp3': return 'audio/mpeg';
      case 'opus': return 'audio/opus';
      case 'flac': return 'audio/flac';
      default: return 'audio/mpeg';
    }
  }

  // Очистить текст от ударений и специальных символов для TTS
  private static cleanTextForTTS(text: string): string {
    if (!text) return text;

    // Удаляем знаки ударений (+) перед гласными
    let cleaned = text.replace(/\+([аеёиоуыэюя])/gi, '$1');

    // Удаляем другие специальные символы, которые могут мешать TTS
    cleaned = cleaned.replace(/[«»""''""''""]/g, ''); // Убираем кавычки

    // Убираем лишние пробелы
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    return cleaned;
  }

  static async generateSpeech(text: string, options: TTSOptions = {}): Promise<ArrayBuffer> {
    const {
      voice = 'alloy', // alloy - нейтральный мужской голос, хорошо подходит для русского
      speed = 1.0,
      model = 'tts-1',
      format = 'mp3' // MP3 - максимальная совместимость со всеми браузерами
    } = options;

    console.log('🎤 generateSpeech called:', {
      textLength: text.length,
      textPreview: text.substring(0, 50) + '...',
      voice,
      speed,
      model
    });

    // Преобразуем цифры в слова и удаляем ударения (знаки +)
    const processedText = this.cleanTextForTTS(replaceNumbersInText(text));
    console.log('📝 Original text:', text.substring(0, 100) + '...');
    console.log('📝 Processed text:', processedText.substring(0, 100) + '...');
    console.log('📝 Text changed:', text !== processedText);

    console.log('📡 Fetching TTS from:', `${window.location.origin}/api/audio/speech`);
    const response = await fetch(`${window.location.origin}/api/audio/speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        input: processedText,
        voice: voice,
        response_format: format,
        speed: speed,
      }),
    });

    console.log('📡 TTS API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ TTS API error:', errorData);
      throw new Error(`OpenAI TTS API error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log('✅ TTS audio received, size:', arrayBuffer.byteLength, 'bytes');
    return arrayBuffer;
  }

  static async speak(text: string, options: TTSOptions = {}): Promise<void> {
    return this.speakText(text, options);
  }

  static async speakText(text: string, options: TTSOptions = {}): Promise<void> {
    console.log('🎙️ OpenAI TTS speakText called with text:', text.substring(0, 50) + '...');

    try {
      // Проверяем доступность OpenAI TTS
      if (!isTTSAvailable()) {
        console.error('❌ OpenAI TTS not available - missing API key or browser audio support');
        throw new Error('OpenAI TTS not available: missing API key or browser does not support Audio API');
      }
      console.log('✅ OpenAI TTS is available');

      // Force MP3 format for OpenAI TTS compatibility
      if (!options.format) {
        options.format = 'mp3';
      }
      console.log('🎵 OpenAI TTS using format:', options.format);

      // Останавливаем текущее воспроизведение
      this.stop();

      // Генерируем речь
      console.log('🎤 Calling generateSpeech...');
      const audioBuffer = await this.generateSpeech(text, options);
      console.log('✅ generateSpeech completed');

      // OpenAI TTS Priority: Force Web Audio API first, then HTML Audio, then speech synthesis

      console.log('🎵 🎯 PRIORITY: OpenAI TTS - Using Web Audio API (OpenAI voice preferred)...');

      // Always prioritize OpenAI TTS through Web Audio API
      try {
        // Initialize AudioContext for OpenAI TTS
        if (!this.audioContext) {
          this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          console.log('✅ AudioContext initialized for OpenAI TTS');
        }

        // Ensure AudioContext is running for OpenAI TTS
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
          console.log('✅ AudioContext resumed for OpenAI TTS');
        }

        // Decode OpenAI TTS audio buffer
        console.log('🔄 Decoding OpenAI TTS audio buffer...');
        const decodedBuffer = await this.audioContext.decodeAudioData(audioBuffer.slice());
        console.log('✅ OpenAI TTS audio decoded, duration:', decodedBuffer.duration, 'seconds');

        // Create and play OpenAI TTS using Web Audio API
        return new Promise<void>((resolve) => {
          const source = this.audioContext.createBufferSource();
          source.buffer = decodedBuffer;
          source.connect(this.audioContext.destination);

          source.onended = () => {
            console.log('✅ OpenAI TTS Web Audio playback completed successfully');
            this.pauseVideo();
            resolve();
          };

          console.log('▶️ 🚀 Starting OpenAI TTS playback via Web Audio API...');
          source.start(0);
          this.playVideo();
          console.log('✅ OpenAI TTS Web Audio playback started - using OpenAI voice!');
        });

      } catch (webAudioError) {
        console.warn('⚠️ Web Audio API failed for OpenAI TTS:', webAudioError.message);
        console.log('🔄 OpenAI TTS: Falling back to HTML Audio...');

        // Fallback 1: HTML Audio for OpenAI TTS
        try {
          const mimeType = this.getMimeType(options.format || 'mp3');
      const blob = new Blob([audioBuffer], { type: mimeType });
      const audioUrl = URL.createObjectURL(blob);
      this.currentAudioUrl = audioUrl;
      
      this.currentAudio = new Audio();
      this.currentAudio.src = audioUrl;
      this.currentAudio.volume = 1.0;

          return new Promise<void>((resolve) => {
      const cleanup = () => {
        if (this.currentAudioUrl) {
          URL.revokeObjectURL(this.currentAudioUrl);
          this.currentAudioUrl = null;
        }
      };

      this.currentAudio.onended = () => {
              console.log('✅ OpenAI TTS HTML Audio playback completed');
        this.pauseVideo();
        this.currentAudio = null;
        cleanup();
        resolve();
      };

            this.currentAudio.onerror = () => {
              console.warn('⚠️ HTML Audio failed for OpenAI TTS, using browser speech synthesis...');
              // Fallback 2: Speech synthesis (still trying to preserve OpenAI audio)
              this.fallbackToWAV(audioBuffer, text, resolve, () => resolve(), cleanup);
            };

            // Try HTML Audio playback for OpenAI TTS
            const playPromise = this.currentAudio.play();
            if (playPromise) {
              playPromise.then(() => {
                console.log('✅ OpenAI TTS HTML Audio playback started');
          this.playVideo();
              }).catch(() => {
                console.warn('⚠️ HTML Audio play failed for OpenAI TTS, using browser speech synthesis...');
                // Fallback 2: Speech synthesis
                this.fallbackToWAV(audioBuffer, text, resolve, () => resolve(), cleanup);
              });
            }
          });

        } catch (htmlAudioError) {
          console.warn('⚠️ HTML Audio setup failed for OpenAI TTS:', htmlAudioError.message);
          console.log('🔄 OpenAI TTS: Using browser speech synthesis as last resort...');

          // Fallback 2: Speech synthesis
          return new Promise<void>((resolve) => {
            this.fallbackToWAV(audioBuffer, text, resolve, () => resolve(), () => {});
          });
        }
      }

    } catch (error) {
      console.error('❌ OpenAI TTS error:', error);
      // Don't throw - provide visual feedback instead
      console.log('⚠️ TTS failed completely, providing visual feedback only');
      // Return successfully to prevent app from breaking
      return;
    }
  }

  // Вспомогательная функция для конвертации ArrayBuffer в base64
  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  static stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (this.currentAudioUrl) {
      URL.revokeObjectURL(this.currentAudioUrl);
      this.currentAudioUrl = null;
    }
    this.pauseVideo();
  }

  static isPlaying(): boolean {
    return this.currentAudio !== null && !this.currentAudio.paused;
  }

  // Set video element to sync with TTS
  static setVideoElement(video: HTMLVideoElement | null): void {
    this.videoElement = video;
    console.log('🎥 Video element set:', !!video);
    
    // Pause video initially
    if (video) {
      video.pause();
    }
  }

  // Play video when TTS starts
  private static playVideo(): void {
    if (this.videoElement) {
      console.log('▶️ Playing video');
      this.videoElement.play().catch((err) => {
        console.warn('⚠️ Could not play video:', err.message);
      });
    }
  }

  // Pause video when TTS stops
  private static pauseVideo(): void {
    if (this.videoElement) {
      console.log('⏸️ Pausing video');
      this.videoElement.pause();
    }
  }


  // Fallback method if MP3 fails - try browser's built-in speech synthesis
  private static async fallbackToSpeechSynthesis(text: string, resolve: () => void, reject: (error: Error) => void) {
    try {
      console.log('🔄 Falling back to browser speech synthesis...');

      if (!('speechSynthesis' in window)) {
        console.log('⚠️ Speech synthesis not available in browser');
        // Don't reject - just resolve as if speech worked (silent mode)
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU'; // Russian language
      utterance.rate = 0.9; // Slightly slower than default
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Set up event handlers
      let hasStarted = false;

      utterance.onstart = () => {
        console.log('✅ Speech synthesis started');
        hasStarted = true;
        this.playVideo();
      };

      utterance.onend = () => {
        console.log('✅ Speech synthesis ended');
        this.pauseVideo();
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('❌ Speech synthesis error:', event.error, event);

        // If speech synthesis fails due to autoplay policy, just resolve silently
        if (event.error === 'not-allowed' || event.error === 'interrupted') {
          console.log('⚠️ Speech blocked by browser policy, continuing silently');
          resolve();
        } else {
          // For other errors, still resolve but log the issue
          console.log('⚠️ Speech synthesis failed, continuing with visual feedback only');
          resolve();
        }
      };

      // Add timeout as safety net
      const timeout = setTimeout(() => {
        if (!hasStarted) {
          console.log('⚠️ Speech synthesis timeout, continuing silently');
          resolve();
        }
      }, 5000); // 5 second timeout

      utterance.onstart = () => {
        clearTimeout(timeout);
        console.log('✅ Speech synthesis started');
        hasStarted = true;
        this.playVideo();
      };

      utterance.onend = () => {
        clearTimeout(timeout);
        console.log('✅ Speech synthesis ended');
        this.pauseVideo();
        resolve();
      };

      console.log('🎤 Attempting to speak via browser synthesis...');
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('❌ Speech synthesis setup failed:', error);
      // Don't reject - resolve silently so the app continues working
      console.log('⚠️ Speech synthesis failed, continuing with visual feedback only');
      resolve();
    }
  }

  // Fallback to speech synthesis if MP3 fails
  private static async fallbackToWAV(audioBuffer: ArrayBuffer, text: string, resolve: () => void, reject: (error: Error) => void, cleanup: () => void) {
    try {
      console.log('🔄 Attempting speech synthesis fallback...');

      // Try speech synthesis first (more reliable)
      // Note: this function now always resolves, never rejects
      await this.fallbackToSpeechSynthesis(text, resolve, reject);
    } catch (speechError) {
      console.error('❌ All audio fallbacks failed');
      // Resolve anyway to prevent app from breaking
      console.log('⚠️ All audio methods failed, continuing with visual feedback only');
      resolve();
    }
  }
}

// Функция для проверки поддержки аудио формата
export async function isAudioFormatSupported(format: string): Promise<boolean> {
  if (typeof Audio === 'undefined') return false;

  try {
    const audio = new Audio();
    const mimeType = format === 'aac' ? 'audio/aac' :
                     format === 'mp3' ? 'audio/mpeg' :
                     format === 'opus' ? 'audio/opus' :
                     format === 'flac' ? 'audio/flac' : 'audio/mpeg';

    const canPlay = audio.canPlayType(mimeType);
    console.log(`🎵 Format ${format} (${mimeType}) support:`, canPlay);
    return canPlay !== '';
  } catch (error) {
    console.warn('Error checking audio format support:', error);
    return false;
  }
}

// Функция для получения лучшего поддерживаемого формата
export async function getBestSupportedFormat(): Promise<string> {
  // MP3 is the most compatible format for Blob URLs across all browsers
  const formats = ['mp3', 'aac', 'opus', 'flac'];

  for (const format of formats) {
    if (await isAudioFormatSupported(format)) {
      console.log(`✅ Best supported format: ${format}`);
      return format;
    }
  }

  console.warn('❌ No supported audio formats found, using mp3 as fallback');
  return 'mp3'; // fallback
}

// Функция для проверки доступности TTS
export function isTTSAvailable(): boolean {
  // Проверяем наличие API ключа
  const hasApiKey = !!import.meta.env.VITE_OPENAI_API_KEY;

  // Проверяем поддержку Audio API в браузере
  const hasAudioSupport = typeof Audio !== 'undefined' &&
                         typeof AudioContext !== 'undefined' &&
                         typeof window !== 'undefined';

  return hasApiKey && hasAudioSupport;
}

// Функция для проверки, разрешено ли автоматическое воспроизведение аудио
export async function isAutoplayAllowed(): Promise<boolean> {
  if (typeof Audio === 'undefined') return false;

  try {
    const audio = new Audio();
    audio.volume = 0.01; // Очень тихий звук для теста
    audio.muted = true;

    // Пытаемся воспроизвести
    await audio.play();
    audio.pause();
    return true;
  } catch (error) {
    return false;
  }
}

// Функция для активации аудио после пользовательского взаимодействия
export function activateAudio(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('🔊 Activating audio context...');

      // Multiple attempts to activate audio
      const activationPromises = [];

      // 1. Activate AudioContext
      if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const activationPromise = (async () => {
          try {
            const AudioContextClass = AudioContext || webkitAudioContext;
            const audioContext = new AudioContextClass();

            if (audioContext.state === 'suspended') {
              await audioContext.resume();
              console.log('✅ AudioContext activated');
            }

            // Test with a short beep
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.01, audioContext.currentTime);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);

            return true;
          } catch (error) {
            console.warn('⚠️ AudioContext activation failed:', error);
            return false;
          }
        })();
        activationPromises.push(activationPromise);
      }

      // 2. Test HTML Audio multiple times
      for (let i = 0; i < 3; i++) {
        const htmlAudioPromise = (async () => {
          try {
            const testAudio = new Audio();
            testAudio.volume = 0.01;
            testAudio.muted = true;
            testAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

            return new Promise<boolean>((resolveAudio) => {
              testAudio.onended = () => {
                console.log(`✅ HTML Audio test ${i + 1} successful`);
                resolveAudio(true);
              };

              testAudio.onerror = () => {
                console.log(`⚠️ HTML Audio test ${i + 1} failed`);
                resolveAudio(false);
              };

              testAudio.play().catch(() => {
                console.log(`⚠️ HTML Audio play ${i + 1} failed`);
                resolveAudio(false);
              });

              // Timeout fallback
              setTimeout(() => resolveAudio(false), 1000);
            });
          } catch (error) {
            console.log(`⚠️ HTML Audio setup ${i + 1} failed:`, error);
            return false;
          }
        })();
        activationPromises.push(htmlAudioPromise);
      }

      // 3. Test speech synthesis
      const speechPromise = (async () => {
        try {
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance('test');
            utterance.volume = 0.01;
            utterance.lang = 'ru-RU';

            return new Promise<boolean>((resolveSpeech) => {
              utterance.onstart = () => {
                console.log('✅ Speech synthesis test successful');
                resolveSpeech(true);
              };

              utterance.onend = () => {
                console.log('✅ Speech synthesis test completed');
                resolveSpeech(true);
              };

              utterance.onerror = () => {
                console.log('⚠️ Speech synthesis test failed');
                resolveSpeech(false);
              };

              window.speechSynthesis.speak(utterance);

              // Timeout fallback
              setTimeout(() => resolveSpeech(false), 2000);
            });
          }
          return false;
        } catch (error) {
          console.log('⚠️ Speech synthesis setup failed:', error);
          return false;
        }
      })();
      activationPromises.push(speechPromise);

      // Wait for all activation attempts
      const results = await Promise.all(activationPromises);
      const successCount = results.filter(Boolean).length;

      console.log(`🔊 Audio activation results: ${successCount}/${results.length} successful`);

      if (successCount > 0) {
        console.log('✅ Audio activation completed successfully');
        resolve();
      } else {
        console.log('⚠️ All audio activation methods failed');
        resolve(); // Still resolve to continue app functionality
      }

    } catch (error) {
      console.error('❌ Audio activation error:', error);
      // Always resolve to prevent app from breaking
      console.log('⚠️ Audio activation failed, continuing without audio');
      resolve();
    }
  });
}
