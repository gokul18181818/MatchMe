import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Target, 
  FileText, 
  ChevronRight,
  Sparkles,
  ArrowRight
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
      id: 'dashboard',
      title: 'View Dashboard',
      description: 'See your analytics, recent activity, and performance overview',
      icon: BarChart3,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      route: '/dashboard'
    },
    {
      id: 'tailor',
      title: 'Tailor Resume for Job',
      description: 'Find jobs and generate perfectly customized resumes',
      icon: Target,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      route: '/analyze'
    },
    {
      id: 'applications',
      title: 'Look at Past Applications',
      description: 'Track your job applications and their current status',
      icon: FileText,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      route: '/history'
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

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
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
          
          <h2 className="text-4xl font-bold mb-4">
            Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'there'}! 👋
          </h2>
          <p className={cn(
            "text-xl",
            theme === "dark" ? "text-zinc-400" : "text-zinc-600"
          )}>
            What would you like to do today?
          </p>
        </motion.div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6">
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
                  "hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20",
                  "text-left w-full",
                  theme === "dark" 
                    ? "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/70" 
                    : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                  action.borderColor.replace('border-', 'hover:border-')
                )}
              >
                {/* Icon Background */}
                <div className={cn(
                  "w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300",
                  action.bgColor
                )}>
                  <Icon className={cn("w-8 h-8", action.iconColor)} />
                </div>

                {/* Content */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {action.title}
                  </h3>
                  <p className={cn(
                    "text-sm leading-relaxed",
                    theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                  )}>
                    {action.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-sm font-medium",
                    theme === "dark" ? "text-zinc-500" : "text-zinc-500"
                  )}>
                    Get started
                  </span>
                  <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform duration-300" />
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.button>
            );
          })}
        </div>

        {/* Quick Stats or Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className={cn(
            "text-sm",
            theme === "dark" ? "text-zinc-500" : "text-zinc-500"
          )}>
            💡 Tip: Use AI-powered resume tailoring to increase your interview chances by 3x
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ChooseActionPage; 