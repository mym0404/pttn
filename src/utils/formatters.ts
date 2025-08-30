import pc from 'picocolors';
export interface FormatOptions {
  type: 'page' | 'plan' | 'pattern' | 'spec';
  searchTerm?: string;
  emoji: string;
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
    console.log(`No ${options.type}s found for "${options.searchTerm}".`);
    console.log(`\nAvailable ${options.type}s:`);
    allItems.slice(0, 5).forEach((item, index) => {
      console.log(`${index + 1}. ${item.title}`);
    });
  } else if (results.length === 1) {
    const item = allItems.find((p) => p.file === results[0].file);
    if (item?.content) {
      console.log(item.content);
    }
  } else {
    console.log(
      `${options.emoji} ${options.title}s found for "${options.searchTerm}":\n`
    );
    results.forEach((result, index) => {
      const item = allItems.find((p) => p.file === result.file);
      const score = result.score ? ` (score: ${result.score.toFixed(2)})` : '';
      console.log(`${index + 1}. ${result.title}${score}`);
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
    page: { emoji: '📄', title: 'Page' },
    plan: { emoji: '📋', title: 'Plan' },
    pattern: { emoji: '🧩', title: 'Pattern' },
    spec: { emoji: '📋', title: 'Spec' },
  };

  const config = configs[type];
  return {
    type,
    searchTerm,
    emoji: config.emoji,
    title: config.title,
  };
};

// Common view formatting function
export const formatViewResult = (content?: string): void => {
  if (content) {
    console.log(content);
  }
};

// No match result formatting function
export const formatNoMatchResult = (
  type: FormatOptions['type'],
  searchTerm: string
): void => {
  console.log(pc.redBright(`No ${type}s found matching "${searchTerm}".`));
};
