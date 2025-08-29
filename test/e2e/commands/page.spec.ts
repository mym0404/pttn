import path from 'path';
import { afterEach,beforeEach, describe, expect, it } from 'vitest';

import { cleanupTempDir, createTempDir, createTestClaudeDir, listFiles,runCLI } from '../../utils/test-helpers';

describe('Page CLI Commands', () => {
  let tempDir: string;
  let claudeDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir('page-cli-test');
    claudeDir = await createTestClaudeDir(tempDir);
    process.chdir(tempDir);
  });

  afterEach(async () => {
    process.chdir(__dirname);
    await cleanupTempDir(tempDir);
  });

  describe('page create', () => {
    it('should show creation message', () => {
      const output = runCLI('page create "Test Page" "Test content for page"', tempDir);

      expect(output).toContain('📄 Creating Page');
    });
  });

  describe('page list', () => {
    it('should list all pages', async () => {
      runCLI('page create "Page One" "Content 1"', tempDir);
      runCLI('page create "Page Two" "Content 2"', tempDir);

      const output = runCLI('page list', tempDir);

      expect(output).toContain('Page One');
      expect(output).toContain('Page Two');
    });

    it('should show empty message when no pages exist', () => {
      const output = runCLI('page list', tempDir);

      expect(output).toContain('No pages found');
    });
  });

  describe('page view', () => {
    it('should display page content', () => {
      runCLI('page create "Test Page" "This is test content"', tempDir);

      const output = runCLI('page view 1', tempDir);

      expect(output).toContain('This is test content');
    });

    it('should show error for non-existent page', () => {
      const output = runCLI('page view 999', tempDir);

      expect(output).toContain('not found');
    });
  });

  describe('page search', () => {
    beforeEach(() => {
      runCLI('page create "React Component" "React hooks and state"', tempDir);
      runCLI('page create "Vue Template" "Vue composition API"', tempDir);
      runCLI('page create "Angular Service" "Angular dependency injection"', tempDir);
    });

    it('should find pages by keyword', () => {
      const output = runCLI('page search "React"', tempDir);

      expect(output).toContain('React Component');
      expect(output).not.toContain('Vue Template');
    });

    it('should show no results message for unmatched search', () => {
      const output = runCLI('page search "nonexistent"', tempDir);

      expect(output).toContain('No pages found');
    });
  });

  // Note: page delete command is not implemented in the CLI
});
