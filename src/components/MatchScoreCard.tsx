import React from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { getMockMatchScore } from '../utils/mockAnalysis';
import { useEffect } from 'react';

const MatchScoreCard: React.FC = () => {
  const score = getMockMatchScore();
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = useTransform(count, (v) => circumference * (1 - v / 100));

  useEffect(() => {
    const animation = animate(count, score, {
      duration: 1.5,
      ease: "easeInOut",
    });

    return animation.stop;
  }, [score, count]);

  return (
    <div className="p-4 border rounded-lg shadow-sm text-center">
      <h2 className="text-lg font-semibold mb-2">Match Score</h2>
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-full h-full" viewBox="0 0 100 100" transform='rotate(-90)'>
          <circle
            className="text-gray-200"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          <motion.circle
            className="text-blue-500"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-3xl font-bold">
          <motion.span>{rounded}</motion.span>%
        </div>
      </div>
      <p className="mt-2">This resume matches {score}% of this job.</p>
    </div>
  );
};

export default MatchScoreCard; 