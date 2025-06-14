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

// Ensure user profile exists, create if needed
export const ensureUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    // Try to get existing profile
    let profile = await getUserProfile(userId);
    
    // If profile doesn't exist, create it
    if (!profile) {
      console.log('📝 User profile not found, creating default profile...');
      profile = await createUserProfile(userId, {
        first_name: null,
        last_name: null,
        bio: null,
      });
      console.log('✅ Default user profile created');
    }
    
    return profile;
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    return null;
  }
};

// Simple direct save for testing bio issues
export const saveBioDirectly = async (userId: string, bio: string): Promise<boolean> => {
  try {
    console.log('🔍 DIRECT SAVE: userId:', userId);
    console.log('🔍 DIRECT SAVE: bio:', bio);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ bio: bio })
      .eq('id', userId)
      .select();

    if (error) {
      console.error('❌ DIRECT SAVE ERROR:', error);
      return false;
    }

    console.log('✅ DIRECT SAVE SUCCESS:', data);
    return true;
  } catch (error) {
    console.error('❌ DIRECT SAVE EXCEPTION:', error);
    return false;
  }
};

// Upsert function that either updates existing profile or creates new one
export const upsertUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> => {
  try {
    console.log('🔍 UPSERT DEBUG: userId:', userId);
    console.log('🔍 UPSERT DEBUG: profileData:', profileData);
    console.log('🔍 UPSERT DEBUG: bio field:', profileData.bio);
    
    // First ensure profile exists
    await ensureUserProfile(userId);
    
    // Then update it
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

    console.log('✅ UPSERT DEBUG: Updated profile:', data);
    return data;
  } catch (error) {
    console.error('Error in upsertUserProfile:', error);
    return null;
  }
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

// Track migration status to prevent multiple executions
let migrationCompleted = false;

// Utility functions for localStorage migration
export const migrateLocalStorageToDatabase = async (userId: string) => {
  // Prevent multiple migrations
  if (migrationCompleted) {
    return;
  }

  // Check if there's actually data to migrate
  const hasProfileData = localStorage.getItem('profileData');
  const hasSettingsData = localStorage.getItem('settingsData');
  
  if (!hasProfileData && !hasSettingsData) {
    migrationCompleted = true;
    return;
  }

  try {
    // Migrate profile data
    if (hasProfileData) {
      const profileData = JSON.parse(hasProfileData);
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
    if (hasSettingsData) {
      const settingsData = JSON.parse(hasSettingsData);
      await createUserSettings(userId, {
        full_name: settingsData.fullName,
        display_email: settingsData.email,
        show_password: settingsData.showPassword,
      });
    }

    // Clear localStorage after successful migration
    localStorage.removeItem('profileData');
    localStorage.removeItem('settingsData');
    
    migrationCompleted = true;
    console.log('Successfully migrated localStorage data to database');
  } catch (error) {
    console.error('Error migrating localStorage data:', error);
  }
}; 