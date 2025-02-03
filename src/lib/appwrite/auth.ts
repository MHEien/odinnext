import { account, databases, DATABASES, COLLECTIONS, ID, Query } from './config';
import { Models } from 'appwrite';

export interface UserProfile extends Models.Document {
  userId: string;
  email: string;
  name: string;
  addresses: {
    shipping?: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    billing?: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
  preferences?: {
    marketing: boolean;
    notifications: boolean;
  };
}

export async function signUp(email: string, password: string, name: string) {
  try {
    // Create the account
    const user = await account.create(ID.unique(), email, password, name);

    // Create user profile in database
    await databases.createDocument(
      DATABASES.MAIN,
      COLLECTIONS.USERS,
      ID.unique(),
      {
        userId: user.$id,
        email,
        name,
        addresses: {},
        preferences: {
          marketing: true,
          notifications: true,
        },
      }
    );

    // Log in the user
    await account.createSession(email, password);

    return user;
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    return await account.createSession(email, password);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    return await account.deleteSession('current');
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  if (!process.env.APPWRITE_URL || !process.env.APPWRITE_PROJECT_ID || !process.env.APPWRITE_API_KEY) {
    return;
  }
  try {
    return await account.get();
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const profiles = await databases.listDocuments(
      DATABASES.MAIN,
      COLLECTIONS.USERS,
      [
        Query.equal('userId', userId),
        Query.limit(1),
      ]
    );

    return profiles.documents[0] as UserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, 'userId' | '$id' | '$createdAt' | '$updatedAt'>>
) {
  try {
    const profile = await getUserProfile(userId);
    if (!profile) throw new Error('Profile not found');

    return await databases.updateDocument(
      DATABASES.MAIN,
      COLLECTIONS.USERS,
      profile.$id,
      updates
    );
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export async function resetPassword(email: string) {
  try {
    return await account.createRecovery(
      email,
      `${window.location.origin}/reset-password`
    );
  } catch (error) {
    console.error('Error during password reset:', error);
    throw error;
  }
}

export async function updatePassword(
  userId: string,
  oldPassword: string,
  newPassword: string
) {
  try {
    return await account.updatePassword(newPassword, oldPassword);
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
} 