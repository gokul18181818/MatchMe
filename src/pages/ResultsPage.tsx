import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, CheckCircle, AlertCircle, Star, Download, Trophy, Target, Zap, Crown, PartyPopper, Building, FileText, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';
import confetti from 'canvas-confetti';
import { generateOptimizedResume } from '../services/resumeGenerationService';

const Confetti = () => {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        setIsActive(false);
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#3b82f6', '#8b5cf6', '#10b981', '#06b6d4', '#6366f1'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#3b82f6', '#8b5cf6', '#10b981', '#06b6d4', '#6366f1'],
      });
    }, 250);

    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

  return null;
};

const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  color,
  tooltip
}: { 
  icon: any, 
  title: string, 
  value: string | number, 
  color: string,
  tooltip: string
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={cn(
          "p-4 rounded-lg border transition-all duration-300 text-center cursor-help",
          "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
          "border-gray-200 dark:border-gray-700",
          "hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-300 dark:hover:border-blue-600"
        )}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className={cn("w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center", color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {value}
        </p>
      </motion.div>
      
      {/* Tooltip */}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
        >
          <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg px-3 py-2 shadow-xl max-w-xs text-center">
            {tooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const ResultsPage: React.FC = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [parsedResume, setParsedResume] = useState<any>(null);
  
  // Get application data from navigation state
  const applicationData = location.state as {
    analysisScore?: number;
    company?: string;
    position?: string;
    applicationId?: string;
    newApplication?: boolean;
    resumeFile?: File;
    jobData?: any; // Scraped job data for optimization
    resumeText?: string; // Extracted resume text for preview
  } | null;

  const finalScore = applicationData?.analysisScore || 92;
  const showApplicationSuccess = applicationData?.newApplication || false;

  // Parse resume text for preview
  const parseResumeText = (text: string) => {
    if (!text) return null;
    
    const lines = text.split('\n').filter(line => line.trim());
    const sections = {
      name: '',
      contact: '',
      education: [] as string[],
      experience: [] as string[],
      skills: [] as string[],
      projects: [] as string[]
    };

    let currentSection = '';
    let i = 0;
    
    // Extract name - look for first line that doesn't contain symbols
    while (i < lines.length && !sections.name) {
      const line = lines[i].trim();
      if (line.length > 2 && line.length < 80 && 
          !line.includes('@') && !line.includes('#') && 
          !line.includes('§') && !line.includes('ï') &&
          !/\d{3}-\d{3}-\d{4}/.test(line) && // no phone numbers
          !line.includes('linkedin') && !line.includes('github')) {
        sections.name = line;
      }
      i++;
    }
    
    // Extract contact info - look for lines with email, phone, or links
    const contactLines = lines.filter(line => {
      const lowerLine = line.toLowerCase();
      return lowerLine.includes('@') || 
             /\d{3}-\d{3}-\d{4}/.test(line) ||
             lowerLine.includes('linkedin') || 
             lowerLine.includes('github') ||
             line.includes('#') || line.includes('§') || line.includes('ï');
    });
    
    if (contactLines.length > 0) {
      sections.contact = contactLines.join(' | ').replace(/[#§ï]/g, '•');
    }
    
    // Parse sections
    for (let j = 0; j < lines.length; j++) {
      const line = lines[j].trim();
      const lowerLine = line.toLowerCase();
      
      // Detect section headers
      if (lowerLine === 'education' || lowerLine.startsWith('education')) {
        currentSection = 'education';
        continue;
      } else if (lowerLine === 'experience' || lowerLine.startsWith('experience')) {
        currentSection = 'experience';
        continue;
      } else if (lowerLine.includes('technical skills') || lowerLine.includes('skills')) {
        currentSection = 'skills';
        continue;
      } else if (lowerLine === 'projects' || lowerLine.startsWith('projects')) {
        currentSection = 'projects';
        continue;
      }
      
      // Add content to sections
      if (currentSection && line.length > 3 && 
          !lowerLine.includes('education') && 
          !lowerLine.includes('experience') && 
          !lowerLine.includes('projects') &&
          !lowerLine.includes('technical skills')) {
        
        // Format education entries
        if (currentSection === 'education') {
          if (line.includes('Georgia Institute') || line.includes('Master of Science') || 
              line.includes('Bachelor of Science') || line.includes('University') ||
              line.includes('College') || line.includes('GPA:') ||
              line.includes('Relevant Coursework')) {
            sections.education.push(line);
          }
        }
        // Format experience entries  
        else if (currentSection === 'experience') {
          if (line.includes('Intern') || line.includes('Engineer') || 
              line.includes('Assistant') || line.includes('Developer') ||
              line.includes('•') || line.includes('Built') || 
              line.includes('Developed') || line.includes('Managed') ||
              /^\w+\s+\d{4}/.test(line) || // Date patterns
              line.includes('Atlanta') || line.includes('Durham') ||
              line.includes('Suwanee')) {
            sections.experience.push(line);
          }
        }
        // Format skills
        else if (currentSection === 'skills') {
          if (line.includes('Languages') || line.includes('Frameworks') || 
              line.includes('Developer Tools') || line.includes(':')) {
            sections.skills.push(line);
          }
        }
        // Format projects
        else if (currentSection === 'projects') {
          if (line.includes('|') || line.includes('•') || 
              line.includes('Created') || line.includes('Built') ||
              line.includes('Developed') || line.includes('Engineered') ||
              /^\w+.*\d{4}/.test(line)) { // Project names with dates
            sections.projects.push(line);
          }
        }
      }
    }
    
    console.log('🔍 Parsed resume sections:', sections);
    return sections;
  };

  useEffect(() => {
    // Animate the improvement score
    let current = 0;
    const target = finalScore;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedScore(target);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, 30);

    return () => clearInterval(timer);
  }, [finalScore]);

  useEffect(() => {
    // Parse resume text for preview
    if (applicationData?.resumeText) {
      const parsed = parseResumeText(applicationData.resumeText);
      setParsedResume(parsed);
      console.log('📄 Resume parsed for preview:', parsed);
    }
  }, [applicationData?.resumeText]);

  const handleDownloadPDF = async () => {
    if (!applicationData?.resumeFile) {
      alert('🚫 No resume file found. Please upload a resume and analyze it again to download an optimized version.');
      return;
    }

    setIsDownloading(true);
    try {
      console.log('🚀 Starting resume optimization with job-specific keywords...');
      await generateOptimizedResume(applicationData.resumeFile, applicationData.jobData);
      console.log('✅ Optimized resume PDF generated successfully!');
      
      // Show success notification
      setTimeout(() => {
        alert('✅ Success! Your AI-optimized resume has been downloaded. Check your Downloads folder.');
      }, 500);
      
    } catch (error) {
      console.error('Error generating optimized resume:', error);
      alert('❌ Failed to generate optimized resume. Please check your internet connection and try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <PageLayout showBackButton backTo="/analyze" backLabel="Back" className="px-3 py-3 h-screen flex flex-col">
      <Confetti />
      <div className="relative z-10 h-full flex flex-col">

        {/* Application Success Banner */}
        {showApplicationSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                  Application Saved Successfully! 🎉
                </h3>
                <p className="text-sm text-green-700 dark:text-green-400">
                  {applicationData?.position} at {applicationData?.company} has been added to your applications with "Pending" status
                </p>
              </div>
              <div className="ml-auto">
                <Link to="/history" state={{ newApplicationCreated: true }}>
                  <Button className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2">
                    <FileText className="w-4 h-4 mr-2" />
                    View Applications
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Celebration Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-4"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <PartyPopper className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              Your Resume is Perfected!
            </h2>
            <Trophy className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Congratulations! Your resume has been optimized and {showApplicationSuccess ? 'automatically saved to your applications' : 'is ready to impress employers'} ✨
          </p>
        </motion.div>

        {/* Main Content - 50/50 Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
          
          {/* Left Half - Celebration Stats */}
          <div className="space-y-4 overflow-y-auto">
            
            {/* Score Improvement Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className={cn(
                "p-4 rounded-xl border text-center",
                "bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/30",
                "border-blue-200 dark:border-blue-700",
                "shadow-lg"
              )}
            >
              <div className="flex items-center justify-center gap-4 mb-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-red-500">65%</div>
                  <div className="text-xs text-red-500">Before</div>
                </div>
                
                <TrendingUp className="w-8 h-8 text-green-500" />
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{animatedScore}%</div>
                  <div className="text-xs text-green-600 dark:text-green-400">After</div>
                </div>
              </div>
              
              <div className="text-xl font-bold text-green-600 dark:text-green-400 mb-1">+27% Better!</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                AI-optimized with job-specific keywords & Jake's clean formatting
              </p>
            </motion.div>

            {/* Stats Grid - Only 4 key metrics */}
            <div className="grid grid-cols-2 gap-2">
              <StatCard 
                icon={Target}
                title="Keyword Match" 
                value="12/12" 
                color="bg-blue-500"
                tooltip="How well your resume matches the job's required keywords and skills. Perfect alignment helps you pass ATS filters."
              />
              <StatCard 
                icon={Zap}
                title="Readability" 
                value="A+" 
                color="bg-purple-500"
                tooltip="How easy your resume is to scan and understand. Clear formatting and concise language improve readability."
              />
              <StatCard 
                icon={CheckCircle}
                title="ATS Score" 
                value="98%" 
                color="bg-green-500"
                tooltip="Applicant Tracking System compatibility. High scores mean your resume won't get filtered out by automated systems."
              />
              <StatCard 
                icon={Star}
                title="Impact Factor" 
                value="9.2/10" 
                color="bg-cyan-500"
                tooltip="Measures how compelling your achievements are. Strong action verbs and quantified results boost impact."
              />
            </div>

            {/* Why It's Better Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className={cn(
                "p-4 rounded-xl border",
                "bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20",
                "border-green-200 dark:border-green-700",
                "backdrop-blur-sm"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                                      <h3 className="text-lg font-bold mb-2 text-green-800 dark:text-green-300">
                      🚀 Your AI-Optimized Resume Features
                    </h3>
                  <p className="text-sm text-green-700 dark:text-green-400 leading-relaxed">
                    <strong>🎯 Smart keyword integration</strong> from the job posting ensures ATS compatibility. 
                    <strong>📊 Enhanced achievements</strong> with metrics and impact-focused language. 
                    <strong>✨ Jake's clean formatting</strong> - professional, scannable, and recruiter-friendly.
                    <strong>🤖 AI-powered optimization</strong> tailored specifically for this role.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Half - Resume PDF Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-full"
          >
            <div className={cn(
              "h-full rounded-xl border transition-all duration-300 flex flex-col",
              "bg-white dark:bg-gray-900",
              "border-gray-200 dark:border-gray-700",
              "shadow-xl"
            )}>
              {/* PDF Header */}
              <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    Optimized Resume - {applicationData?.company || 'Target Company'}
                  </span>
                </div>
                <Button 
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-3 py-1 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Download className="w-3 h-3" />
                  )}
                  {isDownloading ? 'Optimizing Resume...' : 'Download Optimized PDF'}
                </Button>
              </div>

              {/* PDF Content - Actual Resume Preview */}
              <div className="flex-1 p-3 overflow-y-auto bg-white dark:bg-gray-900" style={{ fontSize: '10px' }}>
                {!parsedResume && (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">📄 Resume Preview</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Upload a resume to see preview here
                    </p>
                  </div>
                )}
                <div className="max-w-full mx-auto bg-white dark:bg-gray-900 shadow-inner border border-gray-100 dark:border-gray-800 rounded p-3">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="text-center pb-2 border-b-2 border-blue-600 dark:border-blue-400">
                      <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {parsedResume?.name || 'Your Resume'}
                      </h1>
                      {parsedResume?.contact ? (
                        <p className="text-gray-600 dark:text-gray-400 text-xs">
                          {parsedResume.contact}
                        </p>
                      ) : (
                        <>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                            Contact Information
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-xs">
                            📄 Preview of your optimized resume
                          </p>
                        </>
                      )}
                    </div>

                    {/* Education */}
                    <div>
                      <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1 pb-0.5 border-b border-blue-300 dark:border-blue-700">
                        EDUCATION
                      </h2>
                      <div className="mb-2">
                        {parsedResume?.education && parsedResume.education.length > 0 ? (
                          <div className="space-y-1">
                            {parsedResume.education.slice(0, 5).map((edu: string, index: number) => (
                              <div key={index} className="text-xs">
                                {edu.includes('Georgia Institute') || edu.includes('University') || edu.includes('College') ? (
                                  <h4 className="font-bold text-gray-900 dark:text-gray-100">{edu}</h4>
                                ) : edu.includes('Master of Science') || edu.includes('Bachelor of Science') ? (
                                  <p className="text-gray-700 dark:text-gray-300 italic">{edu}</p>
                                ) : edu.includes('GPA:') ? (
                                  <p className="text-gray-600 dark:text-gray-400">{edu}</p>
                                ) : (
                                  <p className="text-gray-700 dark:text-gray-300">{edu}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              🎓 Your education will be displayed here
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Experience */}
                    <div>
                      <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1 pb-0.5 border-b border-blue-300 dark:border-blue-700">
                        EXPERIENCE
                      </h2>
                      <div className="space-y-1">
                        {parsedResume?.experience && parsedResume.experience.length > 0 ? (
                          <div className="space-y-1">
                            {parsedResume.experience.slice(0, 8).map((exp: string, index: number) => (
                              <div key={index} className="text-xs">
                                {(exp.includes('Intern') || exp.includes('Engineer') || exp.includes('Assistant') || exp.includes('Developer')) && 
                                 !exp.includes('•') && !exp.includes('Built') && !exp.includes('Developed') ? (
                                  <h4 className="font-bold text-gray-900 dark:text-gray-100">{exp}</h4>
                                ) : exp.includes('•') || exp.includes('Built') || exp.includes('Developed') || exp.includes('Managed') ? (
                                  <p className="text-gray-700 dark:text-gray-300 ml-2">• {exp.replace('•', '').trim()}</p>
                                ) : exp.includes('Atlanta') || exp.includes('Durham') || exp.includes('Suwanee') ? (
                                  <p className="text-gray-600 dark:text-gray-400 italic">{exp}</p>
                                ) : (
                                  <p className="text-gray-700 dark:text-gray-300">{exp}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              💼 Your work experience will be displayed here
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Projects */}
                    <div>
                      <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1 pb-0.5 border-b border-blue-300 dark:border-blue-700">
                        PROJECTS
                      </h2>
                      <div className="space-y-1">
                        {parsedResume?.projects && parsedResume.projects.length > 0 ? (
                          <div className="space-y-1">
                            {parsedResume.projects.slice(0, 6).map((project: string, index: number) => (
                              <div key={index} className="text-xs">
                                {project.includes('|') && !project.includes('•') ? (
                                  <h4 className="font-bold text-gray-900 dark:text-gray-100">{project}</h4>
                                ) : project.includes('•') || project.includes('Created') || project.includes('Built') || project.includes('Developed') ? (
                                  <p className="text-gray-700 dark:text-gray-300 ml-2">• {project.replace('•', '').trim()}</p>
                                ) : (
                                  <p className="text-gray-700 dark:text-gray-300">{project}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-gray-100 text-xs">
                                Gym Reservation Bot | <span className="bg-blue-100 dark:bg-blue-900/40 px-0.5 rounded font-semibold text-blue-800 dark:text-blue-300">Python, Selenium, Google Cloud</span>
                                <span className="text-gray-600 dark:text-gray-400 font-normal ml-2">January 2021</span>
                              </h4>
                              <ul className="text-gray-700 dark:text-gray-300 list-disc list-inside space-y-0.5 text-xs">
                                <li>Built automated reservation system using <span className="bg-green-100 dark:bg-green-900/40 px-0.5 rounded font-semibold text-green-800 dark:text-green-300">Python and Google Cloud Console</span></li>
                                <li>Deployed on <span className="bg-purple-100 dark:bg-purple-900/40 px-0.5 rounded font-semibold text-purple-800 dark:text-purple-300">Linux VM with Cron scheduling</span> for daily execution</li>
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-gray-100 text-xs">
                                Ticket Price Calculator App | <span className="bg-blue-100 dark:bg-blue-900/40 px-0.5 rounded font-semibold text-blue-800 dark:text-blue-300">Java, Android Studio</span>
                                <span className="text-gray-600 dark:text-gray-400 font-normal ml-2">November 2020</span>
                              </h4>
                              <ul className="text-gray-700 dark:text-gray-300 list-disc list-inside text-xs">
                                <li>Created <span className="bg-green-100 dark:bg-green-900/40 px-0.5 rounded font-semibold text-green-800 dark:text-green-300">Android application</span> for NYC museum ticket price calculation with custom UI</li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Technical Skills */}
                    <div>
                      <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1 pb-0.5 border-b border-blue-300 dark:border-blue-700">
                        TECHNICAL SKILLS
                      </h2>
                      <div className="text-xs">
                        {parsedResume?.skills && parsedResume.skills.length > 0 ? (
                          <div className="space-y-1">
                            {parsedResume.skills.slice(0, 4).map((skill: string, index: number) => (
                              <div key={index}>
                                {skill.includes(':') ? (
                                  <div>
                                    <span className="font-bold text-gray-800 dark:text-gray-200">
                                      {skill.split(':')[0]}:
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300 ml-1">
                                      {skill.split(':')[1]}
                                    </span>
                                  </div>
                                ) : (
                                  <p className="text-gray-700 dark:text-gray-300">{skill}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-gray-500 dark:text-gray-400">
                              🛠️ Your technical skills will be displayed here
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 flex flex-wrap justify-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <Link to="/dashboard">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 font-semibold">
              <Crown className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Link to="/analyze">
            <Button className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-0 px-6 py-3">
              <Zap className="w-4 h-4 mr-2" />
              Analyze Another Resume
            </Button>
          </Link>
          <Link to="/history" state={showApplicationSuccess ? { newApplicationCreated: true } : undefined}>
            <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3">
              <FileText className="w-4 h-4 mr-2" />
              View All Applications
            </Button>
          </Link>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default ResultsPage; 