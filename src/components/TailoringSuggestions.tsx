import React from 'react';
import { getMockSuggestions } from '../utils/mockAnalysis';

const TailoringSuggestions: React.FC = () => {
  const suggestions = getMockSuggestions();

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Tailoring Suggestions</h2>
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="alert alert-info">
            <div className="flex-1">
              <p>{suggestion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TailoringSuggestions; 