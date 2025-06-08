import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search,
  Filter,
  Download,
  ExternalLink,
  Calendar,
  TrendingUp,
  FileText,
  Building2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit3,
  Save,
  X,
  Upload,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';
import {
  GoogleIcon,
  MicrosoftIcon,
  AppleIcon,
  MetaIcon,
  NetflixIcon,
  AmazonIcon,
} from '../components/CompanyLogos';
import { getFilteredApplications, getApplicationStats, updateApplication } from '../services/applicationService';
import type { ApplicationHistory, ApplicationStats } from '../services/applicationService';

// Company logo mapping
const getCompanyLogo = (company: string): React.ReactNode => {
  const logos: { [key: string]: React.ReactNode } = {
    'Google': <GoogleIcon className="w-6 h-6" />,
    'Microsoft': <MicrosoftIcon className="w-6 h-6" />,
    'Apple': <AppleIcon className="w-6 h-6" />,
    'Meta': <MetaIcon className="w-6 h-6" />,
    'Netflix': <NetflixIcon className="w-6 h-6" />,
    'Amazon': <AmazonIcon className="w-6 h-6" />,
  };
  
  return logos[company] || <Building2 className="w-6 h-6 text-gray-400" />;
};

const StatusBadge = ({ status }: { status: ApplicationHistory['status'] }) => {
  const statusConfig = {
    pending: {
      color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      icon: Clock,
      text: 'Pending'
    },
    interviewed: {
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      icon: CheckCircle,
      text: 'Interviewed'
    },
    rejected: {
      color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      icon: XCircle,
      text: 'Rejected'
    },
    offer: {
      color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      icon: CheckCircle,
      text: 'Offer Received'
    },
    accepted: {
      color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      icon: CheckCircle,
      text: 'Accepted'
    },
    declined: {
      color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300',
      icon: XCircle,
      text: 'Declined'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
      config.color
    )}>
      <Icon className="w-3 h-3" />
      {config.text}
    </span>
  );
};

const ResumeHistoryCard = ({ resume }: { resume: ApplicationHistory }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    company: resume.company,
    position: resume.position,
    date: resume.application_date,
    status: resume.status
  });

  const handleSave = async () => {
    try {
      // Update the application in the database
      await updateApplication(resume.id, {
        company: editData.company,
        position: editData.position,
        application_date: editData.date,
        status: editData.status
      });
      
      console.log('Successfully saved edit data:', editData);
      setIsEditing(false);
      
      // Refresh the applications list to show updated data
      window.location.reload(); // Simple refresh - in production you'd update the state
    } catch (error) {
      console.error('Error saving application changes:', error);
      // You could show a toast/error message here
    }
  };

  const handleCancel = () => {
    setEditData({
      company: resume.company,
      position: resume.position,
      date: resume.application_date,
      status: resume.status
    });
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "p-6 rounded-xl border transition-all duration-300 hover:shadow-lg",
        "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
        "border-gray-200 dark:border-gray-700",
        isEditing && "border-blue-300 dark:border-blue-600 shadow-lg shadow-blue-500/20"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center">
            {getCompanyLogo(resume.company)}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editData.position}
                  onChange={(e) => setEditData({...editData, position: e.target.value})}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border text-lg font-semibold",
                    "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600",
                    "text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  )}
                  placeholder="Position"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={editData.company}
                    onChange={(e) => setEditData({...editData, company: e.target.value})}
                    className={cn(
                      "px-3 py-2 rounded-lg border",
                      "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600",
                      "text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    )}
                    placeholder="Company"
                  />
                  <input
                    type="date"
                    value={editData.date}
                    onChange={(e) => setEditData({...editData, date: e.target.value})}
                    className={cn(
                      "px-3 py-2 rounded-lg border",
                      "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600",
                      "text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    )}
                  />
                </div>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({...editData, status: e.target.value as ApplicationHistory['status']})}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border",
                    "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600",
                    "text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  )}
                >
                  <option value="pending">Pending</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="rejected">Rejected</option>
                  <option value="offer">Offer Received</option>
                </select>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {resume.position}
                </h3>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">{resume.company}</span>
                  {resume.location && (
                    <>
                      <span>•</span>
                      <span>{resume.location}</span>
                    </>
                  )}
                  <span>•</span>
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(resume.application_date).toLocaleDateString()}</span>
                </div>
                <StatusBadge status={resume.status} />
              </>
            )}
          </div>
        </div>
        <div className="text-right">
          {resume.improvement && (
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                +{resume.improvement}%
              </span>
            </div>
          )}
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {resume.score || 0}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            Resume Score
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mt-4">
        {isEditing ? (
          <>
            <Button 
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white border-0 justify-center py-2.5"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button 
              onClick={handleCancel}
              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-0 justify-center py-2.5"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 border-0 justify-center py-2.5">
              <Upload className="w-4 h-4 mr-2" />
              New Resume
            </Button>
          </>
        ) : (
          <>
            <Button className="flex-1 justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 py-2.5">
              <Eye className="w-4 h-4 mr-2" />
              View Resume
            </Button>
            <Button className="justify-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-0 py-2.5">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button 
              onClick={() => setIsEditing(true)}
              className="justify-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-0 py-2.5"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
};

const FilterDropdown = ({ 
  value, 
  onChange, 
  options 
}: { 
  value: string, 
  onChange: (value: string) => void,
  options: { value: string, label: string }[]
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "px-4 py-2 rounded-lg border transition-all duration-300",
        "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
        "border-gray-200 dark:border-gray-700",
        "text-gray-900 dark:text-white",
        "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const History: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [applications, setApplications] = useState<ApplicationHistory[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load applications from database
  const loadApplications = async (showRefreshing = false) => {
    if (!user?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      // Get filtered applications
      const applicationsResult = await getFilteredApplications(user.id, {
        searchTerm: searchTerm || undefined,
        statusFilter: statusFilter === 'all' ? undefined : statusFilter,
        sortBy: sortBy as any
      });
      
      // Get stats
      const statsResult = await getApplicationStats(user.id);
      
      setApplications(applicationsResult);
      setStats(statsResult);
    } catch (err) {
      console.error('Error loading applications:', err);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [user?.id, searchTerm, statusFilter, sortBy]);

  // Check if we're coming from a successful analysis (new application created)
  useEffect(() => {
    if (location.state?.newApplicationCreated) {
      // Refresh the data to show the new application
      setTimeout(() => {
        loadApplications(true);
      }, 500);
    }
  }, [location.state]);

  // Manual refresh function
  const handleRefresh = () => {
    loadApplications(true);
  };

  // Show loading state
  if (loading && !refreshing) {
    return (
      <PageLayout showBackButton backTo="/dashboard" backLabel="Back">
        <div className="flex items-center justify-center min-h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading applications...</span>
        </div>
      </PageLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <PageLayout showBackButton backTo="/dashboard" backLabel="Back">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Applications
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={handleRefresh}>
            Try Again
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showBackButton backTo="/dashboard" backLabel="Back">
      <div>

        {/* Title & Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Resume History 📋
            </h2>
            <Button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-0"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Track your applications and see how your resumes performed
          </p>

          {/* Quick Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className={cn(
                "p-4 rounded-lg border text-center",
                "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
                "border-gray-200 dark:border-gray-700"
              )}>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Applications</div>
              </div>
              <div className={cn(
                "p-4 rounded-lg border text-center",
                "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
                "border-gray-200 dark:border-gray-700"
              )}>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Pending</div>
              </div>
              <div className={cn(
                "p-4 rounded-lg border text-center",
                "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
                "border-gray-200 dark:border-gray-700"
              )}>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.interviewed}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Interviewed</div>
              </div>
              <div className={cn(
                "p-4 rounded-lg border text-center",
                "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
                "border-gray-200 dark:border-gray-700"
              )}>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.offers}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Offers</div>
              </div>
              <div className={cn(
                "p-4 rounded-lg border text-center",
                "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
                "border-gray-200 dark:border-gray-700"
              )}>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.avgScore}%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Avg Score</div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies or positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300",
                "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
                "border-gray-200 dark:border-gray-700",
                "text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
                "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              )}
            />
          </div>
          
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <FilterDropdown
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'interviewed', label: 'Interviewed' },
                  { value: 'offer', label: 'Offer' },
                  { value: 'rejected', label: 'Rejected' }
                ]}
              />
            </div>
            
            <FilterDropdown
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: 'date', label: 'Sort by Date' },
                { value: 'score', label: 'Sort by Score' },
                { value: 'company', label: 'Sort by Company' }
              ]}
            />
          </div>
        </motion.div>

        {/* Resume History Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {applications.map((application, index) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <ResumeHistoryCard resume={application} />
            </motion.div>
          ))}
        </div>

        {applications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No resumes found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filters
            </p>
            <Link to="/analyze">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                <FileText className="w-4 h-4 mr-2" />
                Analyze New Resume
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
};

export default History; 