import { supabase } from '../lib/supabase';

// Types matching our database structure
export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  location: string | null;
  birth_date: string | null;
  job_title: string | null;
  company: string | null;
  bio: string | null;
  website: string | null;
  github_username: string | null;
  linkedin_username: string | null;
  twitter_username: string | null;
  profile_picture_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface UserSettings {
  id: string;
  user_id: string;
  full_name: string | null;
  display_email: string | null;
  show_password: boolean;
  theme: 'light' | 'dark';
  email_notifications: boolean;
  analysis_reminders: boolean;
  privacy_level: 'public' | 'private';
  default_template: string | null;
  dashboard_layout: 'compact' | 'detailed';
  show_stats_trends: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  default_history_sort: 'date' | 'score' | 'company';
  default_status_filter: string;
  saved_search_queries: string[];
  recent_companies: string[];
  pinned_actions: string[];
  hidden_stats: string[];
  items_per_page: number;
  compact_mode: boolean;
  show_tooltips: boolean;
  auto_save_drafts: boolean;
  preferred_template_order: string[];
  default_analysis_options: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

// User Profile Operations
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
};

export const createUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([
      {
        id: userId,
        ...profileData,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating user profile:', error);
    return null;
  }

  return data;
};

export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(profileData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }

  return data;
};

// User Settings Operations
export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No settings found, create default ones
      return await createUserSettings(userId, {});
    }
    console.error('Error fetching user settings:', error);
    return null;
  }

  return data;
};

export const createUserSettings = async (userId: string, settingsData: Partial<UserSettings>): Promise<UserSettings | null> => {
  const { data, error } = await supabase
    .from('user_settings')
    .insert([
      {
        user_id: userId,
        ...settingsData,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating user settings:', error);
    return null;
  }

  return data;
};

export const updateUserSettings = async (userId: string, settingsData: Partial<UserSettings>): Promise<UserSettings | null> => {
  const { data, error } = await supabase
    .from('user_settings')
    .update(settingsData)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user settings:', error);
    return null;
  }

  return data;
};

// User Preferences Operations
export const getUserPreferences = async (userId: string): Promise<UserPreferences | null> => {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No preferences found, create default ones
      return await createUserPreferences(userId, {});
    }
    console.error('Error fetching user preferences:', error);
    return null;
  }

  return data;
};

export const createUserPreferences = async (userId: string, preferencesData: Partial<UserPreferences>): Promise<UserPreferences | null> => {
  const { data, error } = await supabase
    .from('user_preferences')
    .insert([
      {
        user_id: userId,
        ...preferencesData,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating user preferences:', error);
    return null;
  }

  return data;
};

export const updateUserPreferences = async (userId: string, preferencesData: Partial<UserPreferences>): Promise<UserPreferences | null> => {
  const { data, error } = await supabase
    .from('user_preferences')
    .update(preferencesData)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user preferences:', error);
    return null;
  }

  return data;
};

// Utility functions for localStorage migration
export const migrateLocalStorageToDatabase = async (userId: string) => {
  try {
    // Migrate profile data
    const storedProfileData = localStorage.getItem('profileData');
    if (storedProfileData) {
      const profileData = JSON.parse(storedProfileData);
      await createUserProfile(userId, {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        phone: profileData.phone,
        location: profileData.location,
        birth_date: profileData.birthDate,
        job_title: profileData.jobTitle,
        company: profileData.company,
        bio: profileData.bio,
        website: profileData.website,
        github_username: profileData.github,
        linkedin_username: profileData.linkedin,
        twitter_username: profileData.twitter,
      });
    }

    // Migrate settings data
    const storedSettingsData = localStorage.getItem('settingsData');
    if (storedSettingsData) {
      const settingsData = JSON.parse(storedSettingsData);
      await createUserSettings(userId, {
        full_name: settingsData.fullName,
        display_email: settingsData.email,
        show_password: settingsData.showPassword,
      });
    }

    // Clear localStorage after successful migration
    localStorage.removeItem('profileData');
    localStorage.removeItem('settingsData');
    
    console.log('Successfully migrated localStorage data to database');
  } catch (error) {
    console.error('Error migrating localStorage data:', error);
  }
}; 