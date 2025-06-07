import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, ChevronDown, Settings, FileText, LogOut, User, LayoutDashboard, Crown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

interface NavigationProps {
  showBackButton?: boolean;
  backTo?: string;
  backLabel?: string;
}

const Navigation: React.FC<NavigationProps> = ({ 
  showBackButton = false, 
  backTo = "/", 
  backLabel = "Back" 
}) => {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Get user data with fallbacks
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U';

  const handleSignOut = async () => {
    setIsProfileOpen(false);
    await signOut();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-between mb-8 relative"
    >
      {/* Left Side - Back Button */}
      <div className="flex items-center w-1/4">
        {showBackButton && (
          <Link 
            to={backTo} 
            className={cn(
              "flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-300",
              "bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10",
              "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white",
              "border border-white/20 dark:border-white/10"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-sm">{backLabel}</span>
          </Link>
        )}
      </div>
      
      {/* Center - FitCheck Logo */}
      <div className="flex justify-center w-1/2">
        <Link 
          to="/"
          className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 group"
        >
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
            "bg-gradient-to-r from-blue-500 to-purple-600 group-hover:from-blue-600 group-hover:to-purple-700",
            "shadow-lg group-hover:shadow-xl"
          )}>
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FitCheck AI
          </h1>
        </Link>
      </div>
      
      {/* Right Side - Enhanced Navigation */}
      <div className="flex items-center justify-end space-x-3 w-1/4">
        {/* Dashboard Button */}
        <Link 
          to="/dashboard" 
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300",
            "bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10",
            "text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white",
            "border border-white/20 dark:border-white/10 font-medium text-sm",
            location.pathname === '/dashboard' && "bg-blue-100/50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600"
          )}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>

        {/* Past Resumes Button */}
        <Link 
          to="/history" 
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300",
            "bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10",
            "text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white",
            "border border-white/20 dark:border-white/10 font-medium text-sm",
            location.pathname === '/history' && "bg-blue-100/50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600"
          )}
        >
          <FileText className="w-4 h-4" />
          <span>Resumes</span>
        </Link>

        {/* Subscription Button */}
        <Link 
          to="/subscription" 
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300",
            "bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30",
            "text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100",
            "border border-purple-300/50 dark:border-purple-600/50 font-medium text-sm",
            "shadow-lg shadow-purple-500/20",
            location.pathname === '/subscription' && "bg-purple-100/50 dark:bg-purple-900/30 border-purple-400 dark:border-purple-500"
          )}
        >
          <Crown className="w-4 h-4" />
          <span>Pro</span>
        </Link>
        
        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300",
              "bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10",
              "text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white",
              "border border-white/20 dark:border-white/10 font-medium text-sm",
              isProfileOpen && "bg-white/20 dark:bg-white/10"
            )}
          >
            <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xs font-bold text-white">{initials}</span>
            </div>
            <span className="hidden lg:block">{displayName}</span>
            <ChevronDown className={cn(
              "w-4 h-4 transition-transform duration-300",
              isProfileOpen && "rotate-180"
            )} />
          </button>
          
          {/* Dropdown Menu */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "absolute right-0 mt-2 w-56 rounded-xl shadow-xl z-50",
                  "bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl",
                  "border border-white/20 dark:border-zinc-700",
                  "overflow-hidden"
                )}
              >
                <div className="p-3 border-b border-zinc-200 dark:border-zinc-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{initials}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-white">{displayName}</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">{userEmail}</div>
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <Link
                    to="/edit-profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
                  >
                    <User className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                    <span className="text-zinc-700 dark:text-zinc-300">Edit Profile</span>
                  </Link>
                  
                  <Link
                    to="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
                  >
                    <Settings className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                    <span className="text-zinc-700 dark:text-zinc-300">Settings</span>
                  </Link>
                  
                  <div className="border-t border-zinc-200 dark:border-zinc-700 mt-2 pt-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 text-red-600 dark:text-red-400"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </motion.div>
  );
};

export default Navigation; 