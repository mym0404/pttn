import { Command } from 'commander';
import { existsSync, readFileSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

import {
  downloadFile,
  ensureDir,
  getVersionTag,
  logger,
  withWorkflow,
} from '../utils';

const setupClaudeSelfReferProject = async (
  projectDir: string,
  repoUrl?: string
): Promise<void> => {
  await withWorkflow('CC Self-Refer Project Setup', async () => {
    // Use version-specific URL if not provided
    if (!repoUrl) {
      const versionTag = getVersionTag();
      repoUrl = `https://raw.githubusercontent.com/mym0404/cc-self-refer/${versionTag}`;
    }
    const claudeDir = resolve(projectDir, '.claude');
    const commandsDir = resolve(claudeDir, 'commands');

    // Create directory structure
    logger.info('Creating directory structure');
    await ensureDir(resolve(claudeDir, 'pages'));
    await ensureDir(resolve(claudeDir, 'plans'));
    await ensureDir(resolve(claudeDir, 'patterns'));
    await ensureDir(resolve(claudeDir, 'specs'));
    await ensureDir(commandsDir);

    // Command files to download
    const commandFiles = [
      'page-save.md',
      'plan-create.md',
      'plan-edit.md',
      'plan-resolve.md',
      'page-refer.md',
      'spec-refer.md',
      'pattern-use.md',
      'pattern-create.md',
      'spec.md',
    ];

    logger.info('Downloading command templates');
    let failCount = 0;

    for (let i = 0; i < commandFiles.length; i++) {
      const file = commandFiles[i];
      logger.progress(i + 1, commandFiles.length, `Downloading ${file}`);

      try {
        const url = `${repoUrl}/templates/commands/${file}`;
        const filePath = resolve(commandsDir, file);

        // Check if file exists
        if (existsSync(filePath)) {
          logger.warning(`File ${file} already exists - overwriting`);
        }

        // Download using fetch utility
        const content = await downloadFile(url);
        await writeFile(filePath, content);
        logger.success(`Downloaded ${file}`);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Failed to download ${file}`, errorMessage);
        failCount++;
      }
    }

    if (failCount > 0) {
      throw new Error(
        `Failed to download ${failCount} files. Please check your internet connection and try again.`
      );
    }

    // Setup Claude Code permissions
    await setupClaudePermissions(claudeDir);
  });
};
const setupClaudePermissions = async (claudeDir: string): Promise<void> => {
  const settingsPath = resolve(claudeDir, 'settings.local.json');
  const requiredPermissions = [
    'Bash(npx cc-self-refer:*)',
    'Bash(npx -y cc-self-refer:*)',
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
      logger.success('Added cc-self-refer permissions to Claude Code settings');
    } else {
      logger.info('Claude Code permissions already configured');
    }
  } catch (error) {
    logger.warning(
      'Failed to setup Claude Code permissions. You may need to add them manually.'
    );
  }
};

export const registerInitCommands = (program: Command): void => {
  program
    .command('init-get-prompt')
    .description('Get initialization prompt for Claude Code to execute')
    .action(async () => {
      try {
        const promptPath = resolve(
          import.meta.dirname,
          '..',
          'templates',
          'prompts',
          'init.md'
        );
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
    .command('init-setup-project')
    .description(
      'Setup Claude Code project directory structure and download command templates'
    )
    .option(
      '--repo <url>',
      'Custom repository URL',
      'https://raw.githubusercontent.com/mym0404/cc-self-refer/main'
    )
    .action(async (options: { repo?: string }) => {
      try {
        await setupClaudeSelfReferProject(process.cwd(), options.repo);
      } catch (error) {
        logger.error('Project setup failed', error);
        process.exit(1);
      }
    });
};
