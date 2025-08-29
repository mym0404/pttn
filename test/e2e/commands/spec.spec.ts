import { afterEach,beforeEach, describe, expect, it } from 'vitest';

import { cleanupTempDir, createTempDir, createTestClaudeDir, runCLI } from '../../utils/test-helpers';

describe('Spec CLI Commands', () => {
  let tempDir: string;
  let claudeDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir('spec-cli-test');
    claudeDir = await createTestClaudeDir(tempDir);
    process.chdir(tempDir);
  });

  afterEach(async () => {
    process.chdir(__dirname);
    await cleanupTempDir(tempDir);
  });

  describe('spec create', () => {
    it('should show interactive planning message', () => {
      const output = runCLI('spec create "API Spec"', tempDir);

      expect(output).toContain('Interactive Specification Planning');
    });
  });

  describe('spec list', () => {
    it('should show empty message when no specs exist', () => {
      const output = runCLI('spec list', tempDir);

      expect(output).toContain('No spec entries found');
    });
  });

  describe('spec search', () => {
    it('should show no results message for empty specs', () => {
      const output = runCLI('spec search "API"', tempDir);

      expect(output).toContain('No matching specifications found');
    });
  });

  // Note: spec delete command is not implemented in the CLI
});
