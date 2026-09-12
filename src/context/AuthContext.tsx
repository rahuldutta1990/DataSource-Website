import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase.js';
import {
  syncUserProfile,
  getUserProfile,
  getUserBookmarks,
  toggleUserBookmark,
  getUserInquiries,
} from '../services/firestoreService.js';
import { UserProfile, UserBookmark, ContactEnquiry } from '../types.js';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  bookmarks: UserBookmark[];
  refreshBookmarks: () => Promise<void>;
  toggleBookmark: (item: {
    itemType: 'casestudy' | 'insight' | 'service';
    itemId: string;
    title: string;
    slug: string;
    excerpt?: string;
  }) => Promise<boolean>;
  isBookmarked: (itemType: string, itemId: string) => boolean;
  userInquiries: ContactEnquiry[];
  refreshInquiries: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<UserBookmark[]>([]);
  const [userInquiries, setUserInquiries] = useState<ContactEnquiry[]>([]);

  const loadUserData = useCallback(async (firebaseUser: User) => {
    try {
      const synchedProfile = await syncUserProfile(firebaseUser);
      setProfile(synchedProfile);

      const [userBookmarks, inquiries] = await Promise.all([
        getUserBookmarks(firebaseUser.uid),
        getUserInquiries(firebaseUser.uid),
      ]);
      setBookmarks(userBookmarks);
      setUserInquiries(inquiries);
    } catch (err) {
      console.error('Error synchronizing user profile with Firestore:', err);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await loadUserData(firebaseUser);
      } else {
        setProfile(null);
        setBookmarks([]);
        setUserInquiries([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loadUserData]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await loadUserData(result.user);
      }
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
      setBookmarks([]);
      setUserInquiries([]);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const refreshBookmarks = async () => {
    if (!user) return;
    const items = await getUserBookmarks(user.uid);
    setBookmarks(items);
  };

  const refreshInquiries = async () => {
    if (!user) return;
    const items = await getUserInquiries(user.uid);
    setUserInquiries(items);
  };

  const handleToggleBookmark = async (item: {
    itemType: 'casestudy' | 'insight' | 'service';
    itemId: string;
    title: string;
    slug: string;
    excerpt?: string;
  }): Promise<boolean> => {
    if (!user) {
      // Prompt sign in if not signed in
      await signInWithGoogle();
      return false;
    }

    const saved = await toggleUserBookmark(user.uid, item);
    await refreshBookmarks();
    return saved;
  };

  const isBookmarked = (itemType: string, itemId: string): boolean => {
    return bookmarks.some((b) => b.itemType === itemType && b.itemId === itemId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithGoogle,
        signOutUser,
        bookmarks,
        refreshBookmarks,
        toggleBookmark: handleToggleBookmark,
        isBookmarked,
        userInquiries,
        refreshInquiries,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
