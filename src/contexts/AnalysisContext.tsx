import React, { createContext, useContext, useState } from 'react';
import { getMockMatchScore, getMockKeywords, getMockSuggestions } from '../utils/mockAnalysis';

interface AnalysisContextType {
  jobUrl: string;
  resumeFile: File | null;
  resumeText: string;
  matchScore: number | null;
  keywords: string[];
  suggestions: string[];
  setJobUrl: (url: string) => void;
  setResumeFile: (file: File | null) => void;
  setResumeText: (text: string) => void;
  analyze: () => Promise<void>;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const useAnalysis = () => {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error('useAnalysis must be used within AnalysisProvider');
  return ctx;
};

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobUrl, setJobUrl] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const analyze = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMatchScore(getMockMatchScore());
    setKeywords(getMockKeywords());
    setSuggestions(getMockSuggestions());
  };

  return (
    <AnalysisContext.Provider
      value={{
        jobUrl,
        resumeFile,
        resumeText,
        matchScore,
        keywords,
        suggestions,
        setJobUrl,
        setResumeFile,
        setResumeText,
        analyze,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};
