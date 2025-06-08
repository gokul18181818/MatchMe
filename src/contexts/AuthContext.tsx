import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, Session, AuthError, AuthTokenResponse } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  debugAuthState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Better error message for debugging
    const error = new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Make sure the component is wrapped with <AuthProvider> and not called during HMR.'
    );
    console.error('AuthContext Error:', {
      error,
      stack: error.stack,
      component: 'useAuth hook',
      message: 'This might be caused by Hot Module Replacement (HMR) during development. Try refreshing the page.'
    });
    throw error;
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Get initial session
    const getSession = async () => {
      try {
        console.log('🔍 AUTH DEBUG: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return; // Prevent state updates if component unmounted
        
        if (error) {
          console.error('❌ AUTH ERROR: Error getting session:', error);
          setSession(null);
          setUser(null);
        } else {
          console.log('✅ AUTH DEBUG: Initial session retrieved', {
            hasSession: !!session,
            hasUser: !!session?.user,
            userEmail: session?.user?.email || 'undefined',
            userMetadata: session?.user?.user_metadata,
            accessToken: session?.access_token ? 'present' : 'missing',
            expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null
          });
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        if (!mounted) return;
        console.error('💥 AUTH ERROR: Exception in getSession:', error);
        setSession(null);
        setUser(null);
      } finally {
        if (mounted) {
          console.log('⏰ AUTH DEBUG: Setting loading to false');
          setLoading(false);
        }
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('🔄 AUTH STATE CHANGE:', event, {
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email || 'undefined',
          sessionAccessToken: session?.access_token ? 'present' : 'missing',
          currentPath: window.location.pathname
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ USER SIGNED IN:', session.user.email, 'at', window.location.pathname);
        } else if (event === 'SIGNED_OUT') {
          console.log('❌ USER SIGNED OUT at', window.location.pathname);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 TOKEN REFRESHED for:', session?.user?.email);
        } else if (event === 'INITIAL_SESSION') {
          console.log('🏁 INITIAL SESSION for:', session?.user?.email || 'no user');
        }
        
        if (loading) {
          console.log('⏰ AUTH DEBUG: Setting loading to false (from auth state change)');
          setLoading(false);
        }
      }
    );

    // Cleanup function
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || '',
          },
        },
      });
      return { error };
    } catch (error) {
      console.error('Unexpected error in signUp:', error);
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      return { error };
    } catch (error) {
      console.error('Unexpected error in signIn:', error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Unexpected error in signOut:', error);
      return { error: error as AuthError };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/choose-action`,
        },
      });
      return { error };
    } catch (error) {
      console.error('Unexpected error in signInWithGoogle:', error);
      return { error: error as AuthError };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      return { error };
    } catch (error) {
      console.error('Unexpected error in resetPassword:', error);
      return { error: error as AuthError };
    }
  };

  const debugAuthState = () => {
    console.log('🔍 AUTH STATE DEBUG:', {
      user: user ? {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata
      } : null,
      session: session ? {
        hasAccessToken: !!session.access_token,
        expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null
      } : null,
      loading
    });
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    resetPassword,
    debugAuthState,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 