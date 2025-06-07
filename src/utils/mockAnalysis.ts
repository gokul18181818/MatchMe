import type { AnalysisRecord } from '../contexts/AnalysisContext';

export const getMockMatchScore = () => 76;
export const getMockKeywords = () => ['Docker', 'Node.js', 'APIs'];
export const getMockSuggestions = () => [
  'Add a bullet about deploying Docker containers.',
  'Mention working with APIs in your internship.',
];

export const createMockAnalysis = (id: string): AnalysisRecord => {
  const companies = ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix'];
  const company = companies[Math.floor(Math.random() * companies.length)];
  const beforeScore = 60 + Math.floor(Math.random() * 10);
  const improvement = 20 + Math.floor(Math.random() * 15);
  const score = beforeScore + improvement;

  return {
    id,
    company,
    position: 'Software Engineer',
    date: new Date().toISOString(),
    status: 'pending',
    score,
    beforeScore,
    improvement,
    logo: '📝',
    keywordsMatched: 12,
    totalKeywords: 12,
    readability: 'A',
    atsScore: 90,
    impactFactor: 8.5,
  };
};
