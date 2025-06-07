import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://nxixtigpbapxxpzjxnff.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54aXh0aWdwYmFweHhwemp4bmZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMTA4MjAsImV4cCI6MjA2NDg4NjgyMH0.ItMnyN2ut5ydnCssNObGaT6xyh6Hil4MlJ6mm2r9r74';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (we'll generate these properly later)
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
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
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          location?: string | null;
          birth_date?: string | null;
          job_title?: string | null;
          company?: string | null;
          bio?: string | null;
          website?: string | null;
          github_username?: string | null;
          linkedin_username?: string | null;
          twitter_username?: string | null;
          profile_picture_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          location?: string | null;
          birth_date?: string | null;
          job_title?: string | null;
          company?: string | null;
          bio?: string | null;
          website?: string | null;
          github_username?: string | null;
          linkedin_username?: string | null;
          twitter_username?: string | null;
          profile_picture_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      resumes: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          file_name: string | null;
          file_url: string | null;
          resume_text: string;
          file_size: number | null;
          file_type: string | null;
          optimized_content: string | null;
          template_id: string | null;
          version: number;
          is_active: boolean;
          status: 'uploaded' | 'processing' | 'optimized' | 'error';
          analysis_score: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          file_name?: string | null;
          file_url?: string | null;
          resume_text: string;
          file_size?: number | null;
          file_type?: string | null;
          optimized_content?: string | null;
          template_id?: string | null;
          version?: number;
          is_active?: boolean;
          status?: 'uploaded' | 'processing' | 'optimized' | 'error';
          analysis_score?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          file_name?: string | null;
          file_url?: string | null;
          resume_text?: string;
          file_size?: number | null;
          file_type?: string | null;
          optimized_content?: string | null;
          template_id?: string | null;
          version?: number;
          is_active?: boolean;
          status?: 'uploaded' | 'processing' | 'optimized' | 'error';
          analysis_score?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
  };
};

// Helper functions for storage
export const STORAGE_BUCKETS = {
  RESUME_FILES: 'resume-files',
  GENERATED_RESUMES: 'generated-resumes',
  PROFILE_PICTURES: 'profile-pictures',
} as const;

// Storage helper functions
export const uploadResumeFile = async (file: File, userId: string, resumeId: string) => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/${resumeId}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.RESUME_FILES)
    .upload(filePath, file);
    
  if (error) throw error;
  return data;
};

export const getResumeFileUrl = (userId: string, resumeId: string, fileExt: string) => {
  const filePath = `${userId}/${resumeId}.${fileExt}`;
  const { data } = supabase.storage
    .from(STORAGE_BUCKETS.RESUME_FILES)
    .getPublicUrl(filePath);
    
  return data.publicUrl;
};

export const uploadProfilePicture = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/avatar.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.PROFILE_PICTURES)
    .upload(filePath, file, {
      upsert: true // Replace existing avatar
    });
    
  if (error) throw error;
  return data;
};

// Auth helpers
export const getCurrentUser = () => supabase.auth.getUser();
export const signOut = () => supabase.auth.signOut(); 