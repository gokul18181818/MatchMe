import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://nxixtigpbapxxpzjxnff.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54aXh0aWdwYmFweHhwemp4bmZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMTA4MjAsImV4cCI6MjA2NDg4NjgyMH0.ItMnyN2ut5ydnCssNObGaT6xyh6Hil4MlJ6mm2r9r74';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (updated to match current schema)
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
      job_postings: {
        Row: {
          id: string;
          user_id: string | null;
          company_name: string | null;
          job_title: string;
          job_url: string | null;
          job_description: string;
          requirements: any | null;
          scraped_content: string | null;
          keywords: any | null;
          salary_range: string | null;
          location: string | null;
          posted_date: string | null;
          created_at: string | null;
          // New compatibility fields
          title: string | null;
          company: string | null;
          description: string | null;
          benefits: any | null;
          employment_type: string | null;
          experience_level: string | null;
          remote_type: string | null;
          application_deadline: string | null;
          scraped_data: any | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          company_name?: string | null;
          job_title: string;
          job_url?: string | null;
          job_description: string;
          requirements?: any | null;
          scraped_content?: string | null;
          keywords?: any | null;
          salary_range?: string | null;
          location?: string | null;
          posted_date?: string | null;
          created_at?: string | null;
          // New compatibility fields
          title?: string | null;
          company?: string | null;
          description?: string | null;
          benefits?: any | null;
          employment_type?: string | null;
          experience_level?: string | null;
          remote_type?: string | null;
          application_deadline?: string | null;
          scraped_data?: any | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          company_name?: string | null;
          job_title?: string;
          job_url?: string | null;
          job_description?: string;
          requirements?: any | null;
          scraped_content?: string | null;
          keywords?: any | null;
          salary_range?: string | null;
          location?: string | null;
          posted_date?: string | null;
          created_at?: string | null;
          // New compatibility fields
          title?: string | null;
          company?: string | null;
          description?: string | null;
          benefits?: any | null;
          employment_type?: string | null;
          experience_level?: string | null;
          remote_type?: string | null;
          application_deadline?: string | null;
          scraped_data?: any | null;
          updated_at?: string | null;
        };
      };
      analysis_history: {
        Row: {
          id: string;
          user_id: string;
          resume_id: string | null;
          job_posting_id: string | null;
          analysis_result: any;
          match_result: any;
          session_id: string | null;
          analysis_type: string | null;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          resume_id?: string | null;
          job_posting_id?: string | null;
          analysis_result?: any;
          match_result?: any;
          session_id?: string | null;
          analysis_type?: string | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          resume_id?: string | null;
          job_posting_id?: string | null;
          analysis_result?: any;
          match_result?: any;
          session_id?: string | null;
          analysis_type?: string | null;
          status?: string | null;
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