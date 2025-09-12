import fm from 'front-matter';

export const extractTitle = (content: string): string => {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#')) {
      return trimmed.replace(/^#+\s*/, '').trim();
    }
  }
  return 'Untitled';
};

export const extractLanguage = (content: string, filename: string): string => {
  // Try to extract from front-matter first
  try {
    const parsed = fm<{ language?: string }>(content);
    if (parsed.attributes.language) {
      return parsed.attributes.language.trim().toLowerCase();
    }
  } catch {
    // Ignore parsing errors and fall back to other methods
  }

  // Try to extract from code blocks
  const codeBlockMatch = content.match(/```([a-zA-Z]+)/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    return codeBlockMatch[1].toLowerCase();
  }

  // Fallback to filename pattern
  const langMatch = filename.match(/-([a-zA-Z]+)\.(md|txt)$/);
  if (langMatch && langMatch[1]) {
    return langMatch[1].toLowerCase();
  }

  return 'text';
};

export const extractExplanation = (content: string): string => {
  // Try to extract from front-matter first
  try {
    const parsed = fm<{ explanation?: string }>(content);
    if (parsed.attributes.explanation) {
      return parsed.attributes.explanation.trim();
    }
  } catch {}
  return '';
};

export const extractKeywords = (content: string): string[] => {
  try {
    const parsed = fm<{ keywords?: string }>(content);
    if (parsed.attributes.keywords) {
      return parsed.attributes.keywords
        .split(',')
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0);
    }
  } catch {
    // Ignore parsing errors and fall back to manual extraction
  }

  return [];
};
