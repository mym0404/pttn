import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTempDir, cleanupTempDir, createTestClaudeDir, runCLI } from '../../utils/test-helpers';

describe('Plan CLI Commands', () => {
  let tempDir: string;
  let claudeDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir('plan-cli-test');
    claudeDir = await createTestClaudeDir(tempDir);
    process.chdir(tempDir);
  });

  afterEach(async () => {
    process.chdir(__dirname);
    await cleanupTempDir(tempDir);
  });

  describe('plan create', () => {
    it('should create a new plan', () => {
      const output = runCLI('plan create "Migration Plan" "Database migration strategy"', tempDir);
      
      expect(output).toContain('created successfully');
    });
  });

  describe('plan list', () => {
    it('should list all plans', () => {
      runCLI('plan create "Plan Alpha" "First plan"', tempDir);
      runCLI('plan create "Plan Beta" "Second plan"', tempDir);
      
      const output = runCLI('plan list', tempDir);
      
      expect(output).toContain('Plan Alpha');
      expect(output).toContain('Plan Beta');
    });

    it('should show empty message when no plans exist', () => {
      const output = runCLI('plan list', tempDir);
      
      expect(output).toContain('No plans found');
    });
  });

  describe('plan view', () => {
    it('should display plan content', () => {
      runCLI('plan create "Test Plan" "Strategic implementation details"', tempDir);
      
      const output = runCLI('plan view 1', tempDir);
      
      expect(output).toContain('Strategic implementation details');
    });
  });

  describe('plan edit', () => {
    it('should update plan content', () => {
      runCLI('plan create "Original Plan" "Original content"', tempDir);
      runCLI('plan edit 1 "Updated content with new details"', tempDir);
      
      const output = runCLI('plan view 1', tempDir);
      
      expect(output).toContain('Updated content with new details');
      expect(output).not.toContain('Original content');
    });
  });

  // Note: plan delete command exists in the CLI
});