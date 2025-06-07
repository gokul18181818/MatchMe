import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600 dark:text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    // Save attempted location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard; 