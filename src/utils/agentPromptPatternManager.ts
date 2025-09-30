import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import type { AgentSelection } from '../constants/agents.js';
import type { PatternInfo } from '../types/index.js';
import { resolveAgentSelection } from './agentConfig.js';
import { getProjectRoot } from './getProjectRoot';

const PATTERN_LIST_START = '[PATTERN LIST]';
const PATTERN_LIST_END = '[PATTERN LIST END]';

const generatePatternListTable = (patterns: PatternInfo[]): string => {
  if (patterns.length === 0) {
    return `${PATTERN_LIST_START}

No patterns available yet.

${PATTERN_LIST_END}`;
  }

  let table = `${PATTERN_LIST_START}

| ID | Name | Language | Keywords | Explanation |
|----|------|----------|----------|-------------|
`;

  for (const pattern of patterns) {
    const paddedId = pattern.id.toString().padStart(3, '0');
    const cleanName = pattern.title.replace(/[#!*_`]/g, '').trim();
    const keywordString = pattern.keywords.join(', ');

    table += `| ${paddedId} | ${cleanName} | ${pattern.language} | ${keywordString} | ${pattern.explanation} |\n`;
  }

  table += `
${PATTERN_LIST_END}`;

  return table;
};

const resolvePromptPath = async ({
  contentDir,
}: {
  contentDir?: string;
}): Promise<{ selection: AgentSelection; promptPath: string }> => {
  const projectRoot = getProjectRoot();
  if (!projectRoot) {
    throw new Error(
      'Unable to determine project root for agent prompt synchronization'
    );
  }

  const resolvedContentDir = contentDir ?? join(projectRoot, '.claude');
  const selection = await resolveAgentSelection({
    contentDir: resolvedContentDir,
  });
  const promptPath = join(projectRoot, selection.promptFile);

  return { selection, promptPath };
};

export const syncAgentPromptPatternTable = async (
  patterns: PatternInfo[],
  options: { contentDir?: string } = {}
): Promise<AgentSelection> => {
  const { selection, promptPath } = await resolvePromptPath(options);

  let content = '';
  if (existsSync(promptPath)) {
    content = await readFile(promptPath, 'utf-8');
  }

  const sortedPatterns = [...patterns].sort((a, b) => a.id - b.id);
  const patternListContent = generatePatternListTable(sortedPatterns);

  const startIndex = content.indexOf(PATTERN_LIST_START);
  const endIndex = content.indexOf(PATTERN_LIST_END);

  if (startIndex !== -1 && endIndex !== -1) {
    const beforeSection = content.substring(0, startIndex);
    const afterSection = content.substring(endIndex + PATTERN_LIST_END.length);
    content = `${beforeSection}${patternListContent}${afterSection}`;
  } else {
    content = `${content.trimEnd()}

${patternListContent}
`;
  }

  await writeFile(promptPath, content);

  return selection;
};

export const syncClaudeMdPatternTable = async (
  patterns: PatternInfo[],
  options: { contentDir?: string } = {}
): Promise<void> => {
  await syncAgentPromptPatternTable(patterns, options);
};
