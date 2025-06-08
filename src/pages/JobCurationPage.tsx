import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ExternalLink, 
  Target, 
  MapPin, 
  Clock, 
  DollarSign,
  Building,
  Briefcase,
  Sparkles,
  Filter,
  Search,
  Loader,
  AlertCircle,
  RefreshCw,
  User
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';
import { generateBioJobRecommendations, type AIJobRecommendation } from '../services/bioJobRecommendationService';

const JobCurationPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<AIJobRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (user?.id && !hasLoaded && !loading) {
      loadJobRecommendations();
    }
  }, [user?.id]);

  const loadJobRecommendations = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError('');
    
    try {
      console.log('🚀 Loading bio-based job recommendations...');
      const recommendations = await generateBioJobRecommendations(user.id);
      setJobs(recommendations);
      setHasLoaded(true);
      console.log(`✅ Loaded ${recommendations.length} job recommendations`);
    } catch (err: any) {
      console.error('❌ Error loading job recommendations:', err);
      setError(err.message || 'Failed to load job recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyNow = (linkedinUrl: string) => {
    window.open(linkedinUrl, '_blank');
  };

  const handleGenerateResume = (job: AIJobRecommendation) => {
    // Navigate to analyze page with pre-filled job data
    navigate('/analyze', { 
      state: { 
        prefilledJob: {
          url: job.link,
          company: job.companyName,
          title: job.title,
          fromRecommendations: true
        }
      }
    });
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'all' || job.location.includes(locationFilter);
    return matchesSearch && matchesLocation;
  });

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-700 bg-emerald-50/80 dark:text-emerald-400 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-700/30';
    if (score >= 80) return 'text-blue-700 bg-blue-50/80 dark:text-blue-400 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/30';
    return 'text-amber-700 bg-amber-50/80 dark:text-amber-400 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/30';
  };

  if (loading) {
    return (
      <PageLayout showBackButton backTo="/choose-action" backLabel="Back">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <Loader className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
              <div className="absolute inset-0 h-12 w-12 mx-auto mb-4">
                <div className="animate-ping h-12 w-12 rounded-full bg-blue-500/20"></div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Analyzing Your Bio & Finding Perfect Jobs
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              AI is analyzing your bio, generating search queries, and scoring jobs from LinkedIn for the best matches...
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4" />
              <span>This may take 30-60 seconds</span>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout showBackButton backTo="/choose-action" backLabel="Back">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Unable to Load Job Recommendations
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {error}
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={loadJobRecommendations}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button 
                onClick={() => navigate('/edit-profile')}
                className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <User className="w-4 h-4 mr-2" />
                Edit Bio
              </Button>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showBackButton backTo="/choose-action" backLabel="Back">
      <div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Personalized Job Matches
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            AI-curated jobs based on your bio. Each job is scored and personalized with insights just for you.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs, companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-3 rounded-lg border",
                "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                "text-gray-900 dark:text-white placeholder-gray-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              )}
            />
          </div>
          <div className="flex gap-3">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className={cn(
                "px-4 py-3 rounded-lg border",
                "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                "text-gray-900 dark:text-white",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              )}
            >
              <option value="all">All Locations</option>
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="Remote">Remote</option>
            </select>
            <Button 
              onClick={loadJobRecommendations}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Job Stats */}
        {filteredJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">
                Found {filteredJobs.length} bio-matched jobs • Average AI score: {Math.round(filteredJobs.reduce((acc, job) => acc + job.aiScore, 0) / filteredJobs.length)}%
              </span>
            </div>
          </motion.div>
        )}

        {/* Jobs Grid - NO HOVER EFFECTS */}
        <div className="grid gap-4">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={cn(
                "p-6 rounded-xl border",
                "bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-800",
                "border-gray-200/60 dark:border-gray-700/60"
              )}
            >
              <div className="flex flex-col xl:flex-row gap-4">
                {/* Left Section - Company Logo & Info */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Company Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-lg bg-white dark:bg-gray-700/50 shadow-md border border-gray-200/50 dark:border-gray-600/50 flex items-center justify-center p-2.5">
                      {job.companyLogo ? (
                        <img 
                          src={job.companyLogo} 
                          alt={`${job.companyName} logo`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const fallback = document.createElement('div');
                            fallback.className = 'w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl';
                            fallback.textContent = job.companyName[0];
                            e.currentTarget.parentElement!.replaceChild(fallback, e.currentTarget);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                          {job.companyName[0]}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1.5">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-base font-semibold text-gray-800 dark:text-gray-200">{job.companyName}</span>
                          <div className="w-1 h-1 bg-gray-400 rounded-full mx-1.5"></div>
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="text-sm">{job.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>{job.employmentType || 'Full-time'}</span>
                          </div>
                          {job.salaryInfo && job.salaryInfo.length > 0 && (
                            <div className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>{job.salaryInfo.join(' - ')}</span>
                            </div>
                          )}
                          {job.postedAt && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Posted {job.postedAt}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Match Score Badge */}
                      <div className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm",
                        getMatchScoreColor(job.aiScore)
                      )}>
                        {job.aiScore}% Match
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 leading-relaxed text-sm">
                      {job.descriptionText?.slice(0, 200) || 'No description available'}...
                    </p>

                    {/* AI Insights */}
                    <div className="bg-purple-50/80 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-700/30 rounded-lg p-3 mb-3">
                      <h4 className="font-semibold text-purple-800 dark:text-purple-300 text-sm mb-1">🧠 AI Insights</h4>
                      <p className="text-purple-700 dark:text-purple-300 text-xs mb-2">{job.personalizedInsights}</p>
                      
                      <div className="flex flex-wrap gap-1">
                        {job.matchReasons.slice(0, 3).map((reason, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-purple-100 dark:bg-purple-800/30 text-purple-700 dark:text-purple-300 text-xs rounded"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section - Action Buttons */}
                <div className="flex xl:flex-col gap-2 xl:min-w-[220px]">
                  <button
                    onClick={() => handleGenerateResume(job)}
                    className={cn(
                      "flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-white",
                      "bg-gradient-to-r from-blue-500 to-purple-500",
                      "shadow-md border border-blue-200/20"
                    )}
                  >
                    <Target className="w-4 h-4" />
                    <span className="text-xs xl:text-sm">Generate Resume</span>
                  </button>
                  
                  <button
                    onClick={() => handleApplyNow(job.link)}
                    className={cn(
                      "flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium",
                      "bg-[#0077B5] text-white",
                      "shadow-md border border-[#0077B5]/20"
                    )}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-xs xl:text-sm">Apply on LinkedIn</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredJobs.length === 0 && !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search terms or update your bio for better matches
            </p>
            <Button 
              onClick={() => navigate('/edit-profile')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <User className="w-4 h-4 mr-2" />
              Update Bio
            </Button>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
};

export default JobCurationPage; 