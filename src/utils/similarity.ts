import * as natural from 'natural';

export const calculateSimilarity = (query: string, text: string): number => {
  try {
    const distance = natural.JaroWinklerDistance
      ? natural.JaroWinklerDistance(query.toLowerCase(), text.toLowerCase(), {})
      : 0;

    // Also check for keyword matches
    const queryWords = query.toLowerCase().split(/\s+/);
    const textLower = text.toLowerCase();
    const keywordMatches = queryWords.filter((word) =>
      textLower.includes(word)
    ).length;
    const keywordScore = keywordMatches / queryWords.length;

    // Combine Jaro-Winkler with keyword matching
    return Math.max(distance, keywordScore * 0.8);
  } catch {
    // Fallback to keyword-only matching if JaroWinkler fails
    const queryWords = query.toLowerCase().split(/\s+/);
    const textLower = text.toLowerCase();
    const keywordMatches = queryWords.filter((word) =>
      textLower.includes(word)
    ).length;
    return keywordMatches / queryWords.length;
  }
};
