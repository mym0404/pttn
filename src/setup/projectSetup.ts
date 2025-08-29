import { exec } from 'child_process';
import { existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import { promisify } from 'util';

import { ensureDir, logger, withWorkflow } from '../utils';
import { getVersionTag } from '../utils/version';

const execAsync = promisify(exec);

export const setupClaudeSelfReferProject = async (
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

        // Download using curl
        const { stdout, stderr } = await execAsync(`curl -fsSL "${url}"`);

        if (stderr) {
          logger.error(`Failed to download ${file}`, stderr);
          failCount++;
          continue;
        }

        await writeFile(filePath, stdout);
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
  });
};
