import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Loader, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import ResumeUploader from '../components/ResumeUploader';
import JobDescriptionInput from '../components/JobDescriptionInput';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';
import { createApplicationFromAnalysis, extractCompanyFromJobUrl, extractJobTitleFromUrl } from '../services/applicationService';

const AnalyzePage: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobUrl, setJobUrl] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleResumeFileSelect = (file: File | null, extractedText?: string) => {
    setResumeFile(file);
    setResumeText(extractedText || '');
  };

  const handleAnalyze = async () => {
    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate analysis time with progress updates for better UX
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Generate analysis score (in real app, this would come from AI analysis)
      const analysisScore = Math.floor(Math.random() * 15) + 80; // 80-95% range
      
      // Create application entry from analysis
      const application = await createApplicationFromAnalysis(
        user.id,
        jobUrl,
        resumeFile || undefined,
        analysisScore
      );

      if (application) {
        console.log('Application created successfully:', application);
        setShowSuccess(true);
        
        // Show success message briefly, then navigate
        setTimeout(() => {
          setIsAnalyzing(false);
          // Navigate to results with application data
          navigate('/results', { 
            state: { 
              analysisScore,
              company: application.company,
              position: application.position,
              applicationId: application.id,
              newApplication: true
            }
          });
        }, 1500);
      } else {
        throw new Error('Failed to create application');
      }
    } catch (error) {
      console.error('Error during analysis:', error);
      setIsAnalyzing(false);
      // Still navigate to results even if application creation fails
      navigate('/results');
    }
  };

  // Check if we have resume content (either file or text) AND job URL
  const hasResumeContent = resumeFile || resumeText.trim().length > 0;
  const hasJobUrl = jobUrl.trim().length > 0;
  const canAnalyze = hasResumeContent && hasJobUrl;

  // Preview extracted company and position
  const previewCompany = hasJobUrl ? extractCompanyFromJobUrl(jobUrl) : '';
  const previewPosition = hasJobUrl ? extractJobTitleFromUrl(jobUrl) : '';

  return (
    <PageLayout showBackButton backTo="/dashboard" backLabel="Back to Dashboard">
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
              Upload your resume and job posting to get AI-powered optimization suggestions and save to your applications
            </p>
          </motion.div>

          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Resume Upload */}
            <ResumeUploader 
              onFileSelect={handleResumeFileSelect}
            />

            {/* Job Description */}
            <JobDescriptionInput value={jobUrl} onChange={setJobUrl} />
          </div>

          {/* Preview Section */}
          {canAnalyze && (previewCompany || previewPosition) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={cn(
                "p-6 rounded-xl mb-8 border",
                "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
              )}
            >
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Analysis Preview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {previewCompany && (
                  <div>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">Company: </span>
                    <span className="text-blue-800 dark:text-blue-200">{previewCompany}</span>
                  </div>
                )}
                {previewPosition && (
                  <div>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">Position: </span>
                    <span className="text-blue-800 dark:text-blue-200">{previewPosition}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Action Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <Button
              onClick={handleAnalyze}
              disabled={!canAnalyze || isAnalyzing}
              className={cn(
                "px-12 py-4 text-lg font-semibold rounded-xl transition-all duration-300",
                canAnalyze
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed",
                isAnalyzing && "animate-pulse"
              )}
            >
              {isAnalyzing ? (
                showSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Analysis Complete!
                  </>
                ) : (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Resume...
                  </>
                )
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze Resume
                </>
              )}
            </Button>

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
                  "Please upload your resume to continue"
                }
                {hasResumeContent && !hasJobUrl && 
                  "Please add a LinkedIn job posting URL to continue"
                }
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AnalyzePage; 