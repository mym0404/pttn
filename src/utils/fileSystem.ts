import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';

export const ensureDir = async (path: string): Promise<void> => {
  if (!existsSync(path)) {
    await mkdir(path, { recursive: true });
  }
};

export const sanitizeFilename = (name: string): string => {
  return name
    .replace(/\s+/g, '-')
    .replace(/[/\\:*?"<>|]/g, '')
    .toLowerCase();
};
