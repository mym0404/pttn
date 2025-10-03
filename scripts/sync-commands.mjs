#!/usr/bin/env zx
/* eslint-disable max-len */
// #region ZX Util
import fs from 'fs-extra'

const join = path.join;
const resolve = path.resolve;
const filename = path.basename(__filename);
const cwd = () => process.cwd();
const exit = process.exit;
const _printTag = '' || filename;

const exist = (path) => fs.existsSync(path);

const isDir = (path) => exist(path) && fs.lstatSync(path).isDirectory();

const isFile = (path) => exist(path) && fs.lstatSync(path).isFile();

const iterateDir = async (path, fn) => {
  if (!isDir(path)) return;
  for (const file of fs.readdirSync(path)) {
    await fn(file);
  }
};

const read = (path) => fs.readFileSync(path, { encoding: 'utf8' });

const readJsonSlow = (path) => fs.readJSONSync(path);

const write = (p, content) => {
  const dir = path.dirname(p);
  if (!exist(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return fs.writeFileSync(p, content);
};

const writeJson = (path, json) => write(path, JSON.stringify(json, null, 2));

const remove = (path) => {
  if (!exist(path)) return;
  if (fs.lstatSync(path).isDirectory()) {
    return fs.rmSync(path, { force: true, recursive: true });
  } else {
    return fs.rmSync(path, { force: true });
  }
};

const addLine = (str, added, backward = false) => {
  if (backward) {
    return added + '\n' + str;
  } else {
    return str + '\n' + added;
  }
};

const addLineToFile = (path, added, backward = false) =>
  write(path, addLine(read(path), added, backward));

const print = (...args) => echo(chalk.blue(`[${_printTag}]`, ...args));

const printSuccess = (...args) => echo(chalk.bold.bgBlue(`[${_printTag}]`, ...args));

const printError = (...args) => echo(chalk.bold.bgRed(`[${_printTag}]`, ...args));

const asrt = (condition, ...args) => {
  if (!condition) {
    echo(chalk.bold.bgRed(`[${_printTag}]`, ...args));
    exit(1);
  }
};

const input = async (message) => {
  if (message) {
    return question(message + ': ');
  } else {
    return stdin();
  }
};

// #endregion

async function main() {
  const templateDir = resolve(cwd(), 'templates/commands');
  const targetDir = resolve(cwd(), '.claude/commands');

  print('Starting command sync from templates/commands to .claude/commands');

  // Ensure source directory exists
  asrt(isDir(templateDir), 'Templates directory not found:', templateDir);

  // Create target directory if it doesn't exist
  if (!exist(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    print('Created target directory:', targetDir);
  }

  // Get all .md files from templates directory
  const templateFiles = fs.readdirSync(templateDir).filter(file => file.endsWith('.md'));

  if (templateFiles.length === 0) {
    printError('No template files found in', templateDir);
    exit(1);
  }

  print(`Found ${templateFiles.length} template files to sync`);

  // Copy each template file to target directory
  for (const file of templateFiles) {
    const sourcePath = join(templateDir, file);
    const targetPath = join(targetDir, file);

    const content = `
**IMPORTANT**: npx pttn not working in this project because this is project of pttn cli.
instead, run \`pnpm build\` and \`node dist/cli.js\` directly.
 
----------------------------
 
${read(sourcePath)}`;
    write(targetPath, content);

    print(`Synced: ${file}`);
  }

  printSuccess(`Successfully synced ${templateFiles.length} command files`);
  print('Source:', templateDir);
  print('Target:', targetDir);
}

main();
