import { supabase, uploadResumeFile, getResumeFileUrl } from '../lib/supabase';

export interface Resume {
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
}

export interface CreateResumeData {
  title: string;
  file_name?: string;
  resume_text: string;
  file_size?: number;
  file_type?: string;
  template_id?: string;
}

// Create a new resume with file upload
export const createResumeWithFile = async (
  userId: string,
  file: File,
  extractedText: string,
  title?: string
): Promise<Resume> => {
  try {
    // First create the resume record
    const { data: resume, error: insertError } = await supabase
      .from('resumes')
      .insert({
        user_id: userId,
        title: title || file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
        file_name: file.name,
        resume_text: extractedText,
        file_size: file.size,
        file_type: file.type,
        status: 'processing',
        is_active: true
      })
      .select()
      .single();

    if (insertError) throw insertError;

    try {
      // Upload file to Supabase Storage
      const uploadData = await uploadResumeFile(file, userId, resume.id);
      
      // Get the public URL for the uploaded file
      const fileExt = file.name.split('.').pop();
      const fileUrl = getResumeFileUrl(userId, resume.id, fileExt || 'pdf');

      // Update resume with file URL and mark as uploaded
      const { data: updatedResume, error: updateError } = await supabase
        .from('resumes')
        .update({
          file_url: fileUrl,
          status: 'uploaded'
        })
        .eq('id', resume.id)
        .select()
        .single();

      if (updateError) throw updateError;
      return updatedResume;

    } catch (uploadError) {
      // If file upload fails, update status to error
      await supabase
        .from('resumes')
        .update({ status: 'error' })
        .eq('id', resume.id);
      
      const errorMessage = uploadError instanceof Error ? uploadError.message : 'Unknown error';
      throw new Error(`File upload failed: ${errorMessage}`);
    }

  } catch (error) {
    console.error('Error creating resume with file:', error);
    throw new Error('Failed to create resume');
  }
};

// Create a resume from text only
export const createResumeFromText = async (
  userId: string,
  resumeText: string,
  title: string
): Promise<Resume> => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .insert({
        user_id: userId,
        title,
        resume_text: resumeText,
        status: 'uploaded',
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating resume from text:', error);
    throw new Error('Failed to create resume');
  }
};

// Get all resumes for a user
export const getUserResumes = async (userId: string): Promise<Resume[]> => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user resumes:', error);
    throw new Error('Failed to fetch resumes');
  }
};

// Get active resume for a user
export const getActiveResume = async (userId: string): Promise<Resume | null> => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .eq('status', 'uploaded')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No resume found
        return null;
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching active resume:', error);
    return null;
  }
};

// Update resume
export const updateResume = async (
  resumeId: string,
  updates: Partial<Resume>
): Promise<Resume> => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', resumeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating resume:', error);
    throw new Error('Failed to update resume');
  }
};

// Set resume as active (deactivate others)
export const setActiveResume = async (userId: string, resumeId: string): Promise<void> => {
  try {
    // First deactivate all resumes for the user
    await supabase
      .from('resumes')
      .update({ is_active: false })
      .eq('user_id', userId);

    // Then activate the selected resume
    const { error } = await supabase
      .from('resumes')
      .update({ is_active: true })
      .eq('id', resumeId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error setting active resume:', error);
    throw new Error('Failed to set active resume');
  }
};

// Delete resume (soft delete)
export const deleteResume = async (resumeId: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('resumes')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', resumeId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw new Error('Failed to delete resume');
  }
};

// Get resume by ID
export const getResumeById = async (resumeId: string, userId: string): Promise<Resume | null> => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching resume by ID:', error);
    return null;
  }
};

// Optimize resume content with AI
export const optimizeResumeContent = async (
  resumeId: string,
  userId: string,
  optimizedContent: string,
  templateId?: string
): Promise<Resume> => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .update({
        optimized_content: optimizedContent,
        template_id: templateId,
        status: 'optimized',
        updated_at: new Date().toISOString()
      })
      .eq('id', resumeId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error optimizing resume content:', error);
    throw new Error('Failed to optimize resume');
  }
};

// Update analysis score
export const updateResumeAnalysisScore = async (
  resumeId: string,
  userId: string,
  score: number
): Promise<Resume> => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .update({
        analysis_score: score,
        updated_at: new Date().toISOString()
      })
      .eq('id', resumeId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating resume analysis score:', error);
    throw new Error('Failed to update analysis score');
  }
};

// Parse and validate resume file
export const validateResumeFile = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload PDF, DOC, or DOCX files only.'
    };
  }

  if (file.name.length > 255) {
    return {
      isValid: false,
      error: 'File name is too long. Please rename your file.'
    };
  }

  return { isValid: true };
}; 