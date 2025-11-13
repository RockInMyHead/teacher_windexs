/**
 * Centralized logging utility
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  stack?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private isDevelopment = process.env.NODE_ENV === 'development';

  private addLog(level: LogLevel, message: string, data?: any, error?: Error): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      stack: error?.stack,
    };

    this.logs.push(entry);

    // Keep only last N logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Also log to console in development
    if (this.isDevelopment) {
      this.logToConsole(level, message, data);
    }

    // Send to external logging service in production
    if (!this.isDevelopment && level === LogLevel.ERROR) {
      this.sendToExternalService(entry);
    }
  }

  private logToConsole(level: LogLevel, message: string, data?: any): void {
    const prefix = `[${level}]`;
    const time = new Date().toLocaleTimeString();

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`${prefix} ${time}`, message, data);
        break;
      case LogLevel.INFO:
        console.info(`${prefix} ${time}`, message, data);
        break;
      case LogLevel.WARN:
        console.warn(`${prefix} ${time}`, message, data);
        break;
      case LogLevel.ERROR:
        console.error(`${prefix} ${time}`, message, data);
        break;
    }
  }

  private sendToExternalService(entry: LogEntry): void {
    // TODO: Implement sending to external logging service (e.g., Sentry, LogRocket)
    // Example:
    // if (window.sentryClient) {
    //   window.sentryClient.captureException(new Error(entry.message), {
    //     extra: entry.data,
    //   });
    // }
  }

  public debug(message: string, data?: any): void {
    this.addLog(LogLevel.DEBUG, message, data);
  }

  public info(message: string, data?: any): void {
    this.addLog(LogLevel.INFO, message, data);
  }

  public warn(message: string, data?: any): void {
    this.addLog(LogLevel.WARN, message, data);
  }

  public error(message: string, error?: Error | unknown, data?: any): void {
    if (error instanceof Error) {
      this.addLog(LogLevel.ERROR, message, { ...data, errorMessage: error.message }, error);
    } else {
      this.addLog(LogLevel.ERROR, message, { ...data, error });
    }
  }

  public getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return this.logs;
  }

  public clearLogs(): void {
    this.logs = [];
  }

  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  public downloadLogs(): void {
    const data = this.exportLogs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export for testing
export { Logger };

