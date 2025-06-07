// Temporary user ID system until we implement proper authentication
// This creates a consistent UUID that persists across sessions

export const TEMP_USER_ID = '123e4567-e89b-12d3-a456-426614174000'; // Fixed UUID for development

export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const getTempUserId = (): string => {
  // Check if user ID exists in localStorage
  let userId = localStorage.getItem('temp_user_id');
  
  if (!userId) {
    // Generate a new temporary UUID
    userId = generateUUID();
    localStorage.setItem('temp_user_id', userId);
  }
  
  return userId;
};

export const clearTempUserId = (): void => {
  localStorage.removeItem('temp_user_id');
};

// For development - use a consistent UUID
export const getDevUserId = (): string => {
  return TEMP_USER_ID;
}; 