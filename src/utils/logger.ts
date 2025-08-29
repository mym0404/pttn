import { intro, log, note, outro, spinner } from '@clack/prompts';
import pc from 'picocolors';

export type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'debug';

export interface LogMessage {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp?: string;
}

export class Logger {
  private static instance: Logger;
  private debugMode = false;
  private activeSpinner?: ReturnType<typeof spinner> = undefined;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  // High-level workflow methods
  startWorkflow(title: string): void {
    intro(pc.bgBlue(pc.white(` ${title} `)));
  }

  endWorkflow(message?: string): void {
    outro(message || pc.green('✅ Process completed successfully'));
  }

  // Spinner methods for long operations
  startSpinner(message: string): void {
    this.activeSpinner = spinner();
    this.activeSpinner.start(message);
  }

  updateSpinner(message: string): void {
    if (this.activeSpinner) {
      this.activeSpinner.message(message);
    }
  }

  stopSpinner(message?: string): void {
    if (this.activeSpinner) {
      this.activeSpinner.stop(message);
      this.activeSpinner = undefined;
    }
  }

  // Core logging methods
  info(message: string, data?: unknown): void {
    this.logWithClack('info', message, data);
  }

  success(message: string, data?: unknown): void {
    this.logWithClack('success', message, data);
  }

  warning(message: string, data?: unknown): void {
    this.logWithClack('warning', message, data);
  }

  error(message: string, data?: unknown): void {
    this.logWithClack('error', message, data);
  }

  debug(message: string, data?: unknown): void {
    if (this.debugMode) {
      this.logWithClack('debug', message, data);
    }
  }

  // List operations
  list(title: string, items: string[]): void {
    if (items.length === 0) {
      this.warning(`No ${title.toLowerCase()} found`);
      return;
    }

    const formattedItems = items.map((item, index) => `${index + 1}. ${item}`);
    note(formattedItems.join('\n'), pc.cyan(title));
  }

  // Progress tracking
  progress(current: number, total: number, operation: string): void {
    const percentage = Math.round((current / total) * 100);
    this.info(`${operation} [${current}/${total}] ${percentage}%`);
  }

  private logWithClack(level: LogLevel, message: string, data?: unknown): void {
    const coloredMessage = this.colorizeMessage(level, message);
    
    if (data) {
      const dataStr = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      note(dataStr, coloredMessage);
    } else {
      log.message(coloredMessage);
    }
  }

  private colorizeMessage(level: LogLevel, message: string): string {
    switch (level) {
      case 'success':
        return pc.green(`✅ ${message}`);
      case 'warning':
        return pc.yellow(`⚠️  ${message}`);
      case 'error':
        return pc.red(`❌ ${message}`);
      case 'debug':
        return pc.gray(`🔍 ${message}`);
      case 'info':
      default:
        return pc.blue(`ℹ️  ${message}`);
    }
  }
}

// Singleton instance export
export const logger = Logger.getInstance();

// Utility functions for common patterns
export const withSpinner = async <T>(
  message: string, 
  operation: () => Promise<T>
): Promise<T> => {
  logger.startSpinner(message);
  try {
    const result = await operation();
    logger.stopSpinner(pc.green('✅ Completed'));
    return result;
  } catch (error) {
    logger.stopSpinner(pc.red('❌ Failed'));
    throw error;
  }
};

export const withWorkflow = <T>(
  title: string,
  operation: () => Promise<T> | T
): Promise<T> | T => {
  logger.startWorkflow(title);
  try {
    const result = operation();
    if (result instanceof Promise) {
      return result.finally(() => logger.endWorkflow());
    }
    logger.endWorkflow();
    return result;
  } catch (error) {
    logger.endWorkflow(pc.red('❌ Operation failed'));
    throw error;
  }
};