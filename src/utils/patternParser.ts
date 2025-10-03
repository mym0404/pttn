import fm from 'front-matter';

export interface PatternMetadata {
  title: string;
  language: string;
  keywords: string[];
  explanation: string;
}

/**
 * Parse pattern metadata from markdown content with front-matter
 * Optimized to parse front-matter only once
 */
export const parsePatternMetadata = (
  content: string,
  filename: string
): PatternMetadata => {
  // Parse front-matter once
  let frontMatter: any = {};
  try {
    const parsed = fm<{
      language?: string;
      keywords?: string;
      explanation?: string;
    }>(content);
    frontMatter = parsed.attributes;
  } catch {
    // Ignore parsing errors
  }

  // Extract title from first heading
  const title =
    content
      .split('\n')
      .find((line) => line.trim().startsWith('#'))
      ?.replace(/^#+\s*/, '')
      .trim() || 'Untitled';

  // Extract language (priority: frontmatter > code block > filename > default)
  const language =
    frontMatter.language?.trim().toLowerCase() ||
    content.match(/```([a-zA-Z]+)/)?.[1]?.toLowerCase() ||
    filename.match(/-([a-zA-Z]+)\.(md|txt)$/)?.[1]?.toLowerCase() ||
    'text';

  // Extract keywords from frontmatter
  const keywords =
    frontMatter.keywords
      ?.split(',')
      .map((k: string) => k.trim())
      .filter((k: string) => k.length > 0) || [];

  // Extract explanation from frontmatter
  const explanation = frontMatter.explanation?.trim() || '';

  return { title, language, keywords, explanation };
};
