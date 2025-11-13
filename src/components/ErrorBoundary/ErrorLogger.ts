/**
 * Centralized Error Logger
 * Manages error logging, categorization, and reporting
 */

import { logger } from '@/utils/logger';
import type { BaseError, ErrorSeverity, ErrorCategory } from '@/types/errors';

/**
 * Error log entry
 */
export interface ErrorLogEntry {
  id: string;
  timestamp: Date;
  message: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  stack?: string;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

/**
 * Error logger configuration
 */
export interface ErrorLoggerConfig {
  maxLogs: number;
  enableRemoteLogging: boolean;
  remoteEndpoint?: string;
  enableConsoleLogging: boolean;
  enableStorageLogging: boolean;
}

/**
 * Centralized Error Logger
 */
export class ErrorLogger {
  private logs: ErrorLogEntry[] = [];
  private config: ErrorLoggerConfig;
  private sessionId: string;

  constructor(config: Partial<ErrorLoggerConfig> = {}) {
    this.config = {
      maxLogs: 100,
      enableRemoteLogging: process.env.NODE_ENV === 'production',
      enableConsoleLogging: true,
      enableStorageLogging: true,
      ...config,
    };

    this.sessionId = this.generateSessionId();
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log error
   */
  public logError(error: BaseError | Error, context?: Record<string, any>): ErrorLogEntry {
    const entry: ErrorLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      message: error instanceof Error ? error.message : String(error),
      severity: 'category' in error ? error.severity : 'high',
      category: 'category' in error ? error.category : 'unknown',
      stack: error instanceof Error ? error.stack : undefined,
      context: {
        ...context,
        ...(error instanceof Error && 'context' in error ? error.context : {}),
      },
      userId: context?.userId,
      sessionId: this.sessionId,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    // Add to logs
    this.logs.push(entry);

    // Maintain max logs
    if (this.logs.length > this.config.maxLogs) {
      this.logs = this.logs.slice(-this.config.maxLogs);
    }

    // Console logging
    if (this.config.enableConsoleLogging) {
      this.logToConsole(entry);
    }

    // Storage logging
    if (this.config.enableStorageLogging) {
      this.logToStorage(entry);
    }

    // Remote logging
    if (this.config.enableRemoteLogging && this.config.remoteEndpoint) {
      this.logToRemote(entry);
    }

    return entry;
  }

  /**
   * Log to console
   */
  private logToConsole(entry: ErrorLogEntry): void {
    const color = this.getSeverityColor(entry.severity);
    const style = `color: white; background-color: ${color}; padding: 2px 4px; border-radius: 2px;`;

    console.group(
      `%c${entry.severity.toUpperCase()} | ${entry.category}`,
      style
    );
    console.log('Message:', entry.message);
    console.log('Error ID:', entry.id);
    if (entry.stack) console.log('Stack:', entry.stack);
    if (entry.context && Object.keys(entry.context).length > 0) {
      console.log('Context:', entry.context);
    }
    console.groupEnd();
  }

  /**
   * Log to localStorage
   */
  private logToStorage(entry: ErrorLogEntry): void {
    try {
      const key = `error_logs_${this.sessionId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = [...existing, entry].slice(-50); // Keep last 50
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (err) {
      logger.warn('Failed to log to storage', err);
    }
  }

  /**
   * Log to remote service
   */
  private logToRemote(entry: ErrorLogEntry): void {
    // Batch and send to remote service
    const payload = {
      ...entry,
      timestamp: entry.timestamp.toISOString(),
    };

    fetch(this.config.remoteEndpoint!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(err => {
      logger.warn('Failed to send log to remote service', err);
    });
  }

  /**
   * Get severity color
   */
  private getSeverityColor(severity: ErrorSeverity): string {
    switch (severity) {
      case 'critical':
        return '#DC2626'; // Red
      case 'high':
        return '#EA580C'; // Orange
      case 'medium':
        return '#EAB308'; // Yellow
      case 'low':
        return '#3B82F6'; // Blue
      default:
        return '#6B7280'; // Gray
    }
  }

  /**
   * Get logs
   */
  public getLogs(filter?: Partial<ErrorLogEntry>): ErrorLogEntry[] {
    if (!filter) {
      return [...this.logs];
    }

    return this.logs.filter(log => {
      return Object.entries(filter).every(([key, value]) => {
        return (log as any)[key] === value;
      });
    });
  }

  /**
   * Get logs by severity
   */
  public getLogsBySeverity(severity: ErrorSeverity): ErrorLogEntry[] {
    return this.getLogs({ severity });
  }

  /**
   * Get logs by category
   */
  public getLogsByCategory(category: ErrorCategory): ErrorLogEntry[] {
    return this.getLogs({ category });
  }

  /**
   * Clear logs
   */
  public clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs
   */
  public exportLogs(): string {
    return JSON.stringify(
      this.logs.map(log => ({
        ...log,
        timestamp: log.timestamp.toISOString(),
      })),
      null,
      2
    );
  }

  /**
   * Get session ID
   */
  public getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Get statistics
   */
  public getStats() {
    const stats = {
      totalErrors: this.logs.length,
      bySeverity: {} as Record<ErrorSeverity, number>,
      byCategory: {} as Record<ErrorCategory, number>,
      latestError: this.logs[this.logs.length - 1] || null,
    };

    this.logs.forEach(log => {
      stats.bySeverity[log.severity] = (stats.bySeverity[log.severity] || 0) + 1;
      stats.byCategory[log.category] = (stats.byCategory[log.category] || 0) + 1;
    });

    return stats;
  }
}

/**
 * Global error logger instance
 */
let globalErrorLogger: ErrorLogger | null = null;

/**
 * Get or create global error logger
 */
export const getGlobalErrorLogger = (): ErrorLogger => {
  if (!globalErrorLogger) {
    globalErrorLogger = new ErrorLogger();
  }
  return globalErrorLogger;
};

/**
 * Initialize global error logger
 */
export const initializeErrorLogger = (config: Partial<ErrorLoggerConfig> = {}): ErrorLogger => {
  globalErrorLogger = new ErrorLogger(config);
  return globalErrorLogger;
};

export default {
  ErrorLogger,
  getGlobalErrorLogger,
  initializeErrorLogger,
};

