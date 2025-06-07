import React from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Save, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Globe, 
  Github, 
  Linkedin, 
  Twitter,
  Upload,
  X
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useFormContext, type ProfileData } from '../contexts/FormContext';
import { cn } from '../lib/utils';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';

const EditProfile: React.FC = () => {
  const { theme } = useTheme();
  const { profileData, updateProfileData } = useFormContext();

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    updateProfileData(field, value);
  };

  const handleAvatarUpload = () => {
    // Handle avatar upload logic
    console.log('Avatar upload clicked');
  };

  return (
    <PageLayout showBackButton backTo="/dashboard" backLabel="Back to Dashboard">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
          Edit Profile 👤
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Update your personal information and professional details
        </p>
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
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={cn(
              "p-6 rounded-xl border backdrop-blur-sm",
              "bg-white/50 dark:bg-zinc-900/50",
              "border-zinc-200 dark:border-zinc-700"
            )}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
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
                  Last Name
                </label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
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
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={cn(
                      "w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300",
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
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={cn(
                      "w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300",
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
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={cn(
                      "w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300",
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
                  Birth Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="date"
                    value={profileData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className={cn(
                      "w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300",
                      "bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm",
                      "border-zinc-200 dark:border-zinc-600",
                      "text-zinc-900 dark:text-white",
                      "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    )}
                  />
                </div>
              </div>
            </div>
          </motion.div>

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

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={cn(
              "p-6 rounded-xl border backdrop-blur-sm",
              "bg-white/50 dark:bg-zinc-900/50",
              "border-zinc-200 dark:border-zinc-700"
            )}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Social Links</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className={cn(
                      "w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300",
                      "bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm",
                      "border-zinc-200 dark:border-zinc-600",
                      "text-zinc-900 dark:text-white",
                      "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    GitHub
                  </label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                      type="text"
                      value={profileData.github}
                      onChange={(e) => handleInputChange('github', e.target.value)}
                      placeholder="username"
                      className={cn(
                        "w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300",
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
                    LinkedIn
                  </label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                      type="text"
                      value={profileData.linkedin}
                      onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      placeholder="username"
                      className={cn(
                        "w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300",
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
                    Twitter
                  </label>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                      type="text"
                      value={profileData.twitter}
                      onChange={(e) => handleInputChange('twitter', e.target.value)}
                      placeholder="username"
                      className={cn(
                        "w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300",
                        "bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm",
                        "border-zinc-200 dark:border-zinc-600",
                        "text-zinc-900 dark:text-white",
                        "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-4"
          >
            <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-0">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default EditProfile; 