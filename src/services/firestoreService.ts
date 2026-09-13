import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '../firebase.js';
import { UserProfile, UserBookmark, ContactEnquiry } from '../types.js';

const ADMIN_EMAILS = ['admin@datasource.tech', 'shimadutta62@gmail.com', 'rd14190@gmail.com'];

/**
 * Synchronize Google Authenticated user with Firestore users collection
 */
export async function syncUserProfile(user: User): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  const isAdmin = ADMIN_EMAILS.includes(user.email || '');

  if (snap.exists()) {
    const existing = snap.data() as UserProfile;
    const updated: Partial<UserProfile> = {
      displayName: user.displayName || existing.displayName || 'Client User',
      photoURL: user.photoURL || existing.photoURL || '',
      email: user.email || existing.email,
      lastLoginAt: new Date().toISOString(),
      role: isAdmin ? 'admin' : (existing.role || 'client'),
    };
    await updateDoc(userRef, updated);
    return { ...existing, ...updated } as UserProfile;
  } else {
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Client User',
      photoURL: user.photoURL || '',
      role: isAdmin ? 'admin' : 'client',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    await setDoc(userRef, newProfile);
    return newProfile;
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Submit consultation inquiry to Firestore
 */
export async function createFirestoreInquiry(
  inquiry: Omit<ContactEnquiry, 'id' | 'createdAt' | 'status'> & {
    userId?: string;
    userEmail?: string;
  }
): Promise<string> {
  const inquiriesRef = collection(db, 'inquiries');
  const payload = {
    ...inquiry,
    status: 'new',
    createdAt: new Date().toISOString(),
    timestamp: serverTimestamp(),
  };

  const docRef = await addDoc(inquiriesRef, payload);
  return docRef.id;
}

/**
 * Fetch consultation inquiries submitted by a specific user
 */
export async function getUserInquiries(userId: string): Promise<ContactEnquiry[]> {
  try {
    const q = query(
      collection(db, 'inquiries'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<ContactEnquiry, 'id'>),
    }));
  } catch {
    // Fallback without orderBy if composite index is pending
    try {
      const q = query(
        collection(db, 'inquiries'),
        where('userId', '==', userId)
      );
      const snap = await getDocs(q);
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<ContactEnquiry, 'id'>),
      }));
      return items.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (err) {
      console.error('Error fetching user inquiries:', err);
      return [];
    }
  }
}

/**
 * User Bookmarks management
 */
export async function getUserBookmarks(userId: string): Promise<UserBookmark[]> {
  try {
    const bookmarksRef = collection(db, 'users', userId, 'bookmarks');
    const snap = await getDocs(bookmarksRef);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<UserBookmark, 'id'>),
    }));
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return [];
  }
}

export async function toggleUserBookmark(
  userId: string,
  item: {
    itemType: 'casestudy' | 'insight' | 'service';
    itemId: string;
    title: string;
    slug: string;
    excerpt?: string;
  }
): Promise<boolean> {
  const bookmarkRef = doc(db, 'users', userId, 'bookmarks', `${item.itemType}_${item.itemId}`);
  const snap = await getDoc(bookmarkRef);

  if (snap.exists()) {
    await deleteDoc(bookmarkRef);
    return false; // removed
  } else {
    const payload: Omit<UserBookmark, 'id'> = {
      userId,
      itemType: item.itemType,
      itemId: item.itemId,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || '',
      savedAt: new Date().toISOString(),
    };
    await setDoc(bookmarkRef, payload);
    return true; // saved
  }
}

export async function checkIsBookmarked(
  userId: string,
  itemType: string,
  itemId: string
): Promise<boolean> {
  try {
    const bookmarkRef = doc(db, 'users', userId, 'bookmarks', `${itemType}_${itemId}`);
    const snap = await getDoc(bookmarkRef);
    return snap.exists();
  } catch {
    return false;
  }
}
