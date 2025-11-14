import { OpenAITTS } from './openaiTTS';

/**
 * Расширенный модуль для голосового взаимодействия
 * - TTS (Text-to-Speech) с OpenAI
 * - STT (Speech-to-Text) с Web Speech API
 * - Управление состоянием записи и воспроизведения
 */

export interface VoiceCommOptions {
  language?: string;
  ttsVoice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  ttsSpeed?: number;
  continuous?: boolean;
}

export interface VoiceCommCallbacks {
  onListeningStart?: () => void;
  onListeningEnd?: () => void;
  onTranscript?: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
}

// Speech Recognition Interface
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

export class VoiceComm {
  private static recognition: SpeechRecognition | null = null;
  private static isListening = false;
  private static isPlaying = false;
  private static currentTranscript = '';
  private static interimTranscript = '';
  private static callbacks: VoiceCommCallbacks = {};
  private static options: VoiceCommOptions = {
    language: 'ru-RU',
    ttsVoice: 'nova',
    ttsSpeed: 1.0,
    continuous: false
  };

  /**
   * Инициализация модуля голосового общения
   */
  static init(options: VoiceCommOptions = {}, callbacks: VoiceCommCallbacks = {}): boolean {
    console.log('🎤 Initializing VoiceComm...');

    // Сохраняем опции и коллбеки
    this.options = { ...this.options, ...options };
    this.callbacks = callbacks;

    // Инициализируем Speech Recognition
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.warn('⚠️ Speech Recognition API not available');
      return false;
    }

    this.recognition = new SpeechRecognitionAPI();
    this.setupRecognitionListeners();

    console.log('✅ VoiceComm initialized successfully');
    return true;
  }

  /**
   * Настройка слушателей для речевого распознавания
   */
  private static setupRecognitionListeners(): void {
    if (!this.recognition) return;

    this.recognition.continuous = this.options.continuous || false;
    this.recognition.interimResults = true;
    this.recognition.lang = this.options.language || 'ru-RU';
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      console.log('🎙️ Speech recognition started');
      this.isListening = true;
      this.currentTranscript = '';
      this.interimTranscript = '';
      this.callbacks.onListeningStart?.();
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      this.interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
          console.log(
            `✅ Final: "${transcript}" (confidence: ${(confidence * 100).toFixed(0)}%)`
          );
        } else {
          this.interimTranscript += transcript;
          console.log(`🔄 Interim: "${transcript}"`);
        }
      }

      // Отправляем интеримный результат
      if (this.interimTranscript) {
        this.callbacks.onTranscript?.(this.interimTranscript, false);
      }

      // Отправляем финальный результат
      if (finalTranscript) {
        this.currentTranscript = finalTranscript.trim();
        this.callbacks.onTranscript?.(this.currentTranscript, true);
      }
    };

    this.recognition.onend = () => {
      console.log('🛑 Speech recognition ended');
      this.isListening = false;
      this.callbacks.onListeningEnd?.();
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('❌ Speech recognition error:', event.error);
      const errorMessage = this.getErrorMessage(event.error);
      this.callbacks.onError?.(errorMessage);
      this.isListening = false;
    };
  }

  /**
   * Переводит коды ошибок в понятные сообщения
   */
  private static getErrorMessage(error: string): string {
    const errorMessages: { [key: string]: string } = {
      'no-speech': 'Не слышу речь. Пожалуйста, говорите громче.',
      'audio-capture': 'Микрофон недоступен. Проверьте разрешения.',
      'network': 'Ошибка сети. Проверьте интернет соединение.',
      'aborted': 'Запись прервана.',
      'service-not-allowed': 'Сервис речевого распознавания недоступен.'
    };

    return errorMessages[error] || `Ошибка речевого распознавания: ${error}`;
  }

  /**
   * Начать запись голоса пользователя
   */
  static startListening(): boolean {
    if (!this.recognition) {
      console.warn('⚠️ Speech Recognition not initialized');
      return false;
    }

    if (this.isListening) {
      console.warn('⚠️ Already listening');
      return false;
    }

    try {
      console.log('🎙️ Starting to listen...');
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('❌ Error starting recognition:', error);
      return false;
    }
  }

  /**
   * Остановить запись голоса пользователя
   */
  static stopListening(): void {
    if (!this.recognition || !this.isListening) return;

    console.log('🛑 Stopping listening...');
    this.recognition.stop();
  }

  /**
   * Отменить запись (abort)
   */
  static abortListening(): void {
    if (!this.recognition || !this.isListening) return;

    console.log('❌ Aborting listening...');
    this.recognition.abort();
    this.isListening = false;
  }

  /**
   * Озвучить текст предложение за предложением с паузами
   */
  static async speakText(text: string, options?: VoiceCommOptions): Promise<void> {
    if (!text || text.trim().length === 0) {
      console.warn('⚠️ Empty text to speak');
      return;
    }

    const mergedOptions = { ...this.options, ...options };

    try {
      this.isPlaying = true;
      this.callbacks.onPlayStart?.();

      console.log('🎤 Starting to speak text (sentence by sentence)...');

      // Разделяем текст на предложения
      const sentences = this.splitIntoSentences(text);
      console.log(`📝 Split text into ${sentences.length} sentences`);

      // Озвучиваем каждое предложение
      for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i].trim();

        if (sentence.length < 3) {
          console.log(`⏭️ Skipping short sentence: "${sentence}"`);
          continue;
        }

        if (!this.isPlaying) {
          console.log('🛑 Speaking stopped by user');
          break;
        }

        console.log(`🎵 Speaking sentence ${i + 1}/${sentences.length}: "${sentence.substring(0, 50)}..."`);

        try {
          await OpenAITTS.speak(sentence, {
            voice: mergedOptions.ttsVoice,
            speed: mergedOptions.ttsSpeed
          });

          console.log(`✅ Sentence ${i + 1} completed`);

          // Пауза между предложениями (кроме последнего)
          if (i < sentences.length - 1) {
            await this.delay(300);
          }
        } catch (error) {
          console.error(`❌ Error speaking sentence ${i + 1}:`, error);
          // Проверяем тип ошибки
          if (error instanceof Error) {
            if (error.message.includes('NotSupportedError') ||
                error.message.includes('not supported') ||
                error.message.includes('Audio API not supported')) {
              console.warn('⚠️ TTS not supported in this environment, skipping...');
              this.callbacks.onError?.('TTS не поддерживается в этом браузере');
              // Прерываем озвучку если TTS не поддерживается
              break;
            }
          }
          // Продолжаем со следующего предложения для других типов ошибок
        }
      }

      console.log('✅ Text speaking completed');
    } catch (error) {
      console.error('❌ Error in speakText:', error);
      this.callbacks.onError?.('Ошибка при озвучивании текста');
    } finally {
      this.isPlaying = false;
      this.callbacks.onPlayEnd?.();
    }
  }

  /**
   * Остановить озвучивание текста
   */
  static stopSpeaking(): void {
    console.log('🔇 Stopping TTS...');
    this.isPlaying = false;
    OpenAITTS.stop();
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Разделение текста на предложения
   */
  private static splitIntoSentences(text: string): string[] {
    // Разделяем по точкам, вопросительным и восклицательным знакам
    let sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    // Если разделение не сработало, пытаемся разделить по абзацам
    if (sentences.length === 1) {
      sentences = text.split('\n').filter(s => s.trim().length > 0);
    }

    // Если все еще одно предложение, разделяем по запятым (последний вариант)
    if (sentences.length === 1) {
      sentences = text.split(',').filter(s => s.trim().length > 0);
    }

    return sentences.map(s => s.trim());
  }

  /**
   * Вспомогательная функция для задержки
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Получить текущий статус
   */
  static getStatus(): {
    isListening: boolean;
    isPlaying: boolean;
    currentTranscript: string;
    recognitionAvailable: boolean;
  } {
    return {
      isListening: this.isListening,
      isPlaying: this.isPlaying,
      currentTranscript: this.currentTranscript,
      recognitionAvailable: !!this.recognition
    };
  }

  /**
   * Проверить доступность API
   */
  static isAvailable(): boolean {
    return !!this.recognition;
  }

  /**
   * Сбросить состояние
   */
  static reset(): void {
    console.log('🔄 Resetting VoiceComm...');
    this.stopListening();
    this.stopSpeaking();
    this.currentTranscript = '';
    this.interimTranscript = '';
    this.isListening = false;
    this.isPlaying = false;
  }

  /**
   * Полная очистка при закрытии компонента
   */
  static cleanup(): void {
    console.log('🧹 Cleaning up VoiceComm...');
    this.reset();

    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (error) {
        console.error('Error aborting recognition:', error);
      }
    }

    this.recognition = null;
    this.callbacks = {};
  }
}

/**
 * Утилиты для работы с голосом
 */
export const VoiceUtils = {
  /**
   * Проверить доступность микрофона
   */
  async checkMicrophonePermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  },

  /**
   * Проверить поддержку браузером
   */
  checkBrowserSupport(): {
    speechRecognition: boolean;
    audioAPI: boolean;
    mediaDevices: boolean;
  } {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    return {
      speechRecognition: !!SpeechRecognitionAPI,
      audioAPI: !!window.AudioContext || !!(window as any).webkitAudioContext,
      mediaDevices: !!navigator.mediaDevices
    };
  },

  /**
   * Получить поддерживаемые языки
   */
  getSupportedLanguages(): string[] {
    return [
      'ru-RU', // Russian
      'en-US', // English US
      'en-GB', // English GB
      'es-ES', // Spanish
      'fr-FR', // French
      'de-DE', // German
      'zh-CN', // Chinese Simplified
      'ja-JP', // Japanese
      'ko-KR'  // Korean
    ];
  }
};

