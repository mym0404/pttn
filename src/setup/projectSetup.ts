import { exec } from 'child_process';
import { existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import { promisify } from 'util';

import { ensureDir } from '../utils/index.js';

const execAsync = promisify(exec);

// Fetch list of command files from GitHub API
const fetchCommandFileList = async (): Promise<string[]> => {
  try {
    const apiUrl = 'https://api.github.com/repos/mym0404/cc-self-refer/contents/templates/commands';
    const { stdout } = await execAsync(`curl -fsSL "${apiUrl}"`);
    const files = JSON.parse(stdout);
    
    return files
      .filter((file: any) => file.type === 'file' && file.name.endsWith('.md'))
      .map((file: any) => file.name);
  } catch (error) {
    console.log('⚠️  Failed to fetch file list from GitHub API, using fallback list...');
    // Fallback to known files if API fails
    return [
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
  }
};

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

  // Fetch command files dynamically
  console.log('🔍 Fetching available command templates...');
  const commandFiles = await fetchCommandFileList();
  console.log(`📋 Found ${commandFiles.length} command templates to download`);

  console.log('📡 Downloading command templates...');

  let successCount = 0;
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
      successCount++;
    } catch (error) {
      console.log(
        `❌ Failed to download ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      failCount++;
    }
  }

  console.log('\n🎯 Initialization Summary:');
  console.log(`✅ Successfully downloaded: ${successCount} files`);
  if (failCount > 0) {
    console.log(`❌ Failed to download: ${failCount} files`);
  }

  console.log('\n📁 Created directories:');
  console.log('  .claude/commands/     - Claude Code commands');
  console.log('  .claude/pages/        - Session history');
  console.log('  .claude/plans/        - Strategic plans');
  console.log('  .claude/patterns/ - Reusable code patterns');
  console.log('  .claude/knowledges/    - Domain knowledge base');

  console.log('\n🎯 Available commands:');
  console.log('  /page-save            - Manage session pages');
  console.log('  /plan-create          - Create new strategic plans');
  console.log('  /plan-edit            - Edit existing strategic plans');
  console.log('  /plan-resolve         - View and load strategic plans');
  console.log('  /page-refer           - Load session context');
  console.log('  /knowledge-refer      - Access domain knowledge');
  console.log('  /pattern-use     - Apply saved code patterns');
  console.log('  /pattern-create         - Save new code patterns');

  console.log('\n🚀 Next steps:');
  console.log(
    '  1. Start using commands: /plan-create "My Project" "Description"'
  );
  console.log('  2. Build your knowledge: /knowledge-refer and /pattern-use');
  console.log(
    "  3. All commands work with your project's local .claude directory"
  );

  if (failCount > 0) {
    throw new Error(
      `Failed to download ${failCount} files. Please check your internet connection and try again.`
    );
  }
};
