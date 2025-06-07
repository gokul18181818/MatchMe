import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  CreditCard, 
  Save,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Download
} from 'lucide-react';
import { cn } from '../lib/utils';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';

const SettingsSection = ({ 
  title, 
  description, 
  children, 
  icon: Icon 
}: { 
  title: string, 
  description: string, 
  children: React.ReactNode,
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={cn(
      "p-6 rounded-xl border backdrop-blur-sm",
      "bg-white/50 dark:bg-zinc-900/50",
      "border-zinc-200 dark:border-zinc-700"
    )}
  >
    <div className="flex items-start gap-4 mb-6">
      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      </div>
    </div>
    {children}
  </motion.div>
);

const Settings: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

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
          Settings ⚙️
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Manage your account preferences and settings
        </p>
      </motion.div>

            <div className="max-w-6xl mx-auto space-y-10">
        {/* Account Settings */}
        <SettingsSection
          title="Account Information"
          description="Update your personal information and password"
          icon={User}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-base font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="John Smith"
                  className={cn(
                    "w-full px-5 py-4 rounded-lg border transition-all duration-300 text-base",
                    "bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm",
                    "border-zinc-200 dark:border-zinc-600",
                    "text-zinc-900 dark:text-white",
                    "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  )}
                />
              </div>
              
              <div>
                <label className="block text-base font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="email"
                    defaultValue="john.smith@email.com"
                    className={cn(
                      "w-full pl-12 pr-5 py-4 rounded-lg border transition-all duration-300 text-base",
                      "bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm",
                      "border-zinc-200 dark:border-zinc-600",
                      "text-zinc-900 dark:text-white",
                      "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-base font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className={cn(
                      "w-full pl-12 pr-14 py-4 rounded-lg border transition-all duration-300 text-base",
                      "bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm",
                      "border-zinc-200 dark:border-zinc-600",
                      "text-zinc-900 dark:text-white",
                      "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 py-3 text-base">
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </Button>
                <Button 
                  onClick={() => window.location.href = '/edit-profile'}
                  className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-0 py-3 text-base px-6"
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Billing Settings */}
        <SettingsSection
          title="Billing & Subscription"
          description="Manage your subscription and payment methods"
          icon={CreditCard}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={cn(
              "p-8 rounded-lg border",
              "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30",
              "border-blue-200 dark:border-blue-700"
            )}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-semibold text-zinc-900 dark:text-white">Pro Plan</h4>
                <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-base rounded-full font-medium">
                  Active
                </span>
              </div>
              <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
                Unlimited resume analyses • Next billing: Jan 15, 2024
              </p>
              <div className="flex flex-col gap-4">
                <Button className="w-full bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 py-3 text-base">
                  Manage Subscription
                </Button>
                <Button className="w-full bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 py-3 text-base">
                  <Download className="w-5 h-5 mr-2" />
                  Download Invoice
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <h5 className="text-xl font-medium text-zinc-900 dark:text-white">Payment Methods</h5>
              <div className={cn(
                "p-5 rounded-lg border flex items-center gap-5",
                "bg-white/80 dark:bg-zinc-800/80",
                "border-zinc-200 dark:border-zinc-600"
              )}>
                <div className="w-16 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded text-white text-base flex items-center justify-center font-bold">
                  VISA
                </div>
                <div className="flex-1">
                  <div className="font-medium text-zinc-900 dark:text-white text-base">•••• •••• •••• 4242</div>
                  <div className="text-base text-zinc-600 dark:text-zinc-400">Expires 12/26</div>
                </div>
                <Button className="bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600 border-0 py-2 px-4 text-base">
                  Edit
                </Button>
              </div>
              
              <Button className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 py-3 text-base">
                + Add New Card
              </Button>
            </div>
          </div>
        </SettingsSection>
      </div>


    </PageLayout>
  );
};

export default Settings; 