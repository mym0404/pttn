import pc from 'picocolors';

import { logger } from './logger.js';

export interface FormatOptions {
  type: 'page' | 'plan' | 'pattern' | 'spec';
  searchTerm?: string;
  title: string;
}

// Common search result formatting function
export const formatSearchResults = <
  TResult extends { file: string; title: string; score?: number },
  TItem extends { file: string; title: string; content?: string },
>(
  results: TResult[],
  allItems: TItem[],
  options: FormatOptions,
  getMetadata: (item: TItem) => string
): void => {
  if (results.length === 0) {
    logger.warning(`No ${options.type}s found for "${options.searchTerm}"`);
    console.log(`\nAvailable ${options.type}s:`);
    allItems.slice(0, 5).forEach((item) => {
      const id = (item as any).id || 1;
      console.log(`${id}. ${item.title}`);
    });
  } else if (results.length === 1) {
    const item = allItems.find((p) => p.file === results[0].file);
    if (item?.content) {
      console.log(item.content);
    }
  } else {
    console.log(`${options.title}s found for "${options.searchTerm}":\n`);
    results.forEach((result) => {
      const item = allItems.find((p) => p.file === result.file);
      const score = result.score ? ` (score: ${result.score.toFixed(2)})` : '';
      const id = (item as any)?.id || 1;
      console.log(`${id}. ${result.title}${score}`);
      if (item) {
        console.log(`   ${getMetadata(item)}`);
      }
    });
  }
};

// Common format options creator
export const createFormatOptions = (
  type: FormatOptions['type'],
  searchTerm?: string
): FormatOptions => {
  const configs = {
    page: { title: 'Page' },
    plan: { title: 'Plan' },
    pattern: { title: 'Pattern' },
    spec: { title: 'Spec' },
  };

  const config = configs[type];
  return {
    type,
    searchTerm,
    title: config.title,
  };
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

// No match result formatting function
export const formatNoMatchResult = (
  type: FormatOptions['type'],
  searchTerm: string
): void => {
  logger.error(`No ${type}s found matching "${searchTerm}"`);
};
