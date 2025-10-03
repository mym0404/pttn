// @ts-ignore
import JaroWinklerDistance from 'natural/lib/natural/distance/jaro-winkler_distance.js';

import type { PatternInfo } from '../types/content.js';

export interface PatternSearchResult {
  title: string;
  file: string;
  score: number;
  language: string;
  matchedFields: string[];
}

/**
 * Simple pattern search optimized for single content type
 */
export const searchPatterns = (
  query: string,
  patterns: PatternInfo[]
): PatternSearchResult[] => {
  const normalizedQuery = query.toLowerCase().trim();

  // 1. ID 검색 (최우선)
  const idNum = parseInt(query);
  if (!isNaN(idNum)) {
    const exact = patterns.find((p) => p.id === idNum);
    if (exact) {
      return [
        {
          title: exact.title,
          file: exact.file,
          score: 1.0,
          language: exact.language,
          matchedFields: ['id'],
        },
      ];
    }
  }

  const results: PatternSearchResult[] = [];

  for (const pattern of patterns) {
    let score = 0;
    const matchedFields: string[] = [];

    // 제목 매칭 (가중치 0.4)
    const titleLower = pattern.title.toLowerCase();
    if (titleLower === normalizedQuery) {
      score += 0.4;
      matchedFields.push('title');
    } else if (titleLower.includes(normalizedQuery)) {
      score += 0.3;
      matchedFields.push('title');
    } else {
      // Jaro-Winkler 유사도 (0.8 이상만)
      const similarity = JaroWinklerDistance(titleLower, normalizedQuery, {
        ignoreCase: true,
      });
      if (similarity > 0.8) {
        score += similarity * 0.3;
        matchedFields.push('title');
      }
    }

    // 키워드 매칭 (가중치 0.35)
    if (pattern.keywords && pattern.keywords.length > 0) {
      const keywordMatches = pattern.keywords.filter((k) =>
        k.toLowerCase().includes(normalizedQuery)
      );
      if (keywordMatches.length > 0) {
        score += 0.35 * (keywordMatches.length / pattern.keywords.length);
        matchedFields.push('keywords');
      }
    }

    // 언어 매칭 (가중치 0.1)
    if (pattern.language.toLowerCase().includes(normalizedQuery)) {
      score += 0.1;
      matchedFields.push('language');
    }

    // 설명 매칭 (가중치 0.15)
    if (pattern.explanation?.toLowerCase().includes(normalizedQuery)) {
      score += 0.15;
      matchedFields.push('explanation');
    }

    if (score > 0) {
      results.push({
        title: pattern.title,
        file: pattern.file,
        score: Math.round(score * 100) / 100,
        language: pattern.language,
        matchedFields,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 20);
};
