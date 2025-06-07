import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getUserProfile, updateUserProfile, getUserSettings, updateUserSettings, migrateLocalStorageToDatabase } from '../services/userService';

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  birthDate: string;
  jobTitle: string;
  company: string;
  bio: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
}

export interface SettingsData {
  fullName: string;
  email: string;
  password: string;
  showPassword: boolean;
}

interface FormContextType {
  profileData: ProfileData;
  updateProfileData: (field: keyof ProfileData, value: string) => void;
  settingsData: SettingsData;
  updateSettingsData: (field: keyof SettingsData, value: string | boolean) => void;
  isLoading: boolean;
  saveToDatabase: () => Promise<void>;
}

const defaultProfileData: ProfileData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  birthDate: '',
  jobTitle: '',
  company: '',
  bio: '',
  website: '',
  github: '',
  linkedin: '',
  twitter: ''
};

const defaultSettingsData: SettingsData = {
  fullName: '',
  email: '',
  password: '',
  showPassword: false
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

interface FormProviderProps {
  children: React.ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfileData);
  const [settingsData, setSettingsData] = useState<SettingsData>(defaultSettingsData);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load data from database on mount
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        // Load profile data
        const profile = await getUserProfile(user.id);
        if (profile) {
          setProfileData(prev => ({
            ...prev,
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            email: user.email || '',
            phone: profile.phone || '',
            location: profile.location || '',
            birthDate: profile.birth_date || '',
            jobTitle: profile.job_title || '',
            company: profile.company || '',
            bio: profile.bio || '',
            website: profile.website || '',
            github: profile.github_username || '',
            linkedin: profile.linkedin_username || '',
            twitter: profile.twitter_username || '',
          }));
        }

        // Load settings data  
        const settings = await getUserSettings(user.id);
        if (settings) {
          setSettingsData(prev => ({
            ...prev,
            fullName: settings.full_name || '',
            email: settings.display_email || '',
            showPassword: settings.show_password || false,
          }));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  const updateProfileData = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateSettingsData = (field: keyof SettingsData, value: string | boolean) => {
    setSettingsData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveData = async () => {
    if (!user?.id) return;
    
    try {
      // Save profile data
      await updateUserProfile(user.id, {
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

      // Save settings data
      await updateUserSettings(user.id, {
        full_name: settingsData.fullName,
        display_email: settingsData.email,
        show_password: settingsData.showPassword,
      });

      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <FormContext.Provider value={{ 
      profileData, 
      updateProfileData, 
      settingsData, 
      updateSettingsData,
      isLoading,
      saveToDatabase: saveData
    }}>
      {children}
    </FormContext.Provider>
  );
};
