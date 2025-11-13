/**
 * Advanced Error Handler
 * Handles all error types with type safety and recovery strategies
 */

import { logger } from '@/utils/logger';
import type {
  BaseError,
  APIError,
  ValidationError,
  AuthError,
  FileError,
  AudioError,
  TTSError,
  StorageError,
  NetworkError,
  Result,
  ErrorResult,
} from '@/types/errors';
import {
  ErrorCategory,
  ErrorSeverity,
  APIErrorCode,
  isAPIError,
  isNetworkError,
  isValidationError,
  isAuthError,
  isFileError,
  isAudioError,
  isTTSError,
  isStorageError,
  toBaseError,
  DEFAULT_RETRY_POLICY,
} from '@/types/errors';

/**
 * Error handler context
 */
export interface ErrorContext {
  endpoint?: string;
  method?: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

/**
 * Recovery strategy result
 */
export interface RecoveryResult {
  canRecover: boolean;
  action: 'retry' | 'fallback' | 'notify' | 'abort';
  delay?: number;
}

/**
 * Enhanced error handler
 */
export class ErrorHandler {
  private context: ErrorContext;
  private errorListeners: Set<(error: BaseError) => void> = new Set();
  private recoveryStrategies: Map<ErrorCategory, (error: BaseError) => RecoveryResult> = new Map();

  constructor(context: Partial<ErrorContext> = {}) {
    this.context = {
      timestamp: new Date(),
      ...context,
    };

    this.setupDefaultRecoveryStrategies();
  }

  /**
   * Setup default recovery strategies
   */
  private setupDefaultRecoveryStrategies(): void {
    // Network errors - retry
    this.recoveryStrategies.set(ErrorCategory.NETWORK, (error) => ({
      canRecover: true,
      action: 'retry',
      delay: 2000,
    }));

    // API errors - conditional retry
    this.recoveryStrategies.set(ErrorCategory.API, (error) => {
      if (isAPIError(error)) {
        if ([503, 502, 504, 429].includes(error.statusCode)) {
          return { canRecover: true, action: 'retry', delay: 3000 };
        }
        if (error.statusCode === 401) {
          return { canRecover: true, action: 'fallback' };
        }
      }
      return { canRecover: false, action: 'notify' };
    });

    // Validation errors - abort
    this.recoveryStrategies.set(ErrorCategory.VALIDATION, () => ({
      canRecover: false,
      action: 'abort',
    }));

    // Auth errors - notify & redirect
    this.recoveryStrategies.set(ErrorCategory.AUTH, () => ({
      canRecover: true,
      action: 'fallback',
    }));

    // File errors - notify
    this.recoveryStrategies.set(ErrorCategory.FILE, () => ({
      canRecover: false,
      action: 'notify',
    }));

    // Audio errors - retry
    this.recoveryStrategies.set(ErrorCategory.AUDIO, () => ({
      canRecover: true,
      action: 'retry',
      delay: 1000,
    }));

    // TTS errors - retry
    this.recoveryStrategies.set(ErrorCategory.TTS, () => ({
      canRecover: true,
      action: 'retry',
      delay: 2000,
    }));

    // Storage errors - notify
    this.recoveryStrategies.set(ErrorCategory.STORAGE, () => ({
      canRecover: false,
      action: 'notify',
    }));
  }

  /**
   * Handle error with full context
   */
  public handle(error: any, category?: ErrorCategory): ErrorResult {
    const baseError = toBaseError(error, category);

    // Log error
    this.logError(baseError);

    // Notify listeners
    this.notifyListeners(baseError);

    // Determine recovery strategy
    const recovery = this.getRecoveryStrategy(baseError);
    logger.debug('Error recovery strategy', { strategy: recovery });

    return {
      success: false,
      error: baseError,
    };
  }

  /**
   * Get recovery strategy for error
   */
  public getRecoveryStrategy(error: BaseError): RecoveryResult {
    const strategy = this.recoveryStrategies.get(error.category);

    if (strategy) {
      return strategy(error);
    }

    return { canRecover: false, action: 'notify' };
  }

  /**
   * Retry with exponential backoff
   */
  public async retry<T,>(
    fn: () => Promise<T>,
    options = DEFAULT_RETRY_POLICY
  ): Promise<Result<T>> {
    let lastError: BaseError | null = null;

    for (let attempt = 0; attempt < options.maxRetries; attempt++) {
      try {
        const result = await fn();
        return { success: true, data: result };
      } catch (error) {
        lastError = toBaseError(error);

        if (!options.shouldRetry(lastError, attempt)) {
          break;
        }

        const delay = Math.min(
          options.initialDelayMs * Math.pow(options.backoffMultiplier, attempt),
          options.maxDelayMs
        );

        logger.warn(`Retrying after ${delay}ms (attempt ${attempt + 1}/${options.maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return {
      success: false,
      error: lastError || toBaseError(new Error('Max retries exceeded')),
    };
  }

  /**
   * Log error with full context
   */
  private logError(error: BaseError): void {
    const context = {
      ...this.context,
      error: {
        code: error.code,
        message: error.message,
        category: error.category,
        severity: error.severity,
      },
    };

    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        logger.error('Critical error', context);
        break;
      case ErrorSeverity.HIGH:
        logger.error('High severity error', context);
        break;
      case ErrorSeverity.MEDIUM:
        logger.warn('Medium severity error', context);
        break;
      case ErrorSeverity.LOW:
        logger.debug('Low severity error', context);
        break;
    }
  }

  /**
   * Register error listener
   */
  public onError(listener: (error: BaseError) => void): () => void {
    this.errorListeners.add(listener);
    return () => this.errorListeners.delete(listener);
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(error: BaseError): void {
    this.errorListeners.forEach(listener => {
      try {
        listener(error);
      } catch (err) {
        logger.error('Error in error listener', err);
      }
    });
  }

  /**
   * Update context
   */
  public updateContext(updates: Partial<ErrorContext>): void {
    this.context = { ...this.context, ...updates };
  }

  /**
   * Get current context
   */
  public getContext(): ErrorContext {
    return { ...this.context };
  }

  /**
   * Clear all listeners
   */
  public clearListeners(): void {
    this.errorListeners.clear();
  }

  /**
   * Register custom recovery strategy
   */
  public registerRecoveryStrategy(
    category: ErrorCategory,
    strategy: (error: BaseError) => RecoveryResult
  ): void {
    this.recoveryStrategies.set(category, strategy);
  }
}

/**
 * Global error handler instance
 */
let globalErrorHandler: ErrorHandler | null = null;

/**
 * Get or create global error handler
 */
export const getGlobalErrorHandler = (): ErrorHandler => {
  if (!globalErrorHandler) {
    globalErrorHandler = new ErrorHandler();
  }
  return globalErrorHandler;
};

/**
 * Initialize global error handler
 */
export const initializeErrorHandler = (context: Partial<ErrorContext> = {}): ErrorHandler => {
  globalErrorHandler = new ErrorHandler(context);
  return globalErrorHandler;
};

/**
 * Handle global promise rejection
 */
export const setupGlobalErrorHandlers = (): void => {
  const handler = getGlobalErrorHandler();

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', event => {
    handler.handle(event.reason, ErrorCategory.UNKNOWN);
  });

  // Global errors
  window.addEventListener('error', event => {
    handler.handle(event.error, ErrorCategory.UNKNOWN);
  });

  logger.info('Global error handlers initialized');
};

export default {
  ErrorHandler,
  getGlobalErrorHandler,
  initializeErrorHandler,
  setupGlobalErrorHandlers,
};

