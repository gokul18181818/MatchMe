import React from 'react';
import { getMockKeywords } from '../utils/mockAnalysis';

const KeywordList: React.FC = () => {
  const keywords = getMockKeywords();

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Missing Keywords</h2>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <div key={index} className="badge badge-lg badge-warning gap-2">
            {keyword}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeywordList; 