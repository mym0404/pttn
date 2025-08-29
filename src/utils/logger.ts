import pc from 'picocolors';

export type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'debug';

export class Logger {
  private static instance: Logger;
  private debugMode = false;

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
    console.log(pc.blue(`🚀 ${title}`));
  }

  endWorkflow(message?: string): void {
    console.log(message || pc.green('🎉 Process completed successfully'));
  }

  // Core logging methods
  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  success(message: string, data?: unknown): void {
    this.log('success', message, data);
  }

  warning(message: string, data?: unknown): void {
    this.log('warning', message, data);
  }

  error(message: string, data?: unknown): void {
    this.log('error', message, data);
  }

  debug(message: string, data?: unknown): void {
    if (this.debugMode) {
      this.log('debug', message, data);
    }
  }

  // List operations
  list(title: string, items: string[]): void {
    if (items.length === 0) {
      this.warning(`No ${title.toLowerCase()} found`);
      return;
    }

    console.log(pc.cyan(`\n${title}:`));
    items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item}`);
    });
    console.log();
  }

  // Progress tracking
  progress(current: number, total: number, operation: string): void {
    const percentage = Math.round((current / total) * 100);
    this.info(`${operation} [${current}/${total}] ${percentage}%`);
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    const coloredMessage = this.colorizeMessage(level, message);

    console.log(coloredMessage);

    if (data) {
      const dataStr =
        typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      console.log(pc.gray(dataStr));
    }
  }

  private colorizeMessage(level: LogLevel, message: string): string {
    switch (level) {
      case 'success':
        return pc.green(`🎉 ${message}`);
      case 'warning':
        return pc.yellow(`⚡ ${message}`);
      case 'error':
        return pc.red(`💥 ${message}`);
      case 'debug':
        return pc.gray(`🔬 ${message}`);
      case 'info':
      default:
        return pc.blue(`🚀 ${message}`);
    }
  }
}

// Singleton instance export
export const logger: Logger = Logger.getInstance();

// Utility functions for common patterns
export const withProgress = async <T>(
  message: string,
  operation: () => Promise<T>
): Promise<T> => {
  logger.info(message);
  try {
    const result = await operation();
    logger.success('Completed');
    return result;
  } catch (error) {
    logger.error('Failed');
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
    logger.endWorkflow(pc.red('💥 Operation failed'));
    throw error;
  }
};
