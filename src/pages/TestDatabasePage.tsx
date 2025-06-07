import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Users, FileText, Settings, History, CheckCircle } from 'lucide-react';
import { getDevUserId } from '../utils/tempUser';
import { createUserProfile, createUserSettings, createUserPreferences } from '../services/userService';
import { migrateMockApplicationData } from '../services/applicationService';

const TestDatabasePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const userId = getDevUserId();

  const addResult = (message: string) => {
    setResults(prev => [...prev, message]);
  };

  const setupInitialData = async () => {
    setIsLoading(true);
    setResults([]);

    try {
      addResult('🚀 Starting database setup...');

      // Create user profile
      addResult('📝 Creating user profile...');
      const profile = await createUserProfile(userId, {
        first_name: 'John',
        last_name: 'Smith',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        birth_date: '1995-03-15',
        job_title: 'Software Engineer',
        company: 'Tech Corp',
        bio: 'Passionate software engineer with 5+ years of experience building scalable web applications.',
        website: 'https://johnsmith.dev',
        github_username: 'johnsmith',
        linkedin_username: 'johnsmith',
        twitter_username: 'johnsmith_dev',
      });
      
      if (profile) {
        addResult('✅ User profile created successfully');
      } else {
        addResult('❌ Failed to create user profile');
      }

      // Create user settings
      addResult('⚙️ Creating user settings...');
      const settings = await createUserSettings(userId, {
        full_name: 'Sample User',
        display_email: 'user@example.com',
        show_password: false,
        theme: 'dark',
        email_notifications: true,
        analysis_reminders: true,
        privacy_level: 'private',
      });

      if (settings) {
        addResult('✅ User settings created successfully');
      } else {
        addResult('❌ Failed to create user settings');
      }

      // Create user preferences
      addResult('🎯 Creating user preferences...');
      const preferences = await createUserPreferences(userId, {
        default_history_sort: 'date',
        default_status_filter: 'all',
        saved_search_queries: ['Software Engineer', 'Frontend Developer'],
        recent_companies: ['Google', 'Microsoft', 'Apple'],
        pinned_actions: ['analyze', 'history'],
        hidden_stats: [],
        items_per_page: 10,
        compact_mode: false,
        show_tooltips: true,
        auto_save_drafts: true,
        preferred_template_order: ['Jake', 'Classic', 'Modern'],
        default_analysis_options: {
          includeKeywords: true,
          checkATS: true,
          improveReadability: true,
        },
      });

      if (preferences) {
        addResult('✅ User preferences created successfully');
      } else {
        addResult('❌ Failed to create user preferences');
      }

      // Migrate mock application data
      addResult('📊 Migrating mock application data...');
      await migrateMockApplicationData(userId);
      addResult('✅ Application history data migrated successfully');

      addResult('🎉 Database setup complete! Your FitCheck AI app is now connected to Supabase.');
      addResult('💡 You can now navigate to Settings, EditProfile, or History to see real data.');

    } catch (error) {
      console.error('Error setting up initial data:', error);
      addResult('❌ Error occurred during setup: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="relative min-h-screen">
        {/* Glassmorphism background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Database className="w-8 h-8 text-white" />
              </motion.div>
              
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Database Connection Test
              </h1>
              <p className="text-gray-400 text-lg">
                Set up your FitCheck AI app with real Supabase data
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Users, label: 'User Profile', color: 'from-blue-500 to-cyan-500' },
                { icon: Settings, label: 'Settings', color: 'from-purple-500 to-pink-500' },
                { icon: FileText, label: 'Preferences', color: 'from-green-500 to-emerald-500' },
                { icon: History, label: 'Applications', color: 'from-orange-500 to-red-500' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center mb-2`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-white font-semibold text-sm">{item.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Setup Button */}
            <div className="text-center mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={setupInitialData}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Setting up...
                  </>
                ) : (
                  <>
                    <Database className="w-5 h-5" />
                    Setup Database
                  </>
                )}
              </motion.button>
            </div>

            {/* Results Log */}
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/20"
              >
                <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Setup Results
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {results.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="text-gray-300 font-mono text-sm p-2 bg-white/5 rounded-lg"
                    >
                      {result}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20"
            >
              <h3 className="text-white font-semibold text-lg mb-4">Next Steps:</h3>
              <ul className="text-gray-300 space-y-2">
                <li>1. Click "Setup Database" to populate your Supabase database</li>
                <li>2. Navigate to Settings page to see your profile data from the database</li>
                <li>3. Visit EditProfile to modify your information (automatically saves to DB)</li>
                <li>4. Check History page to see your application history data</li>
                <li>5. All changes will now persist in Supabase instead of localStorage</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TestDatabasePage; 