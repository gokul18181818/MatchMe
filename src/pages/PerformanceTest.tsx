import React, { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';

const PerformanceTest: React.FC = () => {
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const time = performance.now();
    setLoadTime(Math.round(time));
    const rating = Math.max(1, 100 - Math.round(time / 50));
    setScore(rating);
  }, []);

  return (
    <PageLayout showBackButton backTo="/" backLabel="Back to Home">
      <div className="max-w-md mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold mb-4">App Performance</h2>
        {score !== null && (
          <>
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="text-lg font-semibold">
              {score}/100 - {loadTime} ms
            </p>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default PerformanceTest;
