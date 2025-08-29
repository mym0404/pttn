import { execaSync } from 'execa';

export async function setup() {
  console.log('Building project before running tests...');
  try {
    execaSync('npx', ['tsdown'], {
      stdio: 'inherit',
    });
    console.log('Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}
