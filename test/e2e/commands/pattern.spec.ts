import { afterEach,beforeEach, describe, expect, it } from 'vitest';

import { cleanupTempDir, createTempDir, createTestClaudeDir, runCLI } from '../../utils/test-helpers';

describe('Pattern CLI Commands', () => {
  let tempDir: string;
  let claudeDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir('pattern-cli-test');
    claudeDir = await createTestClaudeDir(tempDir);
    process.chdir(tempDir);
  });

  afterEach(async () => {
    process.chdir(__dirname);
    await cleanupTempDir(tempDir);
  });

  describe('pattern create', () => {
    it('should show creation message', () => {
      const output = runCLI('pattern create "React Hook" "Custom hook pattern"', tempDir);

      expect(output).toContain('🚀 Creating Code Pattern');
    });
  });

  describe('pattern list', () => {
    it('should list all patterns', () => {
      runCLI('pattern create "Pattern One" "Content 1"', tempDir);
      runCLI('pattern create "Pattern Two" "Content 2"', tempDir);

      const output = runCLI('pattern list', tempDir);

      expect(output).toContain('Pattern One');
      expect(output).toContain('Pattern Two');
    });
  });

  describe('pattern view', () => {
    it('should display pattern content', () => {
      runCLI('pattern create "Test Pattern" "Pattern implementation details"', tempDir);

      const output = runCLI('pattern view 1', tempDir);

      expect(output).toContain('Pattern implementation details');
    });
  });

  describe('pattern search', () => {
    beforeEach(() => {
      runCLI('pattern create "React Hook Pattern" "useEffect and useState"', tempDir);
      runCLI('pattern create "Redux Pattern" "Redux store setup"', tempDir);
      runCLI('pattern create "API Pattern" "REST API integration"', tempDir);
    });

    it('should find patterns by keyword', () => {
      const output = runCLI('pattern search "hook"', tempDir);

      expect(output).toContain('React Hook Pattern');
      expect(output).not.toContain('Redux Pattern');
    });
  });

  // Note: pattern delete command is not implemented in the CLI
});
