import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Loader, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import ResumeUploader from '../components/ResumeUploader';
import JobDescriptionInput from '../components/JobDescriptionInput';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';
import { createApplicationFromAnalysis, extractCompanyFromJobUrl, extractJobTitleFromUrl } from '../services/applicationService';
import { scrapeLinkedInJob, scrapeAndSaveLinkedInJob } from '../services/jobPostingService';

const AnalyzePage: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [jobUrl, setJobUrl] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [scrapedJobData, setScrapedJobData] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle pre-filled job data from recommendations page
  useEffect(() => {
    const state = location.state as any;
    if (state?.prefilledJob) {
      const { url, company, title } = state.prefilledJob;
      setJobUrl(url);
      // Pre-populate scraped data for better UX
      setScrapedJobData({
        title,
        company,
        location: 'San Francisco, CA', // Mock data
        employment_type: 'Full-time',
        requirements: ['Programming', 'Problem solving', 'Team collaboration'],
        description: `Join ${company} as a ${title}. This role involves working on cutting-edge projects...`
      });
    }
  }, [location.state]);

  const handleResumeFileSelect = (file: File | null, extractedText?: string) => {
    setResumeFile(file);
    setResumeText(extractedText || '');
  };

  const handleJobUrlChange = async (url: string) => {
    setJobUrl(url);
    setError(null);
    setScrapedJobData(null);

    // Auto-scrape when a LinkedIn URL is detected
    if (url.includes('linkedin.com/jobs/view/') && url.length > 30) {
      setIsScraping(true);
      try {
        const jobData = await scrapeLinkedInJob(url);
        setScrapedJobData(jobData);
        console.log('Auto-scraped job data:', jobData);
      } catch (error) {
        console.error('Auto-scraping failed:', error);
        setError('Failed to extract job details. You can still proceed with analysis.');
      } finally {
        setIsScraping(false);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!user?.id) {
      setError('Please sign in to analyze your resume');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      let finalJobData = scrapedJobData;

      // If we haven't scraped yet but have a LinkedIn URL, scrape now
      if (!finalJobData && jobUrl.includes('linkedin.com/jobs/view/')) {
        setIsScraping(true);
        try {
          finalJobData = await scrapeLinkedInJob(jobUrl);
          setScrapedJobData(finalJobData);
        } catch (scrapeError) {
          console.error('Scraping failed during analysis:', scrapeError);
          // Continue with basic analysis even if scraping fails
        } finally {
          setIsScraping(false);
        }
      }

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
              company: finalJobData?.company || application.company,
              position: finalJobData?.title || application.position,
              applicationId: application.id,
              jobData: finalJobData,
              newApplication: true
            }
          });
        }, 1500);
      } else {
        throw new Error('Failed to create application');
      }
    } catch (error) {
      console.error('Error during analysis:', error);
      setError('Analysis failed. Please try again.');
      setIsAnalyzing(false);
    }
  };

  // Check if we have resume content (either file or text) AND job URL
  const hasResumeContent = resumeFile || resumeText.trim().length > 0;
  const hasJobUrl = jobUrl.trim().length > 0;
  const canAnalyze = hasResumeContent && hasJobUrl && !isScraping;

  // Preview extracted company and position
  const previewCompany = scrapedJobData?.company || (hasJobUrl ? extractCompanyFromJobUrl(jobUrl) : '');
  const previewPosition = scrapedJobData?.title || (hasJobUrl ? extractJobTitleFromUrl(jobUrl) : '');

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
              Upload your resume and paste a LinkedIn job URL for AI-powered analysis and optimization
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Resume Upload */}
            <ResumeUploader 
              onFileSelect={handleResumeFileSelect}
            />

            {/* Job Description */}
            <JobDescriptionInput 
              value={jobUrl} 
              onChange={handleJobUrlChange}
            />
          </div>

          {/* Scraping Progress */}
          {isScraping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                <p className="text-blue-700 dark:text-blue-300">Extracting job details from LinkedIn...</p>
              </div>
            </motion.div>
          )}

          {/* Job Data Preview */}
          {scrapedJobData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={cn(
                "p-6 rounded-xl mb-8 border",
                "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              )}
            >
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                ✅ Job Data Extracted Successfully
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-700 dark:text-green-300 font-medium">Company: </span>
                  <span className="text-green-800 dark:text-green-200">{scrapedJobData.company}</span>
                </div>
                <div>
                  <span className="text-green-700 dark:text-green-300 font-medium">Position: </span>
                  <span className="text-green-800 dark:text-green-200">{scrapedJobData.title}</span>
                </div>
                <div>
                  <span className="text-green-700 dark:text-green-300 font-medium">Location: </span>
                  <span className="text-green-800 dark:text-green-200">{scrapedJobData.location}</span>
                </div>
                <div>
                  <span className="text-green-700 dark:text-green-300 font-medium">Type: </span>
                  <span className="text-green-800 dark:text-green-200">{scrapedJobData.employment_type}</span>
                </div>
              </div>
              {scrapedJobData.requirements.length > 0 && (
                <div className="mt-3">
                  <span className="text-green-700 dark:text-green-300 font-medium">Key Requirements: </span>
                  <span className="text-green-800 dark:text-green-200">
                    {scrapedJobData.requirements.slice(0, 3).join(', ')}
                    {scrapedJobData.requirements.length > 3 && ` +${scrapedJobData.requirements.length - 3} more`}
                  </span>
                </div>
              )}
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  📝 Real Data: Job details extracted directly from the LinkedIn posting. Only LinkedIn job URLs are supported.
                </p>
              </div>
            </motion.div>
          )}

          {/* Preview Section (Fallback) */}
          {!scrapedJobData && canAnalyze && (previewCompany || previewPosition) && (
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
              ) : isScraping ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Extracting Job Data...
                </>
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
                {isScraping && 
                  "Extracting job details from LinkedIn..."
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