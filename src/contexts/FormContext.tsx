import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile, getUserSettings, updateUserSettings, migrateLocalStorageToDatabase } from '../services/userService';
import { getDevUserId } from '../utils/tempUser';

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
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@email.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  birthDate: '1995-03-15',
  jobTitle: 'Software Engineer',
  company: 'Tech Corp',
  bio: 'Passionate software engineer with 5+ years of experience building scalable web applications. Love solving complex problems and learning new technologies.',
  website: 'https://johnsmith.dev',
  github: 'johnsmith',
  linkedin: 'johnsmith',
  twitter: 'johnsmith_dev'
};

const defaultSettingsData: SettingsData = {
  fullName: 'John Smith',
  email: 'john.smith@email.com',
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
  const userId = getDevUserId();

  // Load data from database on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // First migrate any localStorage data
        await migrateLocalStorageToDatabase(userId);
        
        // Load profile data
        const profile = await getUserProfile(userId);
        if (profile) {
          setProfileData({
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            email: 'john.smith@email.com', // We'll get this from auth later
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
          });
        }

        // Load settings data
        const settings = await getUserSettings(userId);
        if (settings) {
          setSettingsData({
            fullName: settings.full_name || '',
            email: settings.display_email || '',
            password: '',
            showPassword: settings.show_password || false,
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const updateProfileData = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const updateSettingsData = (field: keyof SettingsData, value: string | boolean) => {
    setSettingsData(prev => ({ ...prev, [field]: value }));
  };

  const saveToDatabase = async () => {
    try {
      // Save profile data
      await updateUserProfile(userId, {
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
      await updateUserSettings(userId, {
        full_name: settingsData.fullName,
        display_email: settingsData.email,
        show_password: settingsData.showPassword,
      });

      console.log('Data saved to database successfully');
    } catch (error) {
      console.error('Error saving data to database:', error);
    }
  };

  return (
    <FormContext.Provider value={{ 
      profileData, 
      updateProfileData, 
      settingsData, 
      updateSettingsData,
      isLoading,
      saveToDatabase
    }}>
      {children}
    </FormContext.Provider>
  );
};
