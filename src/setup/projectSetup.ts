import { exec } from 'child_process';
import { existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import { promisify } from 'util';

import { ensureDir } from '../utils';

const execAsync = promisify(exec);

export const setupClaudeSelfReferProject = async (
  projectDir: string,
  repoUrl: string = 'https://raw.githubusercontent.com/mym0404/cc-self-refer/main'
): Promise<void> => {
  const claudeDir = resolve(projectDir, '.claude');
  const commandsDir = resolve(claudeDir, 'commands');

  console.log('🚀 Initializing Claude Code project with cc-self-refer...\n');

  // Create directory structure
  console.log('📁 Creating directory structure...');
  await ensureDir(resolve(claudeDir, 'pages'));
  await ensureDir(resolve(claudeDir, 'plans'));
  await ensureDir(resolve(claudeDir, 'patterns'));
  await ensureDir(resolve(claudeDir, 'knowledges'));
  await ensureDir(commandsDir);

  // Command files to download
  const commandFiles = [
    'page-save.md',
    'plan-create.md',
    'plan-edit.md',
    'plan-resolve.md',
    'page-refer.md',
    'knowledge-refer.md',
    'pattern-use.md',
    'pattern-create.md',
    'knowledge-create.md',
  ];

  console.log('📡 Downloading command templates...');

  let failCount = 0;

  for (const file of commandFiles) {
    try {
      const url = `${repoUrl}/templates/commands/${file}`;
      const filePath = resolve(commandsDir, file);

      // Check if file exists and ask for confirmation
      if (existsSync(filePath)) {
        console.log(`⚠️  File ${file} already exists - overwriting...`);
      }

      // Download using curl
      const { stdout, stderr } = await execAsync(`curl -fsSL "${url}"`);

      if (stderr) {
        console.log(`❌ Failed to download ${file}: ${stderr}`);
        failCount++;
        continue;
      }

      await writeFile(filePath, stdout);
      console.log(`✅ Downloaded ${file}`);
    } catch (error) {
      console.log(
        `❌ Failed to download ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      failCount++;
    }
  }

  if (failCount > 0) {
    throw new Error(
      `Failed to download ${failCount} files. Please check your internet connection and try again.`
    );
  }
};
