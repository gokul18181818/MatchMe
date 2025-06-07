import { supabase } from '../lib/supabase';

export type ApplicationStatus = 'pending' | 'interviewed' | 'rejected' | 'offer' | 'accepted' | 'declined';

export interface ApplicationHistory {
  id: string;
  user_id: string;
  resume_id: string | null;
  company: string;
  position: string;
  job_url: string | null;
  location: string | null;
  application_date: string;
  status: ApplicationStatus;
  score: number | null;
  improvement: number | null;
  notes: string | null;
  follow_up_date: string | null;
  interview_date: string | null;
  offer_amount: number | null;
  company_logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApplicationStats {
  total: number;
  pending: number;
  interviewed: number;
  offers: number;
  rejected: number;
  accepted: number;
  declined: number;
  avgScore: number;
}

// Get all applications for a user
export const getUserApplications = async (userId: string): Promise<ApplicationHistory[]> => {
  const { data, error } = await supabase
    .from('application_history')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('application_date', { ascending: false });

  if (error) {
    console.error('Error fetching user applications:', error);
    return [];
  }

  return data || [];
};

// Get applications with filtering and sorting
export const getFilteredApplications = async (
  userId: string,
  filters: {
    searchTerm?: string;
    statusFilter?: string;
    sortBy?: 'date' | 'score' | 'company';
  }
): Promise<ApplicationHistory[]> => {
  let query = supabase
    .from('application_history')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true);

  // Apply status filter
  if (filters.statusFilter && filters.statusFilter !== 'all') {
    query = query.eq('status', filters.statusFilter);
  }

  // Apply search filter (search in company and position)
  if (filters.searchTerm) {
    query = query.or(`company.ilike.%${filters.searchTerm}%,position.ilike.%${filters.searchTerm}%`);
  }

  // Apply sorting
  if (filters.sortBy === 'date') {
    query = query.order('application_date', { ascending: false });
  } else if (filters.sortBy === 'score') {
    query = query.order('score', { ascending: false, nullsFirst: false });
  } else if (filters.sortBy === 'company') {
    query = query.order('company', { ascending: true });
  } else {
    query = query.order('application_date', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching filtered applications:', error);
    return [];
  }

  return data || [];
};

// Get application statistics
export const getApplicationStats = async (userId: string): Promise<ApplicationStats> => {
  const applications = await getUserApplications(userId);

  const stats: ApplicationStats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    interviewed: applications.filter(app => app.status === 'interviewed').length,
    offers: applications.filter(app => app.status === 'offer').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    declined: applications.filter(app => app.status === 'declined').length,
    avgScore: applications.length > 0 
      ? Math.round(applications
          .filter(app => app.score !== null)
          .reduce((sum, app) => sum + (app.score || 0), 0) / applications.length)
      : 0
  };

  return stats;
};

// Create new application
export const createApplication = async (
  userId: string, 
  applicationData: Omit<ApplicationHistory, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<ApplicationHistory | null> => {
  const { data, error } = await supabase
    .from('application_history')
    .insert([
      {
        user_id: userId,
        ...applicationData,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating application:', error);
    return null;
  }

  return data;
};

// Update existing application
export const updateApplication = async (
  applicationId: string,
  applicationData: Partial<ApplicationHistory>
): Promise<ApplicationHistory | null> => {
  const { data, error } = await supabase
    .from('application_history')
    .update(applicationData)
    .eq('id', applicationId)
    .select()
    .single();

  if (error) {
    console.error('Error updating application:', error);
    return null;
  }

  return data;
};

// Delete application (soft delete by setting is_active to false)
export const deleteApplication = async (applicationId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('application_history')
    .update({ is_active: false })
    .eq('id', applicationId);

  if (error) {
    console.error('Error deleting application:', error);
    return false;
  }

  return true;
};

// Get recent companies for autocomplete
export const getRecentCompanies = async (userId: string, limit: number = 10): Promise<string[]> => {
  const { data, error } = await supabase
    .from('application_history')
    .select('company')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent companies:', error);
    return [];
  }

  // Remove duplicates and return company names
  const companies = data?.map(app => app.company) || [];
  return [...new Set(companies)];
};

// Migrate mock data to database
export const migrateMockApplicationData = async (userId: string) => {
  // Mock data from History.tsx
  const mockApplications = [
    {
      company: 'Google',
      position: 'Software Engineer',
      application_date: '2024-01-10',
      status: 'interviewed' as ApplicationStatus,
      score: 92,
      improvement: 27,
      location: 'Mountain View, CA',
      job_url: 'https://careers.google.com/jobs/software-engineer',
      is_active: true,
      resume_id: null,
      notes: null,
      follow_up_date: null,
      interview_date: null,
      offer_amount: null,
      company_logo_url: null,
    },
    {
      company: 'Microsoft',
      position: 'Senior Developer',
      application_date: '2024-01-08',
      status: 'pending' as ApplicationStatus,
      score: 89,
      improvement: 23,
      location: 'Seattle, WA',
      job_url: 'https://careers.microsoft.com/jobs/senior-developer',
      is_active: true,
      resume_id: null,
      notes: null,
      follow_up_date: null,
      interview_date: null,
      offer_amount: null,
      company_logo_url: null,
    },
    {
      company: 'Apple',
      position: 'iOS Developer',
      application_date: '2024-01-05',
      status: 'offer' as ApplicationStatus,
      score: 95,
      improvement: 31,
      location: 'Cupertino, CA',
      job_url: 'https://jobs.apple.com/ios-developer',
      is_active: true,
      resume_id: null,
      notes: null,
      follow_up_date: null,
      interview_date: null,
      offer_amount: null,
      company_logo_url: null,
    },
    {
      company: 'Meta',
      position: 'Product Manager',
      application_date: '2024-01-03',
      status: 'rejected' as ApplicationStatus,
      score: 78,
      improvement: 15,
      location: 'Menlo Park, CA',
      job_url: 'https://www.metacareers.com/product-manager',
      is_active: true,
      resume_id: null,
      notes: null,
      follow_up_date: null,
      interview_date: null,
      offer_amount: null,
      company_logo_url: null,
    },
    {
      company: 'Netflix',
      position: 'Full Stack Engineer',
      application_date: '2023-12-28',
      status: 'interviewed' as ApplicationStatus,
      score: 88,
      improvement: 25,
      location: 'Los Gatos, CA',
      job_url: 'https://jobs.netflix.com/full-stack-engineer',
      is_active: true,
      resume_id: null,
      notes: null,
      follow_up_date: null,
      interview_date: null,
      offer_amount: null,
      company_logo_url: null,
    },
    {
      company: 'Amazon',
      position: 'Cloud Engineer',
      application_date: '2023-12-25',
      status: 'pending' as ApplicationStatus,
      score: 85,
      improvement: 20,
      location: 'Seattle, WA',
      job_url: 'https://amazon.jobs/cloud-engineer',
      is_active: true,
      resume_id: null,
      notes: null,
      follow_up_date: null,
      interview_date: null,
      offer_amount: null,
      company_logo_url: null,
    }
  ];

  try {
    for (const appData of mockApplications) {
      await createApplication(userId, appData);
    }
    console.log('Successfully migrated mock application data to database');
  } catch (error) {
    console.error('Error migrating mock application data:', error);
  }
}; 