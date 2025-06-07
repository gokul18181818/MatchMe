import React, { createContext, useContext, useEffect, useState } from 'react';

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
  const [profileData, setProfileData] = useState<ProfileData>(() => {
    const stored = localStorage.getItem('profileData');
    return stored ? JSON.parse(stored) as ProfileData : defaultProfileData;
  });

  const [settingsData, setSettingsData] = useState<SettingsData>(() => {
    const stored = localStorage.getItem('settingsData');
    return stored ? JSON.parse(stored) as SettingsData : defaultSettingsData;
  });

  useEffect(() => {
    localStorage.setItem('profileData', JSON.stringify(profileData));
  }, [profileData]);

  useEffect(() => {
    localStorage.setItem('settingsData', JSON.stringify(settingsData));
  }, [settingsData]);

  const updateProfileData = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const updateSettingsData = (field: keyof SettingsData, value: string | boolean) => {
    setSettingsData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormContext.Provider value={{ profileData, updateProfileData, settingsData, updateSettingsData }}>
      {children}
    </FormContext.Provider>
  );
};
