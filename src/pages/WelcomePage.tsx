import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  BarChart3, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  CheckCircle,
  Upload,
  Zap,
  Users,
  TrendingUp
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import Button from '../components/Button';

const WelcomePage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';

  useEffect(() => {
    // Auto-advance through the steps
    const timer = setTimeout(() => {
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentStep]);

  const features = [
    {
      icon: <Target className="w-8 h-8 text-blue-500" />,
      title: 'AI Resume Analysis',
      description: 'Upload your resume and get instant AI-powered analysis against any job description.',
      stats: '95% accuracy'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-green-500" />,
      title: 'Match Score & Insights',
      description: 'See your compatibility percentage and detailed improvement suggestions.',
      stats: '10+ data points'
    },
    {
      icon: <FileText className="w-8 h-8 text-purple-500" />,
      title: 'Tailored Resume Generation',
      description: 'Generate optimized resumes specifically crafted for your target positions.',
      stats: '3x more interviews'
    }
  ];

  const steps = [
    {
      title: `Welcome to FitCheck AI, ${userName}! 🎉`,
      subtitle: 'Your AI-powered career companion is ready to transform your job search',
      icon: <Sparkles className="w-16 h-16 text-blue-500" />
    },
    {
      title: 'Here\'s what you can do:',
      subtitle: 'Three powerful tools to boost your career success',
      icon: <Zap className="w-16 h-16 text-green-500" />
    },
    {
      title: 'Ready to get started?',
      subtitle: 'Let\'s analyze your first resume and see the magic happen',
      icon: <Target className="w-16 h-16 text-purple-500" />
    }
  ];

  const handleGetStarted = () => {
    navigate('/analyze');
  };

  const handleSkipToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300",
      theme === "dark" ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"
    )}>
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className={cn(
          "absolute top-[-20rem] right-[-20rem] z-0 blur-[8rem]",
          theme === "dark" ? "opacity-20" : "opacity-10"
        )}
        style={{
          backgroundImage: "radial-gradient(circle at center, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.2) 40%, transparent 70%)",
          width: "60rem",
          height: "60rem",
        }} />
        <div className={cn(
          "absolute bottom-[-20rem] left-[-20rem] z-0 blur-[8rem]",
          theme === "dark" ? "opacity-20" : "opacity-10"
        )}
        style={{
          backgroundImage: "radial-gradient(circle at center, rgba(34, 197, 94, 0.4) 0%, rgba(59, 130, 246, 0.2) 40%, transparent 70%)",
          width: "60rem",
          height: "60rem",
        }} />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center p-6 relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            theme === "dark" ? "bg-blue-600" : "bg-blue-500"
          )}>
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="font-bold text-xl">FitCheck AI</div>
        </div>
        <button 
          onClick={handleSkipToDashboard}
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Skip intro →
        </button>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center relative z-10 pb-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Step Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center gap-2 mb-8"
          >
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  index <= currentStep
                    ? "bg-blue-500"
                    : theme === "dark" ? "bg-zinc-700" : "bg-zinc-300"
                )}
              />
            ))}
          </motion.div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Step Icon */}
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={cn(
                    "w-24 h-24 rounded-full flex items-center justify-center",
                    "bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border",
                    theme === "dark" ? "border-zinc-700" : "border-zinc-200"
                  )}
                >
                  {steps[currentStep].icon}
                </motion.div>
              </div>

              {/* Step Text */}
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-4xl md:text-5xl font-bold"
                >
                  {steps[currentStep].title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className={cn(
                    "text-xl max-w-2xl mx-auto",
                    theme === "dark" ? "text-zinc-300" : "text-zinc-600"
                  )}
                >
                  {steps[currentStep].subtitle}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Features Section (only on step 1) */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className={cn(
                    "p-6 rounded-xl border transition-all duration-300",
                    "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
                    "border-gray-200 dark:border-gray-700",
                    "hover:shadow-lg hover:scale-105"
                  )}
                >
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className={cn(
                    "text-sm mb-3",
                    theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                  )}>
                    {feature.description}
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-xs font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    {feature.stats}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CTA Section (only on step 2) */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-8"
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">10K+</div>
                  <div className="text-sm text-zinc-500">Resumes Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">85%</div>
                  <div className="text-sm text-zinc-500">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">2.5x</div>
                  <div className="text-sm text-zinc-500">More Interviews</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Analyze My Resume
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  onClick={handleSkipToDashboard}
                  className={cn(
                    "font-semibold px-8 py-4 text-lg rounded-full border-2 transition-all duration-300",
                    theme === "dark"
                      ? "border-zinc-700 text-white hover:bg-zinc-800"
                      : "border-zinc-300 text-zinc-900 hover:bg-zinc-100"
                  )}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Go to Dashboard
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-8 pt-8">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Instant results</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WelcomePage; 