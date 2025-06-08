import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  FileText, 
  ChevronRight,
  Sparkles,
  ArrowRight,
  Briefcase,
  User,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const ChooseActionPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();

  const actions = [
    {
      id: 'job-recommendations',
      title: 'Look at New Curated Jobs',
      description: 'AI-curated LinkedIn jobs with apply now and generate resume buttons',
      icon: Briefcase,
      iconColor: 'text-emerald-600',
      bgGradient: 'from-emerald-500 to-emerald-600',
      hoverGradient: 'from-emerald-600 to-emerald-700',
      route: '/job-recommendations',
      ctaText: 'Browse new jobs'
    },
    {
      id: 'tailor',
      title: 'Tailor Resume for Job',
      description: 'Enter a job URL and generate perfectly customized resumes with AI',
      icon: Target,
      iconColor: 'text-purple-600',
      bgGradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'from-purple-600 to-purple-700',
      route: '/analyze',
      ctaText: 'Start tailoring'
    },
    {
      id: 'applications',
      title: 'Look at Past Applications',
      description: 'Track your job applications, view generated resumes, and monitor status',
      icon: FileText,
      iconColor: 'text-blue-600',
      bgGradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'from-blue-600 to-blue-700',
      route: '/history',
      ctaText: 'View applications'
    }
  ];

  const handleActionClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden transition-colors duration-300",
      theme === "dark" ? "bg-zinc-950 text-white" : "bg-gray-50 text-zinc-900"
    )}>
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className={cn(
          "absolute top-[-20rem] left-[-20rem] z-0 blur-[6rem]",
          theme === "dark" ? "opacity-20" : "opacity-10"
        )}
        style={{
          backgroundImage: "radial-gradient(circle at center, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.2) 40%, transparent 70%)",
          width: "60rem",
          height: "60rem",
        }} />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {/* User Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              theme === "dark" ? "bg-blue-600" : "bg-blue-500"
            )}>
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold">FitCheck AI</h1>
          </div>
          
          {/* User Welcome & Profile Info */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-4">
              Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'there'}! 👋
            </h2>
            <p className={cn(
              "text-xl mb-6",
              theme === "dark" ? "text-zinc-400" : "text-zinc-600"
            )}>
              What would you like to do today?
            </p>

            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                theme === "dark" ? "bg-zinc-800/50" : "bg-white/70"
              )}>
                <User className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
              </div>
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                theme === "dark" ? "bg-zinc-800/50" : "bg-white/70"
              )}>
                <Calendar className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">
                  Joined {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                theme === "dark" ? "bg-zinc-800/50" : "bg-white/70"
              )}>
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Pro Member</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Cards */}
        <div className="grid lg:grid-cols-3 gap-6">
          {actions.map((action, index) => {
            const Icon = action.icon;
            
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => handleActionClick(action.route)}
                className={cn(
                  "group relative p-8 rounded-2xl border-2 transition-all duration-300",
                  "hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20",
                  "text-left w-full h-full min-h-[300px] flex flex-col",
                  theme === "dark" 
                    ? "bg-zinc-900/50 border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/70" 
                    : "bg-white/80 border-gray-200 hover:border-gray-300 hover:bg-white"
                )}
              >
                {/* Icon */}
                <div className={cn(
                  "w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 mb-6",
                  `bg-gradient-to-r ${action.bgGradient} group-hover:${action.hoverGradient}`,
                  "shadow-lg group-hover:shadow-xl"
                )}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {action.title}
                  </h3>
                  <p className={cn(
                    "text-base leading-relaxed mb-6 flex-1",
                    theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                  )}>
                    {action.description}
                  </p>
                  
                  {/* CTA */}
                  <div className="flex items-center mt-auto">
                    <span className={cn(
                      "text-lg font-medium",
                      theme === "dark" ? "text-blue-400" : "text-blue-600"
                    )}>
                      {action.ctaText}
                    </span>
                    <ChevronRight className="w-6 h-6 text-blue-600 group-hover:translate-x-2 transition-transform duration-300 ml-2" />
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.button>
            );
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className={cn(
            "text-sm",
            theme === "dark" ? "text-zinc-500" : "text-zinc-500"
          )}>
            Need help? Check out our{' '}
            <button className="text-blue-500 hover:text-blue-600 underline">
              quick start guide
            </button>{' '}
            or{' '}
            <button className="text-blue-500 hover:text-blue-600 underline">
              contact support
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ChooseActionPage;