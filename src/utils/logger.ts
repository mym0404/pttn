import pc from 'picocolors';

export type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'debug';

export class Logger {
  private static instance: Logger;

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // High-level workflow methods
  startWorkflow(title: string): void {
    console.log(pc.blue(title));
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
        return pc.green(message);
      case 'warning':
        return pc.yellow(message);
      case 'error':
        return pc.red(message);
      case 'debug':
        return pc.gray(message);
      case 'info':
      default:
        return pc.blue(message);
    }
  }
}

// Singleton instance export
export const logger: Logger = Logger.getInstance();
