'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect
} from 'react';
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';

export type UserRole = 'USER' | 'ADMIN';

export interface CustomUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole;
}

interface AuthContextType {
  user: CustomUser | null;
  profile: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    shippingStreet: string | null;
    shippingCity: string | null;
    shippingState: string | null;
    shippingPostalCode: string | null;
    shippingCountry: string | null;
    marketingConsent: boolean;
    notifications: boolean;
  } | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  isAdmin: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<CustomUser | null>(null);
  const isLoading = status === 'loading';
  const [profileData, setProfileData] = useState<AuthContextType['profile']>(null);

  useEffect(() => {
    if (session?.user) {
      // Fetch the complete user data including role
      fetch('/api/auth/user')
        .then((res) => res.json())
        .then((data) => {
          setUser({
            id: data.id,
            name: data.name,
            email: data.email,
            image: data.image,
            role: data.role,
          });
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    } else {
      setUser(null);
    }
  }, [session]);

  useEffect(() => {
    async function fetchProfile() {
      if (session?.user?.id) {
        const response = await fetch(`/api/user/profile?userId=${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        }
      } else {
        setProfileData(null);
      }
    }
    fetchProfile();
  }, [session?.user?.id]);

  const isAdmin = user?.role === 'ADMIN';

  const signIn = async (email: string, password: string) => {
    const result = await nextAuthSignIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    await signIn(email, password);
  };

  const signOut = async () => {
    await nextAuthSignOut();
  };

  const value: AuthContextType = {
    user,
    profile: session?.user ? {
      id: session.user.id || '',
      name: session.user.name ?? null,
      email: session.user.email ?? null,
      phone: profileData?.phone ?? null,
      shippingStreet: profileData?.shippingStreet ?? null,
      shippingCity: profileData?.shippingCity ?? null,
      shippingState: profileData?.shippingState ?? null,
      shippingPostalCode: profileData?.shippingPostalCode ?? null,
      shippingCountry: profileData?.shippingCountry ?? null,
      marketingConsent: profileData?.marketingConsent ?? false,
      notifications: profileData?.notifications ?? false
    } : null,
    isLoading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    refreshProfile: async () => {
      await update();
      if (session?.user?.id) {
        const response = await fetch(`/api/user/profile?userId=${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        }
      }
    },
  };

  return (
    <AuthContext.Provider value={value}>
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