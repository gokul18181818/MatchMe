import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Loader } from 'lucide-react';
import { cn } from '../lib/utils';
import ResumeUploader from '../components/ResumeUploader';
import JobDescriptionInput from '../components/JobDescriptionInput';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';

const AnalyzePage: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobUrl, setJobUrl] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis time for better UX
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsAnalyzing(false);
    navigate('/results');
  };

  // Check if we have resume content (either file or text) AND job URL
  const hasResumeContent = resumeFile || resumeText.trim().length > 0;
  const hasJobUrl = jobUrl.trim().length > 0;
  const canAnalyze = hasResumeContent && hasJobUrl;

  return (
    <PageLayout showBackButton backTo="/" backLabel="Back to Home">
      <div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Analyze Your Resume
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Upload your resume and job posting to get AI-powered optimization suggestions
            </p>
          </motion.div>

          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Resume Upload */}
            <ResumeUploader 
              onFileSelect={setResumeFile} 
              onTextChange={setResumeText}
            />

            {/* Job Description */}
            <JobDescriptionInput value={jobUrl} onChange={setJobUrl} />
          </div>

          {/* Analyze Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-center"
          >
            <Button
              onClick={handleAnalyze}
              disabled={!canAnalyze || isAnalyzing}
              className={cn(
                "px-12 py-4 text-lg font-semibold rounded-xl transition-all duration-300",
                "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                "text-white shadow-xl hover:shadow-2xl",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-xl",
                "flex items-center space-x-3",
                "min-w-[200px]"
              )}
            >
              {isAnalyzing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze Resume Match</span>
                </>
              )}
            </Button>
          </motion.div>

          {/* Status Indicator */}
          {!canAnalyze && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center text-gray-500 dark:text-gray-400 mt-4"
            >
              {!hasResumeContent && !hasJobUrl && 
                "Please upload your resume and add a LinkedIn job posting URL to continue"
              }
              {!hasResumeContent && hasJobUrl && 
                "Please upload your resume or paste resume text to continue"
              }
              {hasResumeContent && !hasJobUrl && 
                "Please add a LinkedIn job posting URL to continue"
              }
            </motion.p>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default AnalyzePage; 