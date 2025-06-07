import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  Crown, 
  TrendingUp, 
  FileText, 
  Award, 
  Target,
  Edit3,
  Mail,
  Calendar,
  BarChart3,
  Zap
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';

const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subtitle,
  color,
  trend
}: { 
  icon: any, 
  title: string, 
  value: string | number, 
  subtitle: string,
  color: string,
  trend?: string
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={cn(
      "p-6 rounded-xl border transition-all duration-300",
      "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
      "border-gray-200 dark:border-gray-700",
      "hover:shadow-lg"
    )}
  >
    <div className="flex items-start justify-between mb-4">
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
    <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
  </motion.div>
);



const Dashboard: React.FC = () => {
  const { theme } = useTheme();

  return (
    <PageLayout showBackButton backTo="/results" backLabel="Back">
      <div>

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, John! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your resume optimization journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Stats */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={cn(
                "p-6 rounded-xl border",
                "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
                "border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                    JS
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                    <Crown className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">John Smith</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">john.smith@email.com</p>
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white text-sm font-semibold">
                          Pro Plan
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-500">•</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Member since Dec 2023</span>
                      </div>
                    </div>
                    <Link to="/edit-profile">
                      <Button className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-0">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard 
                icon={FileText}
                title="Resumes Analyzed"
                value="12"
                subtitle="This month"
                color="bg-blue-500"
                trend="+25%"
              />
              <StatCard 
                icon={TrendingUp}
                title="Avg. Improvement"
                value="34%"
                subtitle="Score increase"
                color="bg-green-500"
                trend="+8%"
              />
              <StatCard 
                icon={Target}
                title="Applications Sent"
                value="8"
                subtitle="Active applications"
                color="bg-purple-500"
                trend="+12%"
              />
              <StatCard 
                icon={Award}
                title="Interview Rate"
                value="75%"
                subtitle="Success rate"
                color="bg-cyan-500"
                trend="+15%"
              />
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className={cn(
                "p-6 rounded-xl border",
                "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
                "border-gray-200 dark:border-gray-700"
              )}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Link to="/analyze">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                    <FileText className="w-4 h-4 mr-2" />
                    New Analysis
                  </Button>
                </Link>
                <Link to="/history">
                  <Button className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-0">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View History
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-0">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Subscription Info */}
          <div className="space-y-6">
            {/* Subscription Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={cn(
                "p-6 rounded-xl border",
                "bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20",
                "border-blue-200 dark:border-blue-700"
              )}
            >
              <div className="flex items-start gap-3 mb-4">
                <Crown className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pro Plan</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Unlimited resume analyses</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Analyses this month</span>
                  <span className="font-semibold text-gray-900 dark:text-white">12 / ∞</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Next billing</span>
                  <span className="font-semibold text-gray-900 dark:text-white">Jan 15, 2024</span>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                Manage Subscription
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard; 