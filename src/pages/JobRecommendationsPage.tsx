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
  Search
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  posted: string;
  description: string;
  requirements: string[];
  linkedinUrl: string;
  companyLogo: string;
  matchScore: number;
}

// Mock job data - in production this would come from LinkedIn API/scraping
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    type: 'Full-time',
    salary: '$180K - $250K',
    posted: '2 days ago',
    description: 'Join our team to build the next generation of cloud infrastructure...',
    requirements: ['Python', 'Go', 'Kubernetes', 'Cloud platforms'],
    linkedinUrl: 'https://www.linkedin.com/jobs/view/3756789123',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    matchScore: 95
  },
  {
    id: '2', 
    title: 'Frontend Developer',
    company: 'Meta',
    location: 'Menlo Park, CA',
    type: 'Full-time',
    salary: '$160K - $220K',
    posted: '1 day ago',
    description: 'Build beautiful, responsive user interfaces for billions of users...',
    requirements: ['React', 'TypeScript', 'GraphQL', 'Next.js'],
    linkedinUrl: 'https://www.linkedin.com/jobs/view/3756789124',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    matchScore: 92
  },
  {
    id: '3',
    title: 'Full Stack Engineer',
    company: 'Stripe',
    location: 'San Francisco, CA',
    type: 'Full-time', 
    salary: '$170K - $240K',
    posted: '3 days ago',
    description: 'Help us build the economic infrastructure for the internet...',
    requirements: ['Node.js', 'React', 'PostgreSQL', 'APIs'],
    linkedinUrl: 'https://www.linkedin.com/jobs/view/3756789125',
    companyLogo: 'https://images.ctfassets.net/fzn2n1nzq965/3AGidihOJl4nH9D1vDjM84/9540155d584be52fc54c443b6efa4ae6/stripe.svg',
    matchScore: 88
  },
  {
    id: '4',
    title: 'Software Engineer - AI/ML',
    company: 'OpenAI',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$200K - $300K', 
    posted: '1 day ago',
    description: 'Build AI systems that benefit humanity...',
    requirements: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning'],
    linkedinUrl: 'https://www.linkedin.com/jobs/view/3756789126',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
    matchScore: 90
  },
  {
    id: '5',
    title: 'Backend Engineer',
    company: 'Uber',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$150K - $200K',
    posted: '4 days ago', 
    description: 'Scale our platform to serve millions of users worldwide...',
    requirements: ['Java', 'Microservices', 'Kafka', 'Docker'],
    linkedinUrl: 'https://www.linkedin.com/jobs/view/3756789127',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png',
    matchScore: 85
  },
  {
    id: '6',
    title: 'DevOps Engineer',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    type: 'Full-time',
    salary: '$160K - $230K',
    posted: '5 days ago',
    description: 'Build and maintain the infrastructure that powers global streaming...',
    requirements: ['AWS', 'Terraform', 'Kubernetes', 'CI/CD'],
    linkedinUrl: 'https://www.linkedin.com/jobs/view/3756789128',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    matchScore: 87
  }
];

const JobRecommendationsPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');

  useEffect(() => {
    // Simulate loading jobs
    const loadJobs = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setJobs(mockJobs);
      setLoading(false);
    };
    
    loadJobs();
  }, []);

  const handleApplyNow = (linkedinUrl: string) => {
    window.open(linkedinUrl, '_blank');
  };

  const handleGenerateResume = (job: Job) => {
    // Navigate to analyze page with pre-filled job data
    navigate('/analyze', { 
      state: { 
        prefilledJob: {
          url: job.linkedinUrl,
          company: job.company,
          title: job.title,
          fromRecommendations: true
        }
      }
    });
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Finding the perfect jobs for you...
            </p>
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
            Jobs You Should Apply To
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            AI-curated job recommendations based on your profile. Click "Generate Curated Resume" to create a perfectly tailored resume for each position.
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
          </div>
        </motion.div>

        {/* Job Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">
              Found {filteredJobs.length} high-match jobs • Average match score: {Math.round(filteredJobs.reduce((acc, job) => acc + job.matchScore, 0) / filteredJobs.length)}%
            </span>
          </div>
        </motion.div>

        {/* Jobs Grid */}
        <div className="grid gap-4">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={cn(
                "group relative p-6 rounded-xl border transition-all duration-300 hover:shadow-xl hover:scale-[1.005]",
                "bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-800",
                "border-gray-200/60 dark:border-gray-700/60",
                "hover:border-blue-200 dark:hover:border-blue-600/50",
                "backdrop-blur-sm"
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
                          alt={`${job.company} logo`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const fallback = document.createElement('div');
                            fallback.className = 'w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl';
                            fallback.textContent = job.company[0];
                            e.currentTarget.parentElement!.replaceChild(fallback, e.currentTarget);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                          {job.company[0]}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1.5 group-hover:text-blue-600 transition-colors duration-300">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-base font-semibold text-gray-800 dark:text-gray-200">{job.company}</span>
                          <div className="w-1 h-1 bg-gray-400 rounded-full mx-1.5"></div>
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="text-sm">{job.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>{job.type}</span>
                          </div>
                          {job.salary && (
                            <div className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>{job.salary}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Posted {job.posted}</span>
                          </div>
                        </div>
                      </div>

                      {/* Match Score Badge */}
                      <div className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm",
                        getMatchScoreColor(job.matchScore)
                      )}>
                        {job.matchScore}% Match
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 leading-relaxed text-sm">
                      {job.description}
                    </p>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.requirements.slice(0, 5).map((req, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-blue-50/80 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-md border border-blue-200/50 dark:border-blue-700/30 font-medium"
                        >
                          {req}
                        </span>
                      ))}
                      {job.requirements.length > 5 && (
                        <span className="px-2.5 py-1 bg-gray-100/80 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                          +{job.requirements.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Section - Action Buttons */}
                <div className="flex xl:flex-col gap-2 xl:min-w-[220px]">
                  <button
                    onClick={() => handleGenerateResume(job)}
                    className={cn(
                      "group/btn flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-white transition-all duration-300",
                      "bg-gradient-to-r from-blue-500/90 to-purple-500/90 hover:from-blue-600 hover:to-purple-600",
                      "shadow-md hover:shadow-lg hover:scale-[1.02] transform",
                      "border border-blue-200/20 hover:border-blue-300/30"
                    )}
                  >
                    <Target className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                    <span className="text-xs xl:text-sm">Generate Curated Resume</span>
                  </button>
                  
                  <button
                    onClick={() => handleApplyNow(job.linkedinUrl)}
                    className={cn(
                      "group/btn flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300",
                      "bg-[#0077B5]/90 hover:bg-[#0077B5] text-white",
                      "shadow-md hover:shadow-lg hover:scale-[1.02] transform",
                      "border border-[#0077B5]/20 hover:border-[#0077B5]/40"
                    )}
                  >
                    <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
                    <span className="text-xs xl:text-sm">Apply on LinkedIn</span>
                  </button>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/3 to-purple-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or filters
            </p>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
};

export default JobRecommendationsPage; 