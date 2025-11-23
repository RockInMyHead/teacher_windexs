/**
 * Speech Recognition API Module
 * Handles browser Speech Recognition API and provides unified interface
 * @module features/voice/api/speechRecognitionApi
 */

// Speech Recognition Types
export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

export interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

export interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

export type SpeechRecognitionErrorCode =
  | 'no-speech'
  | 'audio-capture'
  | 'network'
  | 'not-allowed'
  | 'service-not-allowed'
  | 'bad-grammar'
  | 'service-unavailable';

// Global window interface extension
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

/**
 * Speech Recognition API utility class
 * Provides unified interface for browser speech recognition
 */
export class SpeechRecognitionAPI {
  private recognition: SpeechRecognition | null = null;

  /**
   * Check if speech recognition is supported in this browser
   */
  static isSupported(): boolean {
    return !!(
      window.SpeechRecognition ||
      window.webkitSpeechRecognition
    );
  }

  /**
   * Create a new speech recognition instance
   */
  static create(): SpeechRecognition | null {
    if (!this.isSupported()) {
      return null;
    }

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    return new SpeechRecognitionClass();
  }

  /**
   * Get supported languages for speech recognition
   */
  static getSupportedLanguages(): string[] {
    return [
      'en-US', // English (US)
      'en-GB', // English (UK)
      'es-ES', // Spanish (Spain)
      'es-MX', // Spanish (Mexico)
      'fr-FR', // French
      'de-DE', // German
      'it-IT', // Italian
      'pt-BR', // Portuguese (Brazil)
      'pt-PT', // Portuguese (Portugal)
      'ru-RU', // Russian
      'zh-CN', // Chinese (Simplified)
      'ja-JP', // Japanese
      'ko-KR', // Korean
      'ar-SA', // Arabic (Saudi Arabia)
      'hi-IN', // Hindi
      'nl-NL', // Dutch
      'sv-SE', // Swedish
      'no-NO', // Norwegian
      'da-DK', // Danish
      'fi-FI', // Finnish
      'pl-PL', // Polish
      'tr-TR', // Turkish
      'he-IL', // Hebrew
      'th-TH', // Thai
      'vi-VN', // Vietnamese
    ];
  }

  /**
   * Detect language from content
   */
  static detectLanguageFromContent(title: string, topic: string, aspects: string): string {
    const content = `${title} ${topic} ${aspects}`.toLowerCase();

    if (content.includes('китай') || content.includes('china') || content.includes('chinese') || content.includes('中文')) {
      return 'zh-CN';
    } else if (content.includes('испан') || content.includes('spanish') || content.includes('español')) {
      return 'es-ES';
    } else if (content.includes('француз') || content.includes('french') || content.includes('français')) {
      return 'fr-FR';
    } else if (content.includes('немец') || content.includes('german') || content.includes('deutsch')) {
      return 'de-DE';
    } else if (content.includes('итальян') || content.includes('italian') || content.includes('italiano')) {
      return 'it-IT';
    } else if (content.includes('португал') || content.includes('portuguese') || content.includes('português')) {
      return 'pt-BR';
    } else if (content.includes('япон') || content.includes('japan') || content.includes('japanese') || content.includes('日本語')) {
      return 'ja-JP';
    } else if (content.includes('корей') || content.includes('korea') || content.includes('korean') || content.includes('한국어')) {
      return 'ko-KR';
    } else if (content.includes('араб') || content.includes('arabic') || content.includes('العربية')) {
      return 'ar-SA';
    } else if (content.includes('хинди') || content.includes('hindi') || content.includes('हिंदी')) {
      return 'hi-IN';
    } else if (content.includes('голланд') || content.includes('dutch') || content.includes('nederlands')) {
      return 'nl-NL';
    } else if (content.includes('швед') || content.includes('swedish') || content.includes('svenska')) {
      return 'sv-SE';
    } else if (content.includes('норвеж') || content.includes('norwegian') || content.includes('norsk')) {
      return 'no-NO';
    } else if (content.includes('датск') || content.includes('danish') || content.includes('dansk')) {
      return 'da-DK';
    } else if (content.includes('финск') || content.includes('finnish') || content.includes('suomi')) {
      return 'fi-FI';
    } else if (content.includes('польск') || content.includes('polish') || content.includes('polski')) {
      return 'pl-PL';
    } else if (content.includes('турец') || content.includes('turkish') || content.includes('türkçe')) {
      return 'tr-TR';
    } else if (content.includes('иврит') || content.includes('hebrew') || content.includes('עברית')) {
      return 'he-IL';
    } else if (content.includes('тайск') || content.includes('thai') || content.includes('ไทย')) {
      return 'th-TH';
    } else if (content.includes('вьетнам') || content.includes('vietnamese') || content.includes('tiếng việt')) {
      return 'vi-VN';
    } else if (content.includes('русск') || content.includes('russia') || content.includes('russian')) {
      return 'ru-RU';
    }

    // Default to English
    return 'en-US';
  }
}

export type {
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
  SpeechRecognitionErrorCode
};





