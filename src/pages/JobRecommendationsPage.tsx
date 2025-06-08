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
  companyLogo?: string;
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
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (score >= 80) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
    return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
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
        <div className="grid gap-6">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={cn(
                "p-6 rounded-xl border transition-all duration-300 hover:shadow-lg",
                "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Job Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span className="font-medium">{job.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{job.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-sm font-bold",
                      getMatchScoreColor(job.matchScore)
                    )}>
                      {job.matchScore}% Match
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {job.salary && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{job.salary}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Posted {job.posted}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {job.requirements.slice(0, 4).map((req, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                      >
                        {req}
                      </span>
                    ))}
                    {job.requirements.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">
                        +{job.requirements.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[200px]">
                  <Button
                    onClick={() => handleGenerateResume(job)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 font-semibold"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Generate Curated Resume
                  </Button>
                  <Button
                    onClick={() => handleApplyNow(job.linkedinUrl)}
                    className="bg-[#0077B5] hover:bg-[#005885] text-white px-6 py-3 font-semibold"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Apply Now on LinkedIn
                  </Button>
                </div>
              </div>
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