import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, CheckCircle, AlertCircle, Star, Download, Trophy, Target, Zap, Crown, PartyPopper, Building, FileText } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';
import confetti from 'canvas-confetti';

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
  
  // Get application data from navigation state
  const applicationData = location.state as {
    analysisScore?: number;
    company?: string;
    position?: string;
    applicationId?: string;
    newApplication?: boolean;
  } | null;

  const finalScore = applicationData?.analysisScore || 92;
  const showApplicationSuccess = applicationData?.newApplication || false;

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
              <p className="text-sm text-gray-600 dark:text-gray-300">Your resume now shines brighter than ever</p>
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
                    Why Your Resume Now Stands Out
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400 leading-relaxed">
                    <strong>Perfect keyword alignment</strong> ensures ATS systems recognize your skills instantly. 
                    <strong> Strategic quantified achievements</strong> showcase measurable impact that recruiters crave. 
                    <strong> Crystal-clear formatting</strong> guides readers through your professional story effortlessly.
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
                  <span className="font-bold text-gray-900 dark:text-white text-sm">Software Engineer Resume - Google</span>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-3 py-1 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-1 text-xs">
                  <Download className="w-3 h-3" />
                  Download PDF
                </Button>
              </div>

              {/* PDF Content - Realistic Resume */}
              <div className="flex-1 p-3 overflow-y-auto bg-white dark:bg-gray-900" style={{ fontSize: '10px' }}>
                <div className="max-w-full mx-auto bg-white dark:bg-gray-900 shadow-inner border border-gray-100 dark:border-gray-800 rounded p-3">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="text-center pb-2 border-b-2 border-blue-600 dark:border-blue-400">
                      <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Sample Resume</h1>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                        123 Street Name, Town, State 12345
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">
                        123-456-7890 • email@gmail.com • linkedin.com/in/username • github.com/username
                      </p>
                    </div>

                    {/* Education */}
                    <div>
                      <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1 pb-0.5 border-b border-blue-300 dark:border-blue-700">
                        EDUCATION
                      </h2>
                      <div className="mb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-xs">State University</h4>
                            <p className="text-gray-700 dark:text-gray-300 text-xs">Bachelor of Science in <span className="bg-blue-100 dark:bg-blue-900/40 px-0.5 rounded font-semibold text-blue-800 dark:text-blue-300">Computer Science</span></p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-600 dark:text-gray-400 text-xs">Sep. 2017 – May 2021</p>
                            <p className="text-gray-600 dark:text-gray-400 text-xs">City, State</p>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-0.5">Relevant Coursework:</p>
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            <span className="bg-purple-100 dark:bg-purple-900/40 px-0.5 rounded font-semibold text-purple-800 dark:text-purple-300">Data Structures</span> • 
                            <span className="bg-green-100 dark:bg-green-900/40 px-0.5 rounded font-semibold text-green-800 dark:text-green-300"> Algorithms Analysis</span> • 
                            Database Management • <span className="bg-cyan-100 dark:bg-cyan-900/40 px-0.5 rounded font-semibold text-cyan-800 dark:text-cyan-300">Artificial Intelligence</span> • Systems Programming
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Experience */}
                    <div>
                      <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1 pb-0.5 border-b border-blue-300 dark:border-blue-700">
                        EXPERIENCE
                      </h2>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between items-start mb-0.5">
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-gray-100 text-xs">Electronics Company</h4>
                              <p className="text-gray-700 dark:text-gray-300 text-xs font-semibold">Software Engineer Intern</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-600 dark:text-gray-400 text-xs">May 2020 – August 2020</p>
                              <p className="text-gray-600 dark:text-gray-400 text-xs">City, State</p>
                            </div>
                          </div>
                          <ul className="text-gray-700 dark:text-gray-300 list-disc list-inside space-y-0.5 text-xs">
                            <li>Developed automated service for <span className="bg-green-100 dark:bg-green-900/40 px-0.5 rounded font-semibold text-green-800 dark:text-green-300">daily unit testing</span> to reduce bug identification time for development team</li>
                            <li>Built scripts using <span className="bg-blue-100 dark:bg-blue-900/40 px-0.5 rounded font-semibold text-blue-800 dark:text-blue-300">Python and PowerShell</span> to aggregate XML results and automate code deployment</li>
                            <li>Implemented <span className="bg-purple-100 dark:bg-purple-900/40 px-0.5 rounded font-semibold text-purple-800 dark:text-purple-300">Jenkins CI/CD</span> pipeline for automated testing and report generation</li>
                            <li>Created test result visualization using <span className="bg-cyan-100 dark:bg-cyan-900/40 px-0.5 rounded font-semibold text-cyan-800 dark:text-cyan-300">HTML, JavaScript, and CSS</span></li>
                          </ul>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-start mb-0.5">
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-gray-100 text-xs">Startup, Inc</h4>
                              <p className="text-gray-700 dark:text-gray-300 text-xs font-semibold">Front End Developer Intern</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-600 dark:text-gray-400 text-xs">May 2019 – August 2019</p>
                              <p className="text-gray-600 dark:text-gray-400 text-xs">City, State</p>
                            </div>
                          </div>
                          <ul className="text-gray-700 dark:text-gray-300 list-disc list-inside space-y-0.5 text-xs">
                            <li>Developed cross-platform mobile app using <span className="bg-green-100 dark:bg-green-900/40 px-0.5 rounded font-semibold text-green-800 dark:text-green-300">Dart and Flutter</span> for iOS/Android</li>
                            <li>Integrated <span className="bg-blue-100 dark:bg-blue-900/40 px-0.5 rounded font-semibold text-blue-800 dark:text-blue-300">Google Firebase</span> for cross-platform data management</li>
                            <li>Collaborated using <span className="bg-purple-100 dark:bg-purple-900/40 px-0.5 rounded font-semibold text-purple-800 dark:text-purple-300">Git version control</span> for task management and code organization</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Projects */}
                    <div>
                      <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1 pb-0.5 border-b border-blue-300 dark:border-blue-700">
                        PROJECTS
                      </h2>
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
                    </div>

                    {/* Technical Skills */}
                    <div>
                      <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1 pb-0.5 border-b border-blue-300 dark:border-blue-700">
                        TECHNICAL SKILLS
                      </h2>
                      <div className="space-y-1 text-xs">
                        <div>
                          <span className="font-bold text-gray-800 dark:text-gray-200">Languages: </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            <span className="bg-blue-100 dark:bg-blue-900/40 px-0.5 rounded font-semibold text-blue-800 dark:text-blue-300">Python</span>, 
                            <span className="bg-green-100 dark:bg-green-900/40 px-0.5 rounded font-semibold text-green-800 dark:text-green-300"> Java</span>, C, 
                            <span className="bg-purple-100 dark:bg-purple-900/40 px-0.5 rounded font-semibold text-purple-800 dark:text-purple-300"> HTML/CSS, JavaScript</span>, SQL
                          </span>
                        </div>
                        <div>
                          <span className="font-bold text-gray-800 dark:text-gray-200">Developer Tools: </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            VS Code, Eclipse, <span className="bg-cyan-100 dark:bg-cyan-900/40 px-0.5 rounded font-semibold text-cyan-800 dark:text-cyan-300">Google Cloud Platform</span>, Android Studio
                          </span>
                        </div>
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