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

  static async generateSpeech(text: string, options: TTSOptions = {}): Promise<ArrayBuffer> {
    const {
      voice = 'alloy', // alloy - нейтральный мужской голос, хорошо подходит для русского
      speed = 1.0,
      model = 'tts-1',
      format = 'aac' // AAC - лучший формат для браузерной совместимости
    } = options;

    console.log('🎤 generateSpeech called:', {
      textLength: text.length,
      textPreview: text.substring(0, 50) + '...',
      voice,
      speed,
      model
    });

    // Преобразуем цифры в слова
    const processedText = replaceNumbersInText(text);
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
    console.log('🎙️ speakText called with text:', text.substring(0, 50) + '...');

    try {
      // Проверяем доступность TTS
      if (!isTTSAvailable()) {
        console.error('❌ TTS not available');
        throw new Error('TTS not available: missing API key or browser does not support Audio API');
      }
      console.log('✅ TTS is available');

      // Автоматически выбираем лучший поддерживаемый формат, если не указан
      if (!options.format) {
        options.format = await getBestSupportedFormat();
      }
      console.log('🎵 Using audio format:', options.format);

      // Останавливаем текущее воспроизведение
      this.stop();

      // Генерируем речь
      console.log('🎤 Calling generateSpeech...');
      const audioBuffer = await this.generateSpeech(text, options);
      console.log('✅ generateSpeech completed');

      // Создаем Blob вместо Base64 для лучшей совместимости и производительности
      console.log('🔄 Creating Blob and Object URL...');
      const mimeType = this.getMimeType(format);
      console.log('📝 Using MIME type:', mimeType);
      const blob = new Blob([audioBuffer], { type: mimeType });
      const audioUrl = URL.createObjectURL(blob);
      this.currentAudioUrl = audioUrl;
      console.log('✅ Object URL created:', audioUrl);
      
      this.currentAudio = new Audio();
      console.log('✅ Audio element created');
      
      // Устанавливаем источник
      this.currentAudio.src = audioUrl;
      this.currentAudio.preload = 'auto';
      this.currentAudio.volume = 1.0;
      console.log('✅ Audio src set, volume:', this.currentAudio.volume);

      // Настраиваем обработчики событий
      return new Promise((resolve, reject) => {
        if (!this.currentAudio) return reject(new Error('Audio not created'));

        const cleanup = () => {
          if (this.currentAudioUrl) {
            URL.revokeObjectURL(this.currentAudioUrl);
            this.currentAudioUrl = null;
          }
        };

        this.currentAudio.onended = () => {
          console.log('✅ Audio playback ended');
          this.pauseVideo();
          this.currentAudio = null;
          cleanup();
          resolve();
        };

        this.currentAudio.onerror = (error) => {
          console.error('❌ Audio error event:', error);
          this.pauseVideo();
          this.currentAudio = null;
          cleanup();
          reject(new Error('Audio playback failed'));
        };

        this.currentAudio.oncanplaythrough = () => {
          // Аудио готово к воспроизведению
          console.log('✅ Audio ready to play (canplaythrough)');
        };

        this.currentAudio.onloadedmetadata = () => {
          console.log('✅ Audio metadata loaded, duration:', this.currentAudio?.duration);
        };

        // Загружаем аудио
        console.log('🔄 Loading audio...');
        this.currentAudio.load();

        // Воспроизводим с обработкой ошибок
        console.log('▶️ Attempting to play audio...');
        this.currentAudio.play().then(() => {
          console.log('✅ Audio play() succeeded');
          this.playVideo();
        }).catch((playError) => {
          console.error('❌ Play error:', playError);
          console.error('❌ Play error details:', {
            name: playError.name,
            message: playError.message,
            stack: playError.stack?.substring(0, 200)
          });
          this.pauseVideo();
          this.currentAudio = null;
          cleanup();

          // Проверяем тип ошибки
          let errorMessage = `Audio play failed: ${playError.message}`;
          if (playError.name === 'NotAllowedError') {
            errorMessage = 'Audio playback blocked by browser. Click anywhere on the page to enable audio.';
          } else if (playError.name === 'NotSupportedError') {
            errorMessage = 'Audio format not supported by this browser.';
          }

          reject(new Error(errorMessage));
        });
      });

    } catch (error) {
      console.error('❌ OpenAI TTS error:', error);
      throw error;
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
  const formats = ['aac', 'mp3', 'opus', 'flac'];

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
  return new Promise((resolve, reject) => {
    if (typeof Audio === 'undefined') {
      reject(new Error('Audio not supported'));
      return;
    }

    const audio = new Audio();
    audio.volume = 0.01;
    audio.muted = true;
    audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error('Failed to activate audio'));

    audio.play().catch(reject);
  });
}
