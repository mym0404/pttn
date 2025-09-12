import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

interface PatternListEntry {
  id: number;
  name: string;
  keywords: string[];
}

const PATTERN_LIST_START = '[PATTERN LIST]';
const PATTERN_LIST_END = '[PATTERN LIST END]';

/**
 * Update the pattern list in CLAUDE.md with a new pattern
 */
export const updateClaudeMdWithNewPattern = async (
  projectRoot: string,
  patternId: number,
  patternName: string,
  keywords: string[]
): Promise<void> => {
  const claudeMdPath = join(projectRoot, 'CLAUDE.md');

  // Read existing CLAUDE.md content
  let content = '';
  if (existsSync(claudeMdPath)) {
    content = await readFile(claudeMdPath, 'utf-8');
  } else {
    // Create initial CLAUDE.md if it doesn't exist
    content = ``;
  }

  // Get existing patterns
  const existingPatterns = await getPatternListFromClaudeMd(projectRoot);

  // Add new pattern
  existingPatterns.push({
    id: patternId,
    name: patternName,
    keywords,
  });

  // Sort by ID
  existingPatterns.sort((a, b) => a.id - b.id);

  // Generate updated pattern list table
  const patternListContent = generatePatternListTable(existingPatterns);

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

/**
 * Generate markdown table for pattern list
 */
const generatePatternListTable = (patterns: PatternListEntry[]): string => {
  if (patterns.length === 0) {
    return `${PATTERN_LIST_START}

No patterns available yet.

${PATTERN_LIST_END}`;
  }

  // Build markdown table
  let table = `${PATTERN_LIST_START}

| ID | Name | Keywords |
|----|------|----------|
`;

  for (const pattern of patterns) {
    // Format ID with padding
    const paddedId = pattern.id.toString().padStart(3, '0');

    // Clean pattern name (remove any markdown formatting)
    const cleanName = pattern.name.replace(/[#*_`]/g, '').trim();

    // Join keywords with comma
    const keywordString = pattern.keywords.join(', ');

    table += `| ${paddedId} | ${cleanName} | ${keywordString} |\n`;
  }

  table += `\n${PATTERN_LIST_END}`;

  return table;
};

/**
 * Get pattern list from CLAUDE.md
 */
export const getPatternListFromClaudeMd = async (
  projectRoot: string
): Promise<PatternListEntry[]> => {
  const claudeMdPath = join(projectRoot, 'CLAUDE.md');

  if (!existsSync(claudeMdPath)) {
    return [];
  }

  const content = await readFile(claudeMdPath, 'utf-8');

  const startIndex = content.indexOf(PATTERN_LIST_START);
  const endIndex = content.indexOf(PATTERN_LIST_END);

  if (startIndex === -1 || endIndex === -1) {
    return [];
  }

  const patternSection = content.substring(
    startIndex + PATTERN_LIST_START.length,
    endIndex
  );

  const patterns: PatternListEntry[] = [];
  const lines = patternSection.split('\n');

  // Skip header lines and parse table rows
  let inTable = false;
  for (const line of lines) {
    if (line.includes('| ID | Name | Keywords |')) {
      inTable = true;
      continue;
    }

    if (inTable && line.startsWith('|') && !line.startsWith('|-')) {
      const parts = line
        .split('|')
        .map((p) => p.trim())
        .filter((p) => p);
      if (parts.length >= 3) {
        const id = parseInt(parts[0]);
        if (!isNaN(id)) {
          patterns.push({
            id,
            name: parts[1],
            keywords: parts[2] ? parts[2].split(',').map((k) => k.trim()) : [],
          });
        }
      }
    }
  }

  return patterns;
};

/**
 * Remove pattern from CLAUDE.md
 */
export const removePatternFromClaudeMd = async (
  projectRoot: string,
  patternId: number
): Promise<void> => {
  const claudeMdPath = join(projectRoot, 'CLAUDE.md');

  if (!existsSync(claudeMdPath)) {
    return;
  }

  const content = await readFile(claudeMdPath, 'utf-8');
  const patterns = await getPatternListFromClaudeMd(projectRoot);

  // Remove the pattern with matching ID
  const updatedPatterns = patterns.filter((p) => p.id !== patternId);

  // Generate updated pattern list table
  const patternListContent = generatePatternListTable(updatedPatterns);

  // Replace pattern list section
  const startIndex = content.indexOf(PATTERN_LIST_START);
  const endIndex = content.indexOf(PATTERN_LIST_END);

  if (startIndex !== -1 && endIndex !== -1) {
    const beforeSection = content.substring(0, startIndex);
    const afterSection = content.substring(endIndex + PATTERN_LIST_END.length);
    const updatedContent = beforeSection + patternListContent + afterSection;

    await writeFile(claudeMdPath, updatedContent);
  }
};
