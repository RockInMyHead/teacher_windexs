/**
 * Application constants
 */

export const TIMEOUT_DURATIONS = {
  TTS_GENERATION: 30000,      // 30 seconds
  VOICE_RECOGNITION: 60000,   // 60 seconds
  API_CALL: 30000,            // 30 seconds
  DEBOUNCE: 300,              // 300ms
  ANIMATION: 300,             // 300ms
} as const;

export const API_CONFIG = {
  BASE_URL: typeof window !== 'undefined' ? window.location.origin : '',
  API_PREFIX: '/api',
  TIMEOUT: TIMEOUT_DURATIONS.API_CALL,
} as const;

export const VOICE_CONFIG = {
  LANGUAGE: 'ru-RU',
  CONTINUOUS: true,
  INTERIM_RESULTS: true,
  MAX_ALTERNATIVES: 1,
} as const;

export const AUDIO_CONFIG = {
  SAMPLE_RATE: 16000,
  CHANNELS: 1,
  BIT_DEPTH: 16,
} as const;

export const TTS_CONFIG = {
  MODEL: 'tts-1',
  VOICE: 'nova',
  RESPONSE_FORMAT: 'mp3',
  SPEED: 1.0,
} as const;

export const FILE_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024,  // 10MB
  MAX_FILES: 5,
  ALLOWED_FORMATS: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'text/plain'],
    ALL: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain'],
  },
} as const;

export const ASSESSMENT_CONFIG = {
  MIN_QUESTIONS: 6,
  MAX_QUESTIONS: 8,
  BEGINNER_DIFFICULTY: 0.3,
  INTERMEDIATE_DIFFICULTY: 0.5,
  ADVANCED_DIFFICULTY: 0.2,
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  CACHED_MESSAGES: 'cached_messages',
  ASSESSMENT_STATE: 'assessment_state',
  USER_PROGRESS: 'user_progress',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ошибка сети. Проверьте интернет соединение.',
  API_ERROR: 'Ошибка API. Попробуйте позже.',
  AUTH_ERROR: 'Ошибка аутентификации. Пожалуйста, авторизуйтесь.',
  NOT_FOUND: 'Ресурс не найден.',
  VALIDATION_ERROR: 'Ошибка валидации данных.',
  TIMEOUT_ERROR: 'Истекло время ожидания. Попробуйте еще раз.',
  FILE_TOO_LARGE: 'Файл слишком большой.',
  INVALID_FILE_TYPE: 'Недопустимый тип файла.',
  MICROPHONE_NOT_AVAILABLE: 'Микрофон недоступен.',
  SPEECH_RECOGNITION_NOT_AVAILABLE: 'Web Speech API недоступен.',
  TTS_NOT_AVAILABLE: 'Text-to-Speech недоступен.',
  UNKNOWN_ERROR: 'Неизвестная ошибка. Попробуйте позже.',
} as const;

export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: 'Файл успешно загружен.',
  MESSAGE_SENT: 'Сообщение отправлено.',
  ASSESSMENT_COMPLETED: 'Тестирование завершено.',
  SETTINGS_SAVED: 'Настройки сохранены.',
  LOGGED_IN: 'Вы успешно вошли в систему.',
  LOGGED_OUT: 'Вы вышли из системы.',
} as const;

export const CEFR_LEVELS = {
  A1: { name: 'A1 (Elementary)', description: 'Beginner' },
  A2: { name: 'A2 (Pre-intermediate)', description: 'Elementary' },
  B1: { name: 'B1 (Intermediate)', description: 'Intermediate' },
  B2: { name: 'B2 (Upper-intermediate)', description: 'Upper-intermediate' },
  C1: { name: 'C1 (Advanced)', description: 'Advanced' },
  C2: { name: 'C2 (Proficiency)', description: 'Mastery' },
} as const;

export const GRADE_TO_LEVEL_MAP: Record<string, keyof typeof CEFR_LEVELS> = {
  '1-2': 'A1',
  '3-4': 'A2',
  '5-6': 'B1',
  '7-8': 'B2',
  '9-10': 'C1',
  '11': 'C2',
  'university': 'C1',
  'advanced': 'C2',
} as const;

export const BEEP_SOUNDS = {
  NOTIFICATION: { frequency: 600, duration: 100 },
  SUCCESS: { frequency: 800, duration: 200 },
  ERROR: { frequency: 400, duration: 200 },
  WARNING: { frequency: 500, duration: 150 },
  THINKING: { frequency: 500, duration: 100 },
} as const;

export const ANIMATION_DURATIONS = {
  FADE_IN: 300,
  FADE_OUT: 300,
  SLIDE_IN: 400,
  SLIDE_OUT: 300,
  SCALE_IN: 250,
  SCALE_OUT: 200,
} as const;

export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY: 1000,      // 1 second
  MAX_DELAY: 30000,          // 30 seconds
  BACKOFF_MULTIPLIER: 2,
} as const;

export const CACHE_CONFIG = {
  MESSAGES_CACHE_TIME: 5 * 60 * 1000,      // 5 minutes
  ASSESSMENT_CACHE_TIME: 10 * 60 * 1000,   // 10 minutes
  USER_DATA_CACHE_TIME: 30 * 60 * 1000,    // 30 minutes
} as const;

/**
 * Get timeout duration
 */
export const getTimeoutDuration = (key: keyof typeof TIMEOUT_DURATIONS): number => {
  return TIMEOUT_DURATIONS[key];
};

/**
 * Get error message
 */
export const getErrorMessage = (key: keyof typeof ERROR_MESSAGES): string => {
  return ERROR_MESSAGES[key];
};

/**
 * Get success message
 */
export const getSuccessMessage = (key: keyof typeof SUCCESS_MESSAGES): string => {
  return SUCCESS_MESSAGES[key];
};

/**
 * Check if file format is allowed
 */
export const isFileFormatAllowed = (
  fileType: string,
  allowedFormats: readonly string[] = FILE_CONFIG.ALLOWED_FORMATS.ALL
): boolean => {
  return allowedFormats.includes(fileType);
};

/**
 * Check if file size is valid
 */
export const isFileSizeValid = (fileSize: number, maxSize = FILE_CONFIG.MAX_FILE_SIZE): boolean => {
  return fileSize <= maxSize;
};

