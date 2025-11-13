/**
 * Comprehensive Error Types & Handlers
 * Provides type-safe error handling throughout the application
 */

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',           // User can ignore
  MEDIUM = 'medium',     // User should be notified
  HIGH = 'high',         // Critical error
  CRITICAL = 'critical', // System down
}

/**
 * Error categories
 */
export enum ErrorCategory {
  NETWORK = 'network',
  API = 'api',
  VALIDATION = 'validation',
  AUTH = 'auth',
  FILE = 'file',
  AUDIO = 'audio',
  TTS = 'tts',
  STORAGE = 'storage',
  UNKNOWN = 'unknown',
}

/**
 * API Error codes
 */
export enum APIErrorCode {
  // 4xx Client errors
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  VALIDATION_ERROR = 422,
  TOO_MANY_REQUESTS = 429,

  // 5xx Server errors
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,

  // Custom codes
  NETWORK_ERROR = 0,
  TIMEOUT = -1,
  CANCELLED = -2,
}

/**
 * Base error interface
 */
export interface BaseError extends Error {
  code: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  timestamp: Date;
  context?: Record<string, any>;
  originalError?: Error;
}

/**
 * Network error
 */
export interface NetworkError extends BaseError {
  category: ErrorCategory.NETWORK;
  statusCode?: number;
  endpoint?: string;
}

/**
 * API error with response details
 */
export interface APIError extends BaseError {
  category: ErrorCategory.API;
  statusCode: APIErrorCode;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  responseBody?: any;
  retryable: boolean;
  retryCount?: number;
}

/**
 * Validation error with field details
 */
export interface ValidationError extends BaseError {
  category: ErrorCategory.VALIDATION;
  field?: string;
  value?: any;
  constraints?: string[];
}

/**
 * Authentication error
 */
export interface AuthError extends BaseError {
  category: ErrorCategory.AUTH;
  reason: 'INVALID_CREDENTIALS' | 'EXPIRED_TOKEN' | 'NO_PERMISSION' | 'SESSION_EXPIRED';
}

/**
 * File operation error
 */
export interface FileError extends BaseError {
  category: ErrorCategory.FILE;
  fileName?: string;
  fileSize?: number;
  maxSize?: number;
  mimeType?: string;
  reason:
    | 'FILE_TOO_LARGE'
    | 'INVALID_FORMAT'
    | 'READ_FAILED'
    | 'PARSE_FAILED'
    | 'UPLOAD_FAILED';
}

/**
 * Audio error
 */
export interface AudioError extends BaseError {
  category: ErrorCategory.AUDIO;
  reason:
    | 'MICROPHONE_NOT_AVAILABLE'
    | 'PERMISSION_DENIED'
    | 'RECORDING_FAILED'
    | 'PROCESSING_FAILED'
    | 'DEVICE_NOT_FOUND';
  deviceId?: string;
}

/**
 * TTS error
 */
export interface TTSError extends BaseError {
  category: ErrorCategory.TTS;
  reason:
    | 'GENERATION_FAILED'
    | 'UNSUPPORTED_LANGUAGE'
    | 'AUDIO_PLAY_FAILED'
    | 'VOICE_NOT_FOUND';
  voice?: string;
  language?: string;
}

/**
 * Storage error
 */
export interface StorageError extends BaseError {
  category: ErrorCategory.STORAGE;
  key?: string;
  reason:
    | 'QUOTA_EXCEEDED'
    | 'ITEM_NOT_FOUND'
    | 'WRITE_FAILED'
    | 'READ_FAILED'
    | 'CLEAR_FAILED';
}

/**
 * Generic error result for error handling chains
 */
export interface ErrorResult {
  success: false;
  error: BaseError;
}

/**
 * Generic success result
 */
export interface SuccessResult<T> {
  success: true;
  data: T;
}

/**
 * Result type - discriminated union
 */
export type Result<T> = SuccessResult<T> | ErrorResult;

/**
 * Type guard for success result
 */
export const isSuccess = <T,>(result: Result<T>): result is SuccessResult<T> => {
  return result.success === true;
};

/**
 * Type guard for error result
 */
export const isError = (result: any): result is ErrorResult => {
  return result.success === false;
};

/**
 * Type guard for NetworkError
 */
export const isNetworkError = (error: any): error is NetworkError => {
  return error?.category === ErrorCategory.NETWORK;
};

/**
 * Type guard for APIError
 */
export const isAPIError = (error: any): error is APIError => {
  return error?.category === ErrorCategory.API;
};

/**
 * Type guard for ValidationError
 */
export const isValidationError = (error: any): error is ValidationError => {
  return error?.category === ErrorCategory.VALIDATION;
};

/**
 * Type guard for AuthError
 */
export const isAuthError = (error: any): error is AuthError => {
  return error?.category === ErrorCategory.AUTH;
};

/**
 * Type guard for FileError
 */
export const isFileError = (error: any): error is FileError => {
  return error?.category === ErrorCategory.FILE;
};

/**
 * Type guard for AudioError
 */
export const isAudioError = (error: any): error is AudioError => {
  return error?.category === ErrorCategory.AUDIO;
};

/**
 * Type guard for TTSError
 */
export const isTTSError = (error: any): error is TTSError => {
  return error?.category === ErrorCategory.TTS;
};

/**
 * Type guard for StorageError
 */
export const isStorageError = (error: any): error is StorageError => {
  return error?.category === ErrorCategory.STORAGE;
};

/**
 * Convert any error to BaseError
 */
export const toBaseError = (error: any, category = ErrorCategory.UNKNOWN): BaseError => {
  if (error instanceof Error && 'category' in error) {
    return error as BaseError;
  }

  return {
    name: error?.name || 'Error',
    message: error?.message || 'Unknown error',
    code: error?.code || 'UNKNOWN_ERROR',
    category,
    severity: ErrorSeverity.MEDIUM,
    timestamp: new Date(),
    originalError: error instanceof Error ? error : undefined,
  };
};

/**
 * Create a custom error result
 */
export const createErrorResult = (error: any, category = ErrorCategory.UNKNOWN): ErrorResult => {
  return {
    success: false,
    error: toBaseError(error, category),
  };
};

/**
 * Create a success result
 */
export const createSuccessResult = <T,>(data: T): SuccessResult<T> => {
  return {
    success: true,
    data,
  };
};

/**
 * Error message templates
 */
export const ERROR_TEMPLATES = {
  NETWORK: 'Network error. Please check your internet connection.',
  TIMEOUT: 'Request timeout. Please try again.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'Unauthorized access. Please log in.',
  FORBIDDEN: 'Access forbidden.',
  INVALID_REQUEST: 'Invalid request data.',
  SERVER_ERROR: 'Server error. Please try again later.',
  FILE_TOO_LARGE: (size: string, max: string) => `File size ${size} exceeds maximum ${max}.`,
  INVALID_FILE_TYPE: (type: string) => `File type ${type} is not supported.`,
  MICROPHONE_ERROR: 'Microphone is not available or permission denied.',
  TTS_ERROR: 'Text-to-speech failed. Please try again.',
} as const;

/**
 * Retry policy configuration
 */
export interface RetryPolicy {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  shouldRetry: (error: BaseError, attempt: number) => boolean;
}

/**
 * Default retry policy
 */
export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  shouldRetry: (error: BaseError, attempt: number) => {
    if (isAPIError(error)) {
      // Retry on server errors and rate limiting
      return (
        [503, 502, 504, 429].includes(error.statusCode) &&
        attempt < 3
      );
    }
    if (isNetworkError(error)) {
      return attempt < 3;
    }
    return false;
  },
};

export default {
  ErrorSeverity,
  ErrorCategory,
  APIErrorCode,
  isSuccess,
  isError,
  isNetworkError,
  isAPIError,
  isValidationError,
  isAuthError,
  isFileError,
  isAudioError,
  isTTSError,
  isStorageError,
  toBaseError,
  createErrorResult,
  createSuccessResult,
  ERROR_TEMPLATES,
  DEFAULT_RETRY_POLICY,
};

