#!/usr/bin/env zx

// #region ZX Util
import fs from 'fs-extra';

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

const printSuccess = (...args) =>
  echo(chalk.bold.bgBlue(`[${_printTag}]`, ...args));

const printError = (...args) =>
  echo(chalk.bold.bgRed(`[${_printTag}]`, ...args));

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
  print('Starting release process...');

  // Check if git working directory is clean
  const gitStatus = await $`git status --porcelain`.quiet();
  asrt(
    gitStatus.stdout.trim() === '',
    'Git working directory must be clean before release'
  );

  // Build the project
  print('Building project...');
  await $`pnpm run build`;

  // Run tests if they exist
  const packageJson = readJsonSlow('./package.json');
  if (packageJson.scripts?.test) {
    print('Running tests...');
    await $`pnpm test`;
  }

  // Run release-it
  print('Running release-it...');
  await $`npx -y release-it`;
  printSuccess('Release completed successfully!');
}

main();
