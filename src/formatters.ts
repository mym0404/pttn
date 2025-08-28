import pc from 'picocolors';

export interface FormatOptions {
  type: 'page' | 'plan' | 'pattern' | 'knowledge';
  searchTerm?: string;
  emoji: string;
  title: string;
  outputMode?: 'console' | 'context' | 'both';
}

export interface FormattedItem {
  id: number;
  title: string;
  file: string;
  metadata: string;
  brief?: string;
  content?: string;
}

// Enhanced content analysis functions
const extractKeyInsights = (content: string, type: string): string => {
  const lines = content.split('\n');
  const insights: string[] = [];

  // Extract important points based on content type
  if (type === 'plan') {
    lines.forEach((line) => {
      if (
        line.includes('✅') ||
        line.includes('- [x]') ||
        line.includes('**Key')
      ) {
        insights.push(line.trim());
      }
    });
  } else if (type === 'knowledge') {
    lines.forEach((line) => {
      if (
        line.startsWith('## ') ||
        line.includes('**Important') ||
        line.includes('**Note')
      ) {
        insights.push(line.trim());
      }
    });
  } else if (type === 'pattern') {
    lines.forEach((line) => {
      if (
        line.includes('Usage:') ||
        line.includes('Example:') ||
        line.includes('**Best Practice')
      ) {
        insights.push(line.trim());
      }
    });
  }

  return insights.length > 0
    ? insights.slice(0, 3).join('\n')
    : 'No specific insights extracted';
};

const generateApplicableContext = (
  content: string,
  type: string,
  title: string
): string => {
  const contexts = {
    plan: `This plan provides strategic guidance for implementing ${title}. Use it to understand implementation phases, success criteria, and key considerations.`,
    knowledge: `This domain knowledge about ${title} should inform technical decisions and ensure alignment with business requirements.`,
    pattern: `This code pattern for ${title} can be directly applied or adapted for similar functionality in the current implementation.`,
    page: `This session context about ${title} provides historical development decisions and approaches that may be relevant to current work.`,
  };

  return (
    contexts[type as keyof typeof contexts] ||
    'Apply this information to inform current development decisions.'
  );
};

const generateBriefSummary = (content: string, type: string): string => {
  const lines = content.split('\n').filter((line) => line.trim());

  // Extract first meaningful paragraph or bullet point
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed.length > 30 &&
      !trimmed.startsWith('#') &&
      !trimmed.startsWith('---')
    ) {
      return trimmed.substring(0, 120) + (trimmed.length > 120 ? '...' : '');
    }
  }

  return `${type.charAt(0).toUpperCase() + type.slice(1)} content available for reference`;
};

// Format single match for AI context consumption
export const formatSingleMatch = (
  item: FormattedItem,
  options: FormatOptions
): string => {
  const sections = [
    `# ${options.emoji} ${options.title}: ${item.title}`,
    '',
    `## Source: \`.claude/${options.type}s/${item.file}\``,
    '',
  ];

  if (item.content) {
    sections.push(item.content);
    sections.push('');

    // Add AI-optimized insights
    const keyInsights = extractKeyInsights(item.content, options.type);
    sections.push('## Key Insights');
    sections.push(keyInsights);
    sections.push('');

    const applicableContext = generateApplicableContext(
      item.content,
      options.type,
      item.title
    );
    sections.push('## Applicable Context');
    sections.push(applicableContext);
    sections.push('');
  }

  sections.push('---');
  sections.push('');
  sections.push(`**${options.title} loaded and available for reference**`);

  return sections.join('\n');
};

// Format multiple matches output for AI context
export const formatMultipleMatches = (
  items: FormattedItem[],
  options: FormatOptions
): string => {
  const sections = [
    `# ${options.title} Items Found for "${options.searchTerm}"`,
    '',
    `## Matching ${options.title}:`,
    '',
  ];

  items.forEach((item, index) => {
    const brief = item.content
      ? generateBriefSummary(item.content, options.type)
      : 'Content available for use';
    sections.push(
      `### ${index + 1}. **${item.title}** (\`.claude/${options.type}s/${item.file}\`)`
    );
    sections.push(`💡 *${brief}*`);
    sections.push(`🎯 *${item.metadata}*`);
    sections.push('');
  });

  sections.push(
    `**Access Specific**: \`npx -y cc-self-refer ${options.type} view <number>\` to view detailed ${options.type}`
  );

  return sections.join('\n');
};

// Format no matches output
export const formatNoMatches = (
  availableItems: FormattedItem[],
  options: FormatOptions
): string => {
  const sections = [
    `# No ${options.title} Found`,
    '',
    `No ${options.type} found for "${options.searchTerm}".`,
    '',
    `## Available ${options.title} Base:`,
  ];

  availableItems.slice(0, 5).forEach((item, index) => {
    sections.push(
      `${index + 1}. **${item.title}** - ${item.brief || 'Available for use'}`
    );
  });

  sections.push('');
  sections.push(
    `**Usage**: \`npx -y cc-self-refer ${options.type} view <number>\` or try different keywords`
  );
  sections.push(
    `**Add ${options.title}**: Document new insights as they arise during development`
  );

  return sections.join('\n');
};

// Console output formatters with colors
export const formatConsoleList = (
  items: FormattedItem[],
  options: FormatOptions
): void => {
  if (items.length === 0) {
    console.log(
      pc.yellow(`No ${options.type}s found in .claude/${options.type}s/`)
    );
    return;
  }

  console.log(pc.cyan(`\n${options.emoji} ${options.title}:`));
  items.forEach((item) => {
    console.log(`  ${pc.bold(`${item.id}.`)} ${item.title}`);
    console.log(`     ${pc.dim(item.metadata)}`);
  });
  console.log();
};

export const formatConsoleSearch = (
  results: FormattedItem[],
  keyword: string,
  options: FormatOptions
): void => {
  if (results.length === 0) {
    console.log(pc.yellow(`No ${options.type}s found matching "${keyword}"`));
    return;
  }

  if (results.length === 1) {
    // Single match - show full content
    const formatted = formatSingleMatch(results[0], {
      ...options,
      searchTerm: keyword,
    });
    console.log('\n' + formatted);
  } else {
    // Multiple matches - show list
    const formatted = formatMultipleMatches(results, {
      ...options,
      searchTerm: keyword,
    });
    console.log('\n' + formatted);
  }
};

export const formatConsoleView = (
  content: string,
  options: FormatOptions
): void => {
  console.log(pc.cyan(`\n${options.emoji} ${options.title} Content:\n`));
  console.log(content);
};
