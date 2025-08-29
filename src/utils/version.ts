import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getPackageVersion = (): string => {
  try {
    // Find package.json starting from the compiled file's location
    let currentDir = __dirname;
    let packageJsonPath: string;

    // Look for package.json in current directory and parent directories
    while (currentDir !== path.dirname(currentDir)) {
      packageJsonPath = path.join(currentDir, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = fs.readJsonSync(packageJsonPath);
        return packageJson.version;
      }
      currentDir = path.dirname(currentDir);
    }

    // Fallback: try the standard relative path
    packageJsonPath = path.join(__dirname, '../../package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = fs.readJsonSync(packageJsonPath);
      return packageJson.version;
    }

    return '1.0.0';
  } catch (error) {
    return '1.0.0';
  }
};

export const getVersionTag = (): string => {
  const version = getPackageVersion();
  return `v${version}`;
};
