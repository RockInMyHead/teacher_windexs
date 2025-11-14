import { replaceNumbersInText } from './numbersToWords';

export interface TTSOptions {
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  speed?: number;
  model?: 'tts-1' | 'tts-1-hd';
}

export class OpenAITTS {
  private static audioContext: AudioContext | null = null;
  private static currentAudio: HTMLAudioElement | null = null;

  static async generateSpeech(text: string, options: TTSOptions = {}): Promise<ArrayBuffer> {
    const {
      voice = 'alloy', // alloy - нейтральный мужской голос, хорошо подходит для русского
      speed = 1.0,
      model = 'tts-1'
    } = options;

    // Преобразуем цифры в слова
    const processedText = replaceNumbersInText(text);

    const response = await fetch(`${window.location.origin}/api/audio/speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        input: processedText,
        voice: voice,
        response_format: 'mp3',
        speed: speed,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI TTS API error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
    }

    return await response.arrayBuffer();
  }

  static async speak(text: string, options: TTSOptions = {}): Promise<void> {
    return this.speakText(text, options);
  }

  static async speakText(text: string, options: TTSOptions = {}): Promise<void> {
    try {
      // Проверяем доступность TTS
      if (!isTTSAvailable()) {
        throw new Error('TTS not available: missing API key or browser does not support Audio API');
      }

      // Останавливаем текущее воспроизведение
      this.stop();

      // Генерируем речь
      const audioBuffer = await this.generateSpeech(text, options);

      // Создаем blob и audio элемент
      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(blob);

      this.currentAudio = new Audio(audioUrl);

      // Настраиваем обработчики событий
      return new Promise((resolve, reject) => {
        if (!this.currentAudio) return reject(new Error('Audio not created'));

        this.currentAudio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          resolve();
        };

        this.currentAudio.onerror = (error) => {
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          reject(new Error('Audio playback failed'));
        };

        // Воспроизводим с обработкой ошибок
        this.currentAudio.play().catch((playError) => {
          console.error('Play error:', playError);
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          reject(new Error(`Audio play failed: ${playError.message}`));
        });
      });

    } catch (error) {
      console.error('OpenAI TTS error:', error);
      throw error;
    }
  }

  static stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  static isPlaying(): boolean {
    return this.currentAudio !== null && !this.currentAudio.paused;
  }
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
