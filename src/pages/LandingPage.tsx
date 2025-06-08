import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Target, Zap, Sparkles, FileText, BarChart3 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import ThemeToggle from '../components/ThemeToggle';
import Button from '../components/Button';
import CompanyLogos from '../components/CompanyLogos';

const LandingPage: React.FC = () => {
  const { theme } = useTheme();
  const { user, loading, debugAuthState } = useAuth();
  const navigate = useNavigate();

  // Redirect logged-in users to choose-action page
  useEffect(() => {
    if (!loading && user) {
      console.log('User is logged in, redirecting to choose-action page');
      navigate('/choose-action', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center",
        theme === "dark" ? "bg-zinc-950" : "bg-white"
      )}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={cn(
            "text-lg",
            theme === "dark" ? "text-zinc-300" : "text-zinc-600"
          )}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Only show landing page for non-authenticated users
  if (user) {
    return null; // Will redirect in useEffect
  }

  const features = [
    {
      icon: <Target className="w-8 h-8 text-blue-500" />,
      title: 'AI Resume Analysis',
      description: 'Instantly analyze your resume against any job description with advanced AI matching'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-green-500" />,
      title: 'Match Score',
      description: 'Get a detailed percentage match score and see exactly what\'s missing'
    },
    {
      icon: <FileText className="w-8 h-8 text-purple-500" />,
      title: 'Tailored Resume',
      description: 'Generate a beautifully formatted resume optimized for your target job'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Resumes Analyzed' },
    { number: '85%', label: 'Interview Success Rate' },
    { number: '2.5x', label: 'Faster Job Placement' },
  ];

  return (
    <div 
      className={cn(
        "min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300",
        theme === "dark" 
          ? "bg-zinc-950 text-white" 
          : "bg-white text-zinc-900"
      )}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className={cn(
            "absolute top-[-40rem] right-[-30rem] z-0 blur-[8rem]",
            theme === "dark" ? "opacity-20" : "opacity-10"
          )}
          style={{
            backgroundImage: theme === "dark" 
              ? "radial-gradient(circle at center, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.2) 40%, transparent 70%)"
              : "radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.1) 40%, transparent 70%)",
            width: "100rem",
            height: "100rem",
          }}
        />
        <div 
          className={cn(
            "absolute bottom-[-40rem] left-[-30rem] z-0 blur-[8rem]",
            theme === "dark" ? "opacity-20" : "opacity-10"
          )}
          style={{
            backgroundImage: theme === "dark" 
              ? "radial-gradient(circle at center, rgba(34, 197, 94, 0.3) 0%, rgba(59, 130, 246, 0.2) 40%, transparent 70%)"
              : "radial-gradient(circle at center, rgba(34, 197, 94, 0.2) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 70%)",
            width: "100rem",
            height: "100rem",
          }}
        />
      </div>

      {/* Grid Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: theme === "dark"
            ? `linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
               linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`
            : `linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
               linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

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
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {/* Debug Auth State Button (temporary) */}
          <Button 
            onClick={debugAuthState}
            className={cn(
              "rounded-full px-3 py-2 text-xs font-medium transition-all duration-300",
              theme === "dark" 
                ? "bg-red-600 text-white hover:bg-red-700" 
                : "bg-red-500 text-white hover:bg-red-600"
            )}
          >
            Debug Auth
          </Button>
          <Link to="/login">
            <Button className={cn(
              "rounded-full px-4 py-2 font-medium transition-all duration-300",
              theme === "dark" 
                ? "text-white hover:bg-zinc-800" 
                : "text-zinc-900 hover:bg-zinc-100"
            )}>
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button className={cn(
              "rounded-full px-6 py-2 font-semibold transition-all duration-300",
              theme === "dark" 
                ? "bg-white text-black hover:bg-gray-200" 
                : "bg-zinc-900 text-white hover:bg-zinc-800"
            )}>
              Get Started
            </Button>
          </Link>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center"
          >
            <div 
              className={cn(
                "rounded-full px-6 py-3 flex items-center gap-3 border",
                theme === "dark" 
                  ? "bg-zinc-900/50 border-zinc-800 backdrop-blur-sm" 
                  : "bg-white/50 border-zinc-200 backdrop-blur-sm"
              )}
            >
              <span className="text-sm flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs">
                  🚀
                </span>
                Boost Your Interview Success Rate by 85%
              </span>
            </div>
          </motion.div>
          
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-6xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              AI-Powered Resume
              <br />
              Optimization
            </h1>
            <p className={cn(
              "text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed",
              theme === "dark" ? "text-zinc-300" : "text-zinc-600"
            )}>
              Transform your resume into an interview magnet. Our AI analyzes job descriptions and tailors your resume for maximum impact.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button className={cn(
                "font-semibold px-8 py-4 text-lg rounded-full border-2 transition-all duration-300",
                theme === "dark" 
                  ? "border-zinc-700 text-white hover:bg-zinc-800" 
                  : "border-zinc-300 text-zinc-900 hover:bg-zinc-100"
              )}>
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className={cn(
                  "text-sm mt-2",
                  theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                )}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Company Logos */}
          <CompanyLogos />
        </div>
      </main>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="relative z-10 py-20"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How FitCheck AI Works
            </h2>
            <p className={cn(
              "text-xl max-w-2xl mx-auto",
              theme === "dark" ? "text-zinc-300" : "text-zinc-600"
            )}>
              Three simple steps to transform your resume and boost your interview chances
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className={cn(
                  "p-8 rounded-2xl border backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group",
                  theme === "dark" 
                    ? "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700" 
                    : "bg-white/30 border-zinc-200 hover:border-zinc-300"
                )}
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className={cn(
                  "text-lg leading-relaxed",
                  theme === "dark" ? "text-zinc-300" : "text-zinc-600"
                )}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="relative z-10 py-20"
      >
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className={cn(
            "p-12 rounded-3xl border backdrop-blur-sm",
            theme === "dark" 
              ? "bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 border-zinc-700" 
              : "bg-gradient-to-r from-white/50 to-gray-50/50 border-zinc-200"
          )}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Land Your Dream Job?
            </h2>
            <p className={cn(
              "text-xl mb-8 max-w-2xl mx-auto",
              theme === "dark" ? "text-zinc-300" : "text-zinc-600"
            )}>
              Join thousands of successful job seekers who've used FitCheck AI to optimize their resumes and boost their interview success rate.
            </p>
            <Link to="/analyze">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-12 py-4 text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                Start Your Success Story
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage; 