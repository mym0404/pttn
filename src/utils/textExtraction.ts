import { PlanInfo } from '../types';

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

export const extractStatus = (content: string): PlanInfo['status'] => {
  const statusMatch = content.match(/\*\*Status\*\*:\s*\[([^\]]+)]/);
  if (statusMatch && statusMatch[1]) {
    const status = statusMatch[1].trim();
    if (['Planning', 'In Progress', 'Completed'].includes(status)) {
      return status as PlanInfo['status'];
    }
  }
  return 'Planning';
};

export const extractLanguage = (content: string, filename: string): string => {
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

  return 'general';
};

export const extractCategory = (content: string, filepath: string): string => {
  // Try to extract from content metadata
  const categoryMatch = content.match(/\*\*Category\*\*:\s*([^\n]+)/);
  if (categoryMatch && categoryMatch[1]) {
    return categoryMatch[1].trim();
  }

  // Try to infer from directory structure
  const pathParts = filepath.split('/');
  if (pathParts.length > 1) {
    return pathParts[pathParts.length - 2] || 'general';
  }

  return 'general';
};

export const extractPatternType = (content: string): string => {
  const typeMatch = content.match(/\*\*Type\*\*:\s*([^\n|]+)/);
  if (typeMatch && typeMatch[1]) {
    return typeMatch[1].trim();
  }

  // Infer from content patterns
  if (content.includes('useState') || content.includes('useEffect')) {
    return 'react-hook';
  }
  if (content.includes('className=') || content.includes('styled-components')) {
    return 'react-component';
  }
  if (content.includes('interface ') || content.includes('type ')) {
    return 'typescript-type';
  }
  if (content.includes('const ') && content.includes('=>')) {
    return 'function';
  }

  return 'code-snippet';
};

export const extractTags = (content: string): string[] => {
  const tagsMatch = content.match(/\*\*Tags\*\*:\s*([^\n]+)/);
  if (tagsMatch && tagsMatch[1]) {
    return tagsMatch[1]
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }
  return [];
};
