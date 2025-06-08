import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';

// LinkedIn Icon Component
const LinkedInIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 256" className={className}>
    <path d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453" fill="#0A66C2"/>
  </svg>
);

type JobDescriptionInputProps = {
  value: string;
  onChange: (value: string) => void;
};

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ value, onChange }) => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={cn(
        "p-8 rounded-2xl transition-all duration-300",
        "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
        "border border-gray-200/50 dark:border-gray-700/50",
        "hover:bg-white dark:hover:bg-gray-900",
        "hover:border-gray-300 dark:hover:border-gray-600",
        "hover:shadow-xl dark:hover:shadow-2xl"
      )}
    >
      <div className="flex items-center gap-4 mb-6">
        <LinkedInIcon className="w-8 h-8 flex-shrink-0" />
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            LinkedIn Job Posting
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Paste a LinkedIn job URL or just the job ID number
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://www.linkedin.com/jobs/view/4196977154 or just 4196977154"
          className={cn(
            "w-full px-4 py-3 rounded-lg transition-all duration-300",
            "bg-gray-50 dark:bg-gray-800/50",
            "border border-gray-200 dark:border-gray-700",
            "text-gray-900 dark:text-white",
            "placeholder-gray-500 dark:placeholder-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
            "hover:border-gray-300 dark:hover:border-gray-600"
          )}
        />
        
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>We'll extract real job data automatically from LinkedIn</span>
        </div>
      </div>
    </motion.div>
  );
};

export default JobDescriptionInput; 