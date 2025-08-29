import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createPatternManager } from '@/managers';

import { cleanupTempDir, createTempDir, createTestClaudeDir, listFiles, readTestFile } from '../../utils/test-helpers';

describe('PatternManager', () => {
  let tempDir: string;
  let claudeDir: string;
  let patternManager: ReturnType<typeof createPatternManager>;

  beforeEach(async () => {
    tempDir = await createTempDir('pattern-manager-test');
    claudeDir = await createTestClaudeDir(tempDir);
    patternManager = createPatternManager(claudeDir);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  describe('create', () => {
    it('should create a new pattern file and return filename', async () => {
      const filename = await patternManager.create('Test Pattern', 'Test content');

      expect(filename).toBe('001-test-pattern.md');

      const files = await listFiles(path.join(claudeDir, 'patterns'));
      expect(files).toContain('001-test-pattern.md');

      const content = await readTestFile(path.join(claudeDir, 'patterns', filename));
      expect(content).toContain('Test content');
      expect(content).toContain('# Test Pattern');
      expect(content).toContain('**Language**: text');
    });

    it('should increment file number for multiple patterns', async () => {
      const filename1 = await patternManager.create('First Pattern', 'Content 1');
      const filename2 = await patternManager.create('Second Pattern', 'Content 2');

      expect(filename1).toBe('001-first-pattern.md');
      expect(filename2).toBe('002-second-pattern.md');

      const files = await listFiles(path.join(claudeDir, 'patterns'));
      expect(files).toHaveLength(2);
      expect(files).toContain('001-first-pattern.md');
      expect(files).toContain('002-second-pattern.md');
    });

    it('should create pattern with specified language', async () => {
      const filename = await patternManager.create('JS Pattern', 'const x = 1;', 'javascript');

      const content = await readTestFile(path.join(claudeDir, 'patterns', filename));
      expect(content).toContain('**Language**: javascript');
      expect(content).toContain('const x = 1;');
    });
  });

  describe('list', () => {
    it('should list all pattern files', async () => {
      await patternManager.create('Pattern One', 'Content 1');
      await patternManager.create('Pattern Two', 'Content 2');

      const patterns = await patternManager.list();

      expect(patterns).toHaveLength(2);
      // Results are sorted by id DESC, so newest first
      expect(patterns[0].id).toBe(2);
      expect(patterns[0].title).toBe('Pattern Two');
      expect(patterns[1].id).toBe(1);
      expect(patterns[1].title).toBe('Pattern One');
      
      // Check structure
      expect(patterns[0]).toHaveProperty('file');
      expect(patterns[0]).toHaveProperty('language');
      expect(patterns[0]).toHaveProperty('lastUpdated');
      expect(patterns[0]).toHaveProperty('content');
    });

    it('should return empty array when no patterns exist', async () => {
      const patterns = await patternManager.list();
      expect(patterns).toEqual([]);
    });
  });

  describe('view', () => {
    it('should return pattern content by ID string', async () => {
      await patternManager.create('Test Pattern', 'Test content for viewing');

      const content = await patternManager.view('1');

      expect(content).toContain('Test content for viewing');
      expect(content).toContain('# Test Pattern');
    });

    it('should return pattern content by keyword search', async () => {
      await patternManager.create('React Component', 'React hooks pattern');

      const content = await patternManager.view('React');

      expect(content).toContain('React hooks pattern');
    });

    it('should throw error for non-existent pattern', async () => {
      await expect(patternManager.view('999')).rejects.toThrow('Pattern not found: 999');
    });

    it('should throw error for non-matching keyword', async () => {
      await patternManager.create('Test', 'content');
      await expect(patternManager.view('nonexistent')).rejects.toThrow('Pattern not found: nonexistent');
    });
  });

  describe('search', () => {
    beforeEach(async () => {
      await patternManager.create('React Component', 'React component pattern with hooks', 'javascript');
      await patternManager.create('Vue Template', 'Vue template with composition API', 'javascript');
      await patternManager.create('Angular Service', 'Angular service with dependency injection', 'typescript');
    });

    it('should find patterns by keyword with category format', async () => {
      const results = await patternManager.search('component');

      expect(results.length).toBeGreaterThan(0);
      // Title includes category: "React Component (javascript)"
      expect(results[0].title).toBe('React Component (javascript)');
      expect(results[0]).toHaveProperty('file');
      expect(results[0]).toHaveProperty('score');
      expect(results[0]).toHaveProperty('language');
    });

    it('should find patterns with partial matches', async () => {
      const results = await patternManager.search('serv');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toBe('Angular Service (typescript)');
    });

    it('should filter by language when specified', async () => {
      const results = await patternManager.search('template', 'javascript');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toBe('Vue Template (javascript)');
      expect(results[0].language).toBe('javascript');
    });

    it('should return empty array for no matches', async () => {
      const results = await patternManager.search('nonexistent');
      expect(results).toEqual([]);
    });

    it('should return search results with proper structure', async () => {
      const results = await patternManager.search('React');

      expect(results[0]).toHaveProperty('title');
      expect(results[0]).toHaveProperty('file');
      expect(results[0]).toHaveProperty('score');
      expect(results[0]).toHaveProperty('language');
      expect(results[0]).toHaveProperty('matchedFields');
      expect(results[0]).toHaveProperty('highlights');
      expect(results[0]).toHaveProperty('scoreBreakdown');
    });
  });

  // Note: PatternManager does not implement delete method
});
