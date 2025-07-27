/**
 * Centralized Logging Utility
 * Provides consistent logging across the application with environment-based control
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
}

class Logger {
  private config: LogConfig;
  private context: string;

  constructor(context: string = 'App') {
    this.context = context;
    this.config = {
      level: this.getLogLevelFromEnv(),
      enableConsole: process.env.NODE_ENV !== 'production',
      enableRemote: process.env.NODE_ENV === 'production',
      remoteEndpoint: process.env.REACT_APP_LOG_ENDPOINT,
    };
  }

  private getLogLevelFromEnv(): LogLevel {
    const level = process.env.REACT_APP_LOG_LEVEL?.toLowerCase();
    switch (level) {
      case 'error':
        return LogLevel.ERROR;
      case 'warn':
        return LogLevel.WARN;
      case 'info':
        return LogLevel.INFO;
      case 'debug':
        return LogLevel.DEBUG;
      default:
        return process.env.NODE_ENV === 'production' ? LogLevel.ERROR : LogLevel.INFO;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.config.level;
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const baseMessage = `[${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}`;
    
    if (data !== undefined) {
      return `${baseMessage} ${typeof data === 'object' ? JSON.stringify(data, null, 2) : data}`;
    }
    
    return baseMessage;
  }

  private log(level: LogLevel, levelName: string, message: string, data?: any): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(levelName, message, data);

    if (this.config.enableConsole) {
      switch (level) {
        case LogLevel.ERROR:
          console.error(formattedMessage);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage);
          break;
        case LogLevel.INFO:
          console.info(formattedMessage);
          break;
        case LogLevel.DEBUG:
          console.debug(formattedMessage);
          break;
      }
    }

    if (this.config.enableRemote && this.config.remoteEndpoint) {
      this.sendToRemote(level, message, data);
    }
  }

  private async sendToRemote(level: LogLevel, message: string, data?: any): Promise<void> {
    try {
      await fetch(this.config.remoteEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level: LogLevel[level],
          message,
          data,
          context: this.context,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      });
    } catch (error) {
      // Fallback to console if remote logging fails
      if (this.config.enableConsole) {
        console.error('Remote logging failed:', error);
      }
    }
  }

  error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, 'ERROR', message, data);
  }

  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, 'WARN', message, data);
  }

  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, 'INFO', message, data);
  }

  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, 'DEBUG', message, data);
  }

  // Convenience methods for common logging patterns
  apiError(endpoint: string, error: any): void {
    this.error(`API request failed for ${endpoint}`, {
      endpoint,
      error: error instanceof Error ? error.message : error,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    });
  }

  userAction(action: string, userId?: string, data?: any): void {
    this.info(`User action: ${action}`, {
      action,
      userId,
      ...data,
    });
  }

  performance(operation: string, duration: number, data?: any): void {
    this.debug(`Performance: ${operation} took ${duration}ms`, {
      operation,
      duration,
      ...data,
    });
  }

  security(event: string, userId?: string, data?: any): void {
    this.warn(`Security event: ${event}`, {
      event,
      userId,
      ip: 'unknown', // In production, this would be extracted from request
      ...data,
    });
  }
}

// Create logger instances for different contexts
export const createLogger = (context: string): Logger => {
  return new Logger(context);
};

// Default logger instance
export const logger = createLogger('App');

// Pre-configured loggers for common contexts
export const apiLogger = createLogger('API');
export const authLogger = createLogger('Auth');
export const userLogger = createLogger('User');
export const securityLogger = createLogger('Security');
export const performanceLogger = createLogger('Performance');

// Export the Logger class for custom instances
export default Logger; 