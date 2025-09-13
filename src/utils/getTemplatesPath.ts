import { resolve } from 'path';

/**
 * Get the path to the bundled templates directory
 */
export const getTemplatesPath = (): string => {
  return resolve(import.meta.dirname, 'templates');
};

/**
 * Get the path to the commands templates directory
 */
export const getCommandTemplatesPath = (): string => {
  return resolve(getTemplatesPath(), 'commands');
};

/**
 * Get the path to the prompts templates directory
 */
export const getPromptTemplatesPath = (): string => {
  return resolve(getTemplatesPath(), 'prompts');
};
