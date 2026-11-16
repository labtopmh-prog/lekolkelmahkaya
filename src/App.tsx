import { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, testFirestoreConnection } from './firebase';
import { SEED_BOOKS, SEED_QUOTES, SEED_TEAM } from './data/seedData';
import {
  ensureUserProfile,
  resolveUserRole,
  signInWithGoogleAccount,
  signOutAccount,
  subscribeBooks,
  subscribeQuotes,
  subscribeTeam,
  syncUserProfilePatch,
} from './services/libraryService';
import type {
  AppPage,
  Book,
  FontSizeOption,
  Quote,
  SoftThemeId,
  TeamMember,
  UserProfile,
  UserRole,
} from './types/library';
import { CinematicIntro } from './components/CinematicIntro';
import { PageTurnTransition } from './components/PageTurnTransition';
import { AppFooter, AppNavigation } from './components/AppNavigation';
import { BookReaderModal } from './components/BookReaderModal';
import { HomeView, LibraryOverviewView } from './components/HomeAndLibraryViews';
import { BooksCatalogView, QuotesAndHeartView } from './components/BooksAndQuotesViews';
import { AboutView, ContactView, TeamView } from './components/TeamAboutContactViews';
import {
  AccountView,
  AdminView,
  SettingsView,
} from './components/SettingsAccountAdminViews';
import { AdminPasscodeModal } from './components/AdminPasscodeModal';
import { OfflineIndicator } from './components/PWAControls';
import { processSecretTap } from './utils/libraryLogic';

const STORAGE_KEY = 'kol_kalima_prefs_v1';

interface LocalPrefs {
  theme: SoftThemeId;
  fontSize: FontSizeOption;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  favoriteBookIds: string[];
  favoriteQuoteIds: string[];
  readingProgress: Record<string, number>;
}

function loadLocalPrefs(): LocalPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as LocalPrefs;
    }
  } catch {
    // ignore storage parse failure
  }
  return {
    theme: 'cream',
    fontSize: 'medium',
    notificationsEnabled: false,
    soundEnabled: false,
    favoriteBookIds: [],
    favoriteQuoteIds: [],
    readingProgress: {},
  };
}

export default function App() {
  const initialAutostart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  const [stage, setStage] = useState<'intro' | 'transitioning' | 'library'>(
    initialAutostart ? 'library' : 'intro'
  );
  const [currentPage, setCurrentPage] = useState<AppPage>('home');

  const [prefs, setPrefs] = useState<LocalPrefs>(loadLocalPrefs);
  const [books, setBooks] = useState<Book[]>(SEED_BOOKS);
  const [quotes, setQuotes] = useState<Quote[]>(SEED_QUOTES);
  const [team, setTeam] = useState<TeamMember[]>(SEED_TEAM);
  const [activeBook, setActiveBook] = useState<Book | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('reader');

  // Hidden Admin Gate (opens strictly after 6 taps within 5s + password verification)
  const [secretTapTimestamps, setSecretTapTimestamps] = useState<number[]>([]);
  const [showAdminGate, setShowAdminGate] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  // Sync theme attribute to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', prefs.theme);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // ignore storage quota errors
    }
  }, [prefs]);

  // Boot Firestore connection check & public content listeners
  useEffect(() => {
    testFirestoreConnection();
    const unsubBooks = subscribeBooks(setBooks);
    const unsubQuotes = subscribeQuotes(setQuotes);
    const unsubTeam = subscribeTeam(setTeam);

    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setUserRole('reader');
        return;
      }
      const role = await resolveUserRole(firebaseUser);
      setUserRole(role);

      try {
        const cloudProfile = await ensureUserProfile(firebaseUser, {
          theme: prefs.theme,
          fontSize: prefs.fontSize,
          notificationsEnabled: prefs.notificationsEnabled,
          favoriteBookIds: prefs.favoriteBookIds,
          favoriteQuoteIds: prefs.favoriteQuoteIds,
          readingProgress: prefs.readingProgress,
        });
        setPrefs((prev) => ({
          ...prev,
          theme: cloudProfile.theme || prev.theme,
          fontSize: cloudProfile.fontSize || prev.fontSize,
          notificationsEnabled:
            typeof cloudProfile.notificationsEnabled === 'boolean'
              ? cloudProfile.notificationsEnabled
              : prev.notificationsEnabled,
          favoriteBookIds:
            cloudProfile.favoriteBookIds?.length > 0
              ? cloudProfile.favoriteBookIds
              : prev.favoriteBookIds,
          favoriteQuoteIds:
            cloudProfile.favoriteQuoteIds?.length > 0
              ? cloudProfile.favoriteQuoteIds
              : prev.favoriteQuoteIds,
          readingProgress: {
            ...prev.readingProgress,
            ...(cloudProfile.readingProgress || {}),
          },
        }));
      } catch {
        // Error already logged by handleFirestoreError
      }
    });

    return () => {
      unsubBooks();
      unsubQuotes();
      unsubTeam();
      unsubAuth();
    };
  }, []);

  const persistPrefs = useCallback(
    (updater: (prev: LocalPrefs) => LocalPrefs) => {
      setPrefs((prev) => {
        const next = updater(prev);
        if (user) {
          const payload: UserProfile = {
            uid: user.uid,
            displayName: user.displayName || 'قارئ كل كلمة حكاية',
            email: user.email || 'reader@library.local',
            theme: next.theme,
            fontSize: next.fontSize,
            notificationsEnabled: next.notificationsEnabled,
            favoriteBookIds: next.favoriteBookIds,
            favoriteQuoteIds: next.favoriteQuoteIds,
            readingProgress: next.readingProgress,
          };
          syncUserProfilePatch(user.uid, payload).catch(() => {});
        }
        return next;
      });
    },
    [user]
  );

  const toggleFavoriteBook = (bookId: string) => {
    persistPrefs((prev) => {
      const exists = prev.favoriteBookIds.includes(bookId);
      return {
        ...prev,
        favoriteBookIds: exists
          ? prev.favoriteBookIds.filter((id) => id !== bookId)
          : [...prev.favoriteBookIds, bookId],
      };
    });
  };

  const toggleFavoriteQuote = (quoteId: string) => {
    persistPrefs((prev) => {
      const exists = prev.favoriteQuoteIds.includes(quoteId);
      return {
        ...prev,
        favoriteQuoteIds: exists
          ? prev.favoriteQuoteIds.filter((id) => id !== quoteId)
          : [...prev.favoriteQuoteIds, quoteId],
      };
    });
  };

  const saveReadingProgress = (bookId: string, chapterIndex: number) => {
    persistPrefs((prev) => ({
      ...prev,
      readingProgress: {
        ...prev.readingProgress,
        [bookId]: chapterIndex,
      },
    }));
  };

  const handleTransitionComplete = useCallback(() => {
    setStage('library');
    setCurrentPage('home');
    window.scrollTo({ top: 0 });
  }, []);

  const handleSecretAdminTap = useCallback(() => {
    setSecretTapTimestamps((prev) => {
      const res = processSecretTap(prev, Date.now(), 5000, 6);
      if (res.triggered) {
        if (isAdminUnlocked) {
          setCurrentPage('admin');
        } else {
          setShowAdminGate(true);
        }
      }
      return res.nextTimestamps;
    });
  }, [isAdminUnlocked]);

  if (stage === 'intro') {
    return (
      <>
        <CinematicIntro
          onEnterLibrary={() => setStage('transitioning')}
          onSkip={() => {
            setStage('library');
            setCurrentPage('home');
          }}
        />
        <OfflineIndicator />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <PageTurnTransition
        active={stage === 'transitioning'}
        onComplete={handleTransitionComplete}
      />

      <AppNavigation
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        userDisplayName={user?.displayName || null}
        onReplayIntro={() => setStage('intro')}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomeView
            books={books}
            quotes={quotes}
            team={team}
            favoriteBookIds={prefs.favoriteBookIds}
            onNavigate={setCurrentPage}
            onOpenBook={setActiveBook}
            onToggleFavoriteBook={toggleFavoriteBook}
            onReplayIntro={() => setStage('intro')}
          />
        )}

        {currentPage === 'library' && (
          <LibraryOverviewView
            booksCount={books.length}
            quotesCount={quotes.length}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'books' && (
          <BooksCatalogView
            books={books}
            favoriteBookIds={prefs.favoriteBookIds}
            readingProgress={prefs.readingProgress}
            onOpenBook={setActiveBook}
            onToggleFavoriteBook={toggleFavoriteBook}
          />
        )}

        {(currentPage === 'heart_words' || currentPage === 'daily_quote') && (
          <QuotesAndHeartView
            mode={currentPage}
            quotes={quotes}
            favoriteQuoteIds={prefs.favoriteQuoteIds}
            onToggleFavoriteQuote={toggleFavoriteQuote}
          />
        )}

        {currentPage === 'team' && <TeamView team={team} />}
        {currentPage === 'about' && <AboutView />}
        {currentPage === 'contact' && <ContactView />}

        {currentPage === 'settings' && (
          <SettingsView
            theme={prefs.theme}
            fontSize={prefs.fontSize}
            notificationsEnabled={prefs.notificationsEnabled}
            soundEnabled={prefs.soundEnabled}
            isSignedIn={!!user}
            onChangeTheme={(theme) => persistPrefs((p) => ({ ...p, theme }))}
            onChangeFontSize={(fontSize) => persistPrefs((p) => ({ ...p, fontSize }))}
            onToggleNotifications={(notificationsEnabled) =>
              persistPrefs((p) => ({ ...p, notificationsEnabled }))
            }
            onToggleSound={(soundEnabled) =>
              persistPrefs((p) => ({ ...p, soundEnabled }))
            }
          />
        )}

        {currentPage === 'account' && (
          <AccountView
            user={user}
            books={books}
            quotes={quotes}
            favoriteBookIds={prefs.favoriteBookIds}
            favoriteQuoteIds={prefs.favoriteQuoteIds}
            readingProgress={prefs.readingProgress}
            onSignIn={async () => {
              await signInWithGoogleAccount();
            }}
            onSignOut={async () => {
              await signOutAccount();
            }}
            onOpenBook={setActiveBook}
          />
        )}

        {currentPage === 'admin' && isAdminUnlocked && (
          <AdminView
            unlocked={isAdminUnlocked}
            user={user}
            userRole={userRole}
            books={books}
            quotes={quotes}
            onLockAdmin={() => {
              setIsAdminUnlocked(false);
              setCurrentPage('home');
            }}
            onSignInGoogle={async () => {
              await signInWithGoogleAccount();
            }}
            onBookCreatedLocal={(newBook) =>
              setBooks((prev) => [newBook, ...prev.filter((b) => b.id !== newBook.id)])
            }
            onQuoteCreatedLocal={(newQuote) =>
              setQuotes((prev) => [newQuote, ...prev.filter((q) => q.id !== newQuote.id)])
            }
            onBookDeletedLocal={(bookId) =>
              setBooks((prev) => prev.filter((b) => b.id !== bookId))
            }
            onQuoteDeletedLocal={(quoteId) =>
              setQuotes((prev) => prev.filter((q) => q.id !== quoteId))
            }
          />
        )}
      </main>

      <AppFooter
        onNavigate={setCurrentPage}
        onReplayIntro={() => setStage('intro')}
        onSecretAdminTap={handleSecretAdminTap}
      />

      {activeBook && (
        <BookReaderModal
          book={activeBook}
          initialChapterIndex={prefs.readingProgress[activeBook.id] || 0}
          fontSize={prefs.fontSize}
          soundEnabled={prefs.soundEnabled}
          isFavorite={prefs.favoriteBookIds.includes(activeBook.id)}
          onToggleFavorite={toggleFavoriteBook}
          onChangeFontSize={(fontSize) => persistPrefs((p) => ({ ...p, fontSize }))}
          onSaveProgress={saveReadingProgress}
          onClose={() => setActiveBook(null)}
        />
      )}

      <AdminPasscodeModal
        open={showAdminGate}
        onClose={() => setShowAdminGate(false)}
        onUnlock={() => {
          setShowAdminGate(false);
          setIsAdminUnlocked(true);
          setCurrentPage('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <OfflineIndicator />
    </div>
  );
}
