import pc from 'picocolors';

import type { PatternInfo } from '../types/content.js';
import { logger } from './logger.js';
import type { PatternSearchResult } from './patternSearch.js';

// Pattern-specific search result formatting
export const formatPatternSearchResults = (
  results: PatternSearchResult[],
  allPatterns: PatternInfo[],
  searchTerm: string
): void => {
  if (results.length === 0) {
    logger.warning(`No patterns found for "${searchTerm}"`);
    console.log('\nAvailable patterns:');
    allPatterns.slice(0, 5).forEach((p) => {
      console.log(`${p.id}. ${p.title}`);
    });
    return;
  }

  if (results.length === 1) {
    const pattern = allPatterns.find((p) => p.file === results[0].file);
    if (pattern?.content) {
      console.log(pattern.content);
    }
    return;
  }

  console.log(`Patterns found for "${searchTerm}":\n`);
  results.forEach((result) => {
    const pattern = allPatterns.find((p) => p.file === result.file);
    const score = ` (score: ${result.score.toFixed(2)})`;
    console.log(`${pattern?.id}. ${result.title}${score}`);
    if (pattern) {
      const metadata = `[${pc.green(pattern.language)}]${pattern.keywords && pattern.keywords.length > 0 ? ` - Keywords: ${pattern.keywords.join(', ')}` : ''}${pattern.explanation ? ` - ${pc.white(pattern.explanation)}` : ''}`;
      console.log(`   ${metadata}`);
    }
  });
};

// Common view formatting function
export const formatViewResult = (content?: string): void => {
  if (content) {
    console.log(content);
  }
};

// List formatting function
export const formatList = (
  title: string,
  items: Array<{ id: number; text: string }>
): void => {
  if (items.length === 0) {
    logger.warning(`No ${title.toLowerCase()} found`);
    return;
  }

  console.log(pc.cyan(`\n${title}:`));
  items.forEach((item) => {
    console.log(`  ${item.id}. ${item.text}`);
  });
  console.log();
};
