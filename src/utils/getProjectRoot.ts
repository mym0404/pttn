import { findProjectRoot } from 'workspace-tools';

export const getProjectRoot = (): string | null =>
  findProjectRoot(process.cwd());
