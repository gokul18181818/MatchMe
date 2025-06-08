import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Save, 
  Briefcase, 
  Upload,
  X,
  BarChart3,
  TrendingUp,
  FileText,
  Eye,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useFormContext, type ProfileData } from '../contexts/FormContext';
import { cn } from '../lib/utils';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';

const EditProfile: React.FC = () => {
  const { theme } = useTheme();
  const { profileData, updateProfileData } = useFormContext();
  const navigate = useNavigate();

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    updateProfileData(field, value);
  };

  const handleAvatarUpload = () => {
    // Handle avatar upload logic
    console.log('Avatar upload clicked');
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <PageLayout showBackButton backTo="/choose-action" backLabel="Back to Home">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
          Professional Profile 💼
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Update your professional information and career details for better resume targeting
        </p>
      </motion.div>

      {/* Dashboard Quick Access */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={cn(
          "p-6 rounded-xl border backdrop-blur-sm mb-8",
          "bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20",
          "border-blue-200 dark:border-blue-800"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
                Your Dashboard & Analytics
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                View your application stats, resume performance, and career insights
              </p>
            </div>
          </div>
          <button
            onClick={handleViewDashboard}
            className={cn(
              "group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300",
              "bg-white/70 dark:bg-zinc-800/70 hover:bg-white dark:hover:bg-zinc-700",
              "border border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300",
              "hover:text-blue-600 dark:hover:text-blue-400 font-medium"
            )}
          >
            <Eye className="w-4 h-4" />
            <span>View Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
        
        {/* Quick Stats Preview */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-zinc-800/50">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">5 Applications</p>
              <p className="text-xs text-zinc-500">This month</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-zinc-800/50">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">3 Resumes</p>
              <p className="text-xs text-zinc-500">Generated</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-zinc-800/50">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">92% Match</p>
              <p className="text-xs text-zinc-500">Average score</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={cn(
            "p-6 rounded-xl border backdrop-blur-sm h-fit",
            "bg-white/50 dark:bg-zinc-900/50",
            "border-zinc-200 dark:border-zinc-700"
          )}
        >
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">Profile Picture</h3>
          
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white">
                JS
              </div>
              <button
                onClick={handleAvatarUpload}
                className="absolute bottom-0 right-0 w-10 h-10 bg-white dark:bg-zinc-800 rounded-full border-2 border-zinc-200 dark:border-zinc-600 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors duration-200"
              >
                <Camera className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </button>
            </div>
            
            <Button 
              onClick={handleAvatarUpload}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 mb-3"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload New Photo
            </Button>
            
            <p className="text-xs text-zinc-500 dark:text-zinc-500 text-center">
              JPG, PNG or GIF files supported.
            </p>
          </div>
        </motion.div>

        {/* Main Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Professional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn(
              "p-6 rounded-xl border backdrop-blur-sm",
              "bg-white/50 dark:bg-zinc-900/50",
              "border-zinc-200 dark:border-zinc-700"
            )}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Professional Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={profileData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border transition-all duration-300",
                    "bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm",
                    "border-zinc-200 dark:border-zinc-600",
                    "text-zinc-900 dark:text-white",
                    "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={profileData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border transition-all duration-300",
                    "bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm",
                    "border-zinc-200 dark:border-zinc-600",
                    "text-zinc-900 dark:text-white",
                    "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  )}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Bio
              </label>
              <textarea
                rows={4}
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                className={cn(
                  "w-full px-4 py-3 rounded-lg border transition-all duration-300 resize-none",
                  "bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm",
                  "border-zinc-200 dark:border-zinc-600",
                  "text-zinc-900 dark:text-white",
                  "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                )}
              />
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex gap-4">
              <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button 
                onClick={() => navigate('/choose-action')}
                className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-0"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
            
            {/* Quick Navigation */}
            <div className={cn(
              "flex flex-wrap gap-2 p-4 rounded-lg border",
              "bg-zinc-50/50 dark:bg-zinc-800/30",
              "border-zinc-200 dark:border-zinc-700"
            )}>
              <span className="text-sm text-zinc-600 dark:text-zinc-400 mr-2">Quick actions:</span>
              <button
                onClick={handleViewDashboard}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
              >
                View Dashboard
              </button>
              <span className="text-zinc-400">•</span>
              <button
                onClick={() => navigate('/job-recommendations')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
              >
                Browse Jobs
              </button>
              <span className="text-zinc-400">•</span>
              <button
                onClick={() => navigate('/analyze')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
              >
                Tailor Resume
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default EditProfile; 