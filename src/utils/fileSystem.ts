import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';

export const ensureDir = async (path: string): Promise<void> => {
  if (!existsSync(path)) {
    await mkdir(path, { recursive: true });
  }
};
