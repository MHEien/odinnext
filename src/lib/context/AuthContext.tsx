'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { Models } from 'appwrite';
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  getUserProfile,
  UserProfile,
} from '@/lib/appwrite/auth';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (user) {
      const userProfile = await getUserProfile(user.$id);
      setProfile(userProfile);
    } else {
      setProfile(null);
    }
  }, [user]);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          throw new Error('User not found');
        }
        setUser(currentUser);
        if (currentUser) {
          const userProfile = await getUserProfile(currentUser.$id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        throw new Error('User not found');
      }
      setUser(currentUser);
      if (currentUser) {
        const userProfile = await getUserProfile(currentUser.$id);
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      await signUp(email, password, name);
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        throw new Error('User not found');
      }
      setUser(currentUser);
      if (currentUser) {
        const userProfile = await getUserProfile(currentUser.$id);
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 