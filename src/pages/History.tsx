import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import { cn } from '../lib/utils';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';

interface ResumeHistory {
  id: string;
  company: string;
  position: string;
  date: string;
  status: 'pending' | 'interviewed' | 'rejected' | 'offer';
  score: number;
  improvement: number;
  logo: string;
}

const mockHistory: ResumeHistory[] = [
  {
    id: '1',
    company: 'Google',
    position: 'Software Engineer',
    date: '2024-01-10',
    status: 'interviewed',
    score: 92,
    improvement: 27,
    logo: '🅶'
  },
  {
    id: '2',
    company: 'Microsoft',
    position: 'Senior Developer',
    date: '2024-01-08',
    status: 'pending',
    score: 89,
    improvement: 23,
    logo: 'Ⓜ️'
  },
  {
    id: '3',
    company: 'Apple',
    position: 'iOS Developer',
    date: '2024-01-05',
    status: 'offer',
    score: 95,
    improvement: 31,
    logo: '🍎'
  },
  {
    id: '4',
    company: 'Meta',
    position: 'Product Manager',
    date: '2024-01-03',
    status: 'rejected',
    score: 78,
    improvement: 15,
    logo: 'Ⓜ️'
  },
  {
    id: '5',
    company: 'Netflix',
    position: 'Full Stack Engineer',
    date: '2023-12-28',
    status: 'interviewed',
    score: 88,
    improvement: 25,
    logo: 'Ⓝ'
  },
  {
    id: '6',
    company: 'Amazon',
    position: 'Cloud Engineer',
    date: '2023-12-25',
    status: 'pending',
    score: 85,
    improvement: 20,
    logo: '🅰️'
  }
];

const StatusBadge = ({ status }: { status: ResumeHistory['status'] }) => {
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

const ResumeHistoryCard = ({ resume }: { resume: ResumeHistory }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "p-6 rounded-xl border transition-all duration-300 hover:shadow-lg",
        "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
        "border-gray-200 dark:border-gray-700"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg font-bold">
            {resume.logo}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {resume.position}
            </h3>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
              <Building2 className="w-4 h-4" />
              <span className="font-medium">{resume.company}</span>
              <span>•</span>
              <Calendar className="w-4 h-4" />
              <span>{new Date(resume.date).toLocaleDateString()}</span>
            </div>
            <StatusBadge status={resume.status} />
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
              +{resume.improvement}%
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {resume.score}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            Resume Score
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
          <Eye className="w-4 h-4 mr-2" />
          View Resume
        </Button>
        <Button className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-0">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-0">
          <ExternalLink className="w-4 h-4" />
        </Button>
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredHistory = mockHistory
    .filter(resume => {
      const matchesSearch = resume.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resume.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || resume.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'score') {
        return b.score - a.score;
      } else if (sortBy === 'company') {
        return a.company.localeCompare(b.company);
      }
      return 0;
    });

  const stats = {
    total: mockHistory.length,
    pending: mockHistory.filter(r => r.status === 'pending').length,
    interviewed: mockHistory.filter(r => r.status === 'interviewed').length,
    offers: mockHistory.filter(r => r.status === 'offer').length,
    avgScore: Math.round(mockHistory.reduce((sum, r) => sum + r.score, 0) / mockHistory.length)
  };

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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Resume History 📋
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Track your applications and see how your resumes performed
          </p>

          {/* Quick Stats */}
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
          {filteredHistory.map((resume, index) => (
            <motion.div
              key={resume.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <ResumeHistoryCard resume={resume} />
            </motion.div>
          ))}
        </div>

        {filteredHistory.length === 0 && (
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