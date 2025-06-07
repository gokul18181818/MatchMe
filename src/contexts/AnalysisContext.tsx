import React, { createContext, useContext, useState } from 'react';

export interface AnalysisRecord {
  id: string;
  company: string;
  position: string;
  date: string;
  status: 'pending' | 'interviewed' | 'rejected' | 'offer';
  score: number;
  beforeScore: number;
  improvement: number;
  logo: string;
  keywordsMatched: number;
  totalKeywords: number;
  readability: string;
  atsScore: number;
  impactFactor: number;
}

interface AnalysisContextValue {
  analyses: AnalysisRecord[];
  currentAnalysis: AnalysisRecord | null;
  addAnalysis: (analysis: AnalysisRecord) => void;
  setCurrentAnalysis: (id: string) => void;
}

const AnalysisContext = createContext<AnalysisContextValue | undefined>(undefined);

export const useAnalysis = () => {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error('useAnalysis must be used within AnalysisProvider');
  return ctx;
};

const initialHistory: AnalysisRecord[] = [
  {
    id: '1',
    company: 'Google',
    position: 'Software Engineer',
    date: '2024-01-10',
    status: 'interviewed',
    score: 92,
    beforeScore: 65,
    improvement: 27,
    logo: '🅶',
    keywordsMatched: 12,
    totalKeywords: 12,
    readability: 'A+',
    atsScore: 98,
    impactFactor: 9.2,
  },
  {
    id: '2',
    company: 'Microsoft',
    position: 'Senior Developer',
    date: '2024-01-08',
    status: 'pending',
    score: 89,
    beforeScore: 66,
    improvement: 23,
    logo: 'Ⓜ️',
    keywordsMatched: 10,
    totalKeywords: 12,
    readability: 'A',
    atsScore: 91,
    impactFactor: 8.7,
  },
  {
    id: '3',
    company: 'Apple',
    position: 'iOS Developer',
    date: '2024-01-05',
    status: 'offer',
    score: 95,
    beforeScore: 68,
    improvement: 31,
    logo: '🍎',
    keywordsMatched: 11,
    totalKeywords: 12,
    readability: 'A+',
    atsScore: 97,
    impactFactor: 9.5,
  },
  {
    id: '4',
    company: 'Meta',
    position: 'Product Manager',
    date: '2024-01-03',
    status: 'rejected',
    score: 78,
    beforeScore: 62,
    improvement: 15,
    logo: 'Ⓜ️',
    keywordsMatched: 9,
    totalKeywords: 12,
    readability: 'B+',
    atsScore: 85,
    impactFactor: 7.9,
  },
];

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>(initialHistory);
  const [currentAnalysis, setCurrent] = useState<AnalysisRecord | null>(initialHistory[0]);

  const addAnalysis = (analysis: AnalysisRecord) => {
    setAnalyses(prev => [...prev, analysis]);
    setCurrent(analysis);
  };

  const setCurrentAnalysis = (id: string) => {
    const found = analyses.find(a => a.id === id) || null;
    setCurrent(found);
  };

  return (
    <AnalysisContext.Provider value={{ analyses, currentAnalysis, addAnalysis, setCurrentAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
};
