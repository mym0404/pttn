import { execaSync } from 'execa';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

export const createTempDir = async (prefix: string = 'cc-self-refer-test'): Promise<string> => {
  const tempDir = path.join(os.tmpdir(), `${prefix}-${Date.now()}`);
  await fs.ensureDir(tempDir);
  return tempDir;
};

export const cleanupTempDir = async (dirPath: string): Promise<void> => {
  if (await fs.pathExists(dirPath)) {
    await fs.remove(dirPath);
  }
};

export const createTestClaudeDir = async (baseDir: string): Promise<string> => {
  const claudeDir = path.join(baseDir, '.claude');
  await fs.ensureDir(path.join(claudeDir, 'pages'));
  await fs.ensureDir(path.join(claudeDir, 'plans'));
  await fs.ensureDir(path.join(claudeDir, 'patterns'));
  await fs.ensureDir(path.join(claudeDir, 'specs'));
  return claudeDir;
};

export const runCLI = (args: string, cwd?: string): string => {
  const cliPath = path.resolve(__dirname, '../../dist/cli.js');
  const workingDir = cwd || process.cwd();
  const argArray = args.split(' ').filter(arg => arg.length > 0);

  try {
    const result = execaSync('node', [cliPath, ...argArray], {
      cwd: workingDir,
      env: { ...process.env, NODE_ENV: 'test' },
    });
    return result.stdout;
  } catch (error: any) {
    if (error.stdout) {
      return error.stdout;
    }
    if (error.stderr) {
      return error.stderr;
    }
    throw error;
  }
};

export const createTestFile = async (
  dirPath: string,
  fileName: string,
  content: string
): Promise<string> => {
  const filePath = path.join(dirPath, fileName);
  await fs.writeFile(filePath, content, 'utf-8');
  return filePath;
};

export const readTestFile = async (filePath: string): Promise<string> => {
  return await fs.readFile(filePath, 'utf-8');
};

export const fileExists = async (filePath: string): Promise<boolean> => {
  return await fs.pathExists(filePath);
};

export const listFiles = async (dirPath: string): Promise<string[]> => {
  if (!(await fs.pathExists(dirPath))) {
    return [];
  }
  return await fs.readdir(dirPath);
};
