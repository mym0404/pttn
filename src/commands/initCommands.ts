import { Command } from 'commander';
import { existsSync, readFileSync } from 'fs';
import { cp, readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

import {
  ensureDir,
  getCommandTemplatesPath,
  getPromptTemplatesPath,
  logger,
} from '../utils';

const setupClaudeSelfReferProject = async (
  claudeDir: string
): Promise<void> => {
  logger.startWorkflow('Pattern Project Setup');

  try {
    // Use version-specific URL if not provided
    const commandsDir = resolve(claudeDir, 'commands');

    // Create directory structure
    logger.info('Creating directory structure');
    await ensureDir(resolve(claudeDir, 'patterns'));
    await ensureDir(commandsDir);

    // Copy command templates from bundled assets
    logger.info('Copying command templates from bundle');

    try {
      const templatesSourceDir = getCommandTemplatesPath();

      // Check if templates directory exists in bundle
      if (!existsSync(templatesSourceDir)) {
        throw new Error('Command templates not found in bundle');
      }

      // Copy all command template files
      await cp(templatesSourceDir, commandsDir, {
        recursive: true,
        force: true,
      });

      logger.success('Command templates copied successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      logger.error('Failed to copy command templates', errorMessage);
      throw error;
    }

    // Setup Claude Code permissions
    await setupClaudePermissions(claudeDir);

    logger.success('Pattern Project Setup completed');
  } catch (error) {
    logger.error('Pattern Project Setup failed');
    throw error;
  }
};
const setupClaudePermissions = async (claudeDir: string): Promise<void> => {
  const settingsPath = resolve(claudeDir, 'settings.local.json');
  const requiredPermissions = [
    'Bash(npx pttn:*)',
    'Bash(npx pttn *)',
    'Bash(pttn:*)',
    'Bash(npx pttn *)',
  ];

  try {
    let settings: { permissions: { allow: string[] } };

    if (existsSync(settingsPath)) {
      const content = await readFile(settingsPath, 'utf-8');
      settings = JSON.parse(content);
    } else {
      settings = {
        permissions: {
          allow: [],
        },
      };
    }

    if (!settings.permissions) {
      settings.permissions = { allow: [] };
    }
    if (!settings.permissions.allow) {
      settings.permissions.allow = [];
    }

    let added = false;
    for (const permission of requiredPermissions) {
      if (!settings.permissions.allow.includes(permission)) {
        settings.permissions.allow.push(permission);
        added = true;
      }
    }

    if (added) {
      await writeFile(settingsPath, JSON.stringify(settings, null, 2));
      logger.success('Added pttn permissions to Claude Code settings');
    } else {
      logger.info('Claude Code permissions already configured');
    }
  } catch (error) {
    logger.warning(
      'Failed to setup Claude Code permissions. You may need to add them manually.'
    );
  }
};

export const registerInitCommands = (
  program: Command,
  getContentDir: (cmdOptions: { dir?: string }) => string
): void => {
  program
    .command('init-get-prompt')
    .description('Get initialization prompt for Claude Code to execute')
    .action(async () => {
      try {
        const promptPath = resolve(getPromptTemplatesPath(), 'init.md');
        if (existsSync(promptPath)) {
          const promptContent = readFileSync(promptPath, 'utf-8');
          console.log(promptContent);
        } else {
          logger.error('Prompt template not found');
          process.exit(1);
        }
      } catch (error) {
        logger.error('Failed to read prompt', error);
        process.exit(1);
      }
    });

  program
    .command('get-commands')
    .description(
      'Setup Claude Code project directory structure and download command templates'
    )
    .action(async (options: { dir?: string }) => {
      try {
        const claudeDir = getContentDir(options);
        await setupClaudeSelfReferProject(claudeDir);
      } catch (error) {
        logger.error('Project setup failed', error);
        process.exit(1);
      }
    });
};
