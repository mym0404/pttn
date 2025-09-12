import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import type { PatternInfo } from '../types';
import { getProjectRoot } from './getProjectRoot';

const PATTERN_LIST_START = '[PATTERN LIST]';
const PATTERN_LIST_END = '[PATTERN LIST END]';

/**
 * Generate markdown table for pattern list
 */
const generatePatternListTable = (patterns: PatternInfo[]): string => {
  if (patterns.length === 0) {
    return `${PATTERN_LIST_START}

No patterns available yet.

${PATTERN_LIST_END}`;
  }

  // Build markdown table
  let table = `${PATTERN_LIST_START}

| ID | Name | Language | Keywords | Explanation |
|----|------|----------|----------|-------------|
`;

  for (const pattern of patterns) {
    // Format ID with padding
    const paddedId = pattern.id.toString().padStart(3, '0');

    // Clean pattern name (remove any markdown formatting)
    const cleanName = pattern.title.replace(/[#*_`]/g, '').trim();

    // Join keywords with comma
    const keywordString = pattern.keywords.join(', ');

    table += `| ${paddedId} | ${cleanName} | ${pattern.language} | ${keywordString} | ${pattern.explanation} |\n`;
  }

  table += `\n${PATTERN_LIST_END}`;

  return table;
};

/**
 * Update CLAUDE.md pattern table with given patterns list (internal)
 */
export const syncClaudeMdPatternTable = async (
  patterns: PatternInfo[]
): Promise<void> => {
  const projectRoot = getProjectRoot();
  const claudeMdPath = join(projectRoot, 'CLAUDE.md');

  // Read existing CLAUDE.md content
  let content: string;
  if (existsSync(claudeMdPath)) {
    content = await readFile(claudeMdPath, 'utf-8');
  } else {
    // Create initial CLAUDE.md if it doesn't exist
    content = ``;
  }

  // Sort patterns by ID
  const sortedPatterns = [...patterns].sort((a, b) => a.id - b.id);

  // Generate updated pattern list table
  const patternListContent = generatePatternListTable(sortedPatterns);

  // Check if pattern list section already exists
  const startIndex = content.indexOf(PATTERN_LIST_START);
  const endIndex = content.indexOf(PATTERN_LIST_END);

  if (startIndex !== -1 && endIndex !== -1) {
    // Replace existing pattern list section
    const beforeSection = content.substring(0, startIndex);
    const afterSection = content.substring(endIndex + PATTERN_LIST_END.length);
    content = beforeSection + patternListContent + afterSection;
  } else {
    // Append pattern list section at the end
    content = content.trimEnd() + '\n\n' + patternListContent + '\n';
  }

  // Write updated content back to CLAUDE.md
  await writeFile(claudeMdPath, content);
};
