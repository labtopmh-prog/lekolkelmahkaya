import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { signInWithPopup, signOut, type User } from 'firebase/auth';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import { SEED_BOOKS, SEED_QUOTES, SEED_TEAM } from '../data/seedData';
import type {
  Book,
  ContactMessage,
  FontSizeOption,
  Quote,
  RoleAssignment,
  SoftThemeId,
  TeamMember,
  UserProfile,
  UserRole,
} from '../types/library';

const BOOTSTRAPPED_SUPER_ADMIN_EMAIL = 'labtopmh@gmail.com';

export function makeSafeId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${rand}`;
}

export async function signInWithGoogleAccount(): Promise<User> {
  const cred = await signInWithPopup(auth, googleProvider);
  return cred.user;
}

export async function signOutAccount(): Promise<void> {
  await signOut(auth);
}

export async function ensureUserProfile(
  user: User,
  localPrefs: {
    theme: SoftThemeId;
    fontSize: FontSizeOption;
    notificationsEnabled: boolean;
    favoriteBookIds: string[];
    favoriteQuoteIds: string[];
    readingProgress: Record<string, number>;
  }
): Promise<UserProfile> {
  const path = `users/${user.uid}`;
  const ref = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    const profile: UserProfile = {
      uid: user.uid,
      displayName: user.displayName || 'قارئ كل كلمة حكاية',
      email: user.email || 'reader@library.local',
      theme: localPrefs.theme,
      fontSize: localPrefs.fontSize,
      notificationsEnabled: localPrefs.notificationsEnabled,
      favoriteBookIds: localPrefs.favoriteBookIds.slice(0, 200),
      favoriteQuoteIds: localPrefs.favoriteQuoteIds.slice(0, 200),
      readingProgress: localPrefs.readingProgress,
      updatedAt: serverTimestamp(),
    };
    await setDoc(ref, profile);
    return profile;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function syncUserProfilePatch(
  uid: string,
  fullProfile: UserProfile
): Promise<void> {
  const path = `users/${uid}`;
  try {
    await updateDoc(doc(db, 'users', uid), {
      displayName: fullProfile.displayName.slice(0, 120),
      email: fullProfile.email.slice(0, 200),
      theme: fullProfile.theme,
      fontSize: fullProfile.fontSize,
      notificationsEnabled: fullProfile.notificationsEnabled,
      favoriteBookIds: fullProfile.favoriteBookIds.slice(0, 200),
      favoriteQuoteIds: fullProfile.favoriteQuoteIds.slice(0, 200),
      readingProgress: fullProfile.readingProgress,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function resolveUserRole(user: User): Promise<UserRole> {
  if (
    user.emailVerified &&
    user.email?.toLowerCase() === BOOTSTRAPPED_SUPER_ADMIN_EMAIL
  ) {
    return 'super_admin';
  }
  const path = `roles/${user.uid}`;
  try {
    const snap = await getDoc(doc(db, 'roles', user.uid));
    if (!snap.exists()) return 'reader';
    const data = snap.data() as RoleAssignment;
    return data.role || 'reader';
  } catch {
    return 'reader';
  }
}

export function subscribeBooks(onUpdate: (books: Book[]) => void): Unsubscribe {
  const path = 'books';
  const q = query(collection(db, path), orderBy('title', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(SEED_BOOKS);
        return;
      }
      const list = snapshot.docs.map((d) => d.data() as Book);
      onUpdate(list);
    },
    (error) => {
      console.warn('Books snapshot fallback to seed:', error.message);
      onUpdate(SEED_BOOKS);
    }
  );
}

export function subscribeQuotes(onUpdate: (quotes: Quote[]) => void): Unsubscribe {
  const path = 'quotes';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(SEED_QUOTES);
        return;
      }
      onUpdate(snapshot.docs.map((d) => d.data() as Quote));
    },
    (error) => {
      console.warn('Quotes snapshot fallback to seed:', error.message);
      onUpdate(SEED_QUOTES);
    }
  );
}

export function subscribeTeam(onUpdate: (members: TeamMember[]) => void): Unsubscribe {
  const path = 'team';
  const q = query(collection(db, path), orderBy('sortOrder', 'asc'));
  const habibaSeed = SEED_TEAM.find((m) => m.id === 'habiba-raouf');
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(SEED_TEAM);
        return;
      }
      const normalized = snapshot.docs.map((d) => {
        const data = d.data() as TeamMember;
        if (
          habibaSeed &&
          (data.id === 'habib-raouf' || data.name.includes('حبيب رؤوف'))
        ) {
          return habibaSeed;
        }
        return data;
      });
      onUpdate(normalized);
    },
    (error) => {
      console.warn('Team snapshot fallback to seed:', error.message);
      onUpdate(SEED_TEAM);
    }
  );
}

export function subscribeContactMessages(
  onUpdate: (messages: ContactMessage[]) => void
): Unsubscribe {
  const path = 'contactMessages';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      onUpdate(snapshot.docs.map((d) => d.data() as ContactMessage));
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribeRoles(
  onUpdate: (roles: RoleAssignment[]) => void
): Unsubscribe {
  const path = 'roles';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      onUpdate(snapshot.docs.map((d) => d.data() as RoleAssignment));
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function createBookInLibrary(
  book: Omit<Book, 'createdAt' | 'updatedAt'>
): Promise<void> {
  const path = `books/${book.id}`;
  try {
    await setDoc(doc(db, 'books', book.id), {
      ...book,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteBookFromLibrary(bookId: string): Promise<void> {
  const path = `books/${bookId}`;
  try {
    await deleteDoc(doc(db, 'books', bookId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function createQuoteInLibrary(
  quote: Omit<Quote, 'createdAt' | 'updatedAt'>
): Promise<void> {
  const path = `quotes/${quote.id}`;
  try {
    await setDoc(doc(db, 'quotes', quote.id), {
      ...quote,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteQuoteFromLibrary(quoteId: string): Promise<void> {
  const path = `quotes/${quoteId}`;
  try {
    await deleteDoc(doc(db, 'quotes', quoteId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function seedLibraryToFirestore(adminUid: string): Promise<void> {
  for (const member of SEED_TEAM) {
    const path = `team/${member.id}`;
    try {
      await setDoc(doc(db, 'team', member.id), {
        ...member,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
  for (const book of SEED_BOOKS) {
    const path = `books/${book.id}`;
    try {
      const existing = await getDoc(doc(db, 'books', book.id));
      if (!existing.exists()) {
        await setDoc(doc(db, 'books', book.id), {
          ...book,
          createdBy: adminUid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }
  for (const quote of SEED_QUOTES) {
    const path = `quotes/${quote.id}`;
    try {
      const existing = await getDoc(doc(db, 'quotes', quote.id));
      if (!existing.exists()) {
        await setDoc(doc(db, 'quotes', quote.id), {
          ...quote,
          createdBy: adminUid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }
}

export async function submitContactMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<string> {
  const id = makeSafeId('msg');
  const path = `contactMessages/${id}`;
  try {
    await setDoc(doc(db, 'contactMessages', id), {
      id,
      name: input.name.trim().slice(0, 100),
      email: input.email.trim().slice(0, 200),
      subject: input.subject.trim().slice(0, 160),
      message: input.message.trim().slice(0, 2000),
      status: 'new',
      createdAt: serverTimestamp(),
    });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function markContactMessageReviewed(messageId: string): Promise<void> {
  const path = `contactMessages/${messageId}`;
  try {
    await updateDoc(doc(db, 'contactMessages', messageId), {
      status: 'reviewed',
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function assignUserRole(
  assignment: Omit<RoleAssignment, 'updatedAt'>
): Promise<void> {
  const path = `roles/${assignment.uid}`;
  try {
    await setDoc(doc(db, 'roles', assignment.uid), {
      ...assignment,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
