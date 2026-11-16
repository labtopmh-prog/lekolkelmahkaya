import React, { useEffect, useState } from 'react';
import {
  Bell,
  BookOpen,
  Check,
  Heart,
  LogIn,
  LogOut,
  Palette,
  Plus,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trash2,
  User as UserIcon,
  Volume2,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import type {
  Book,
  BookCategory,
  ContactMessage,
  FontSizeOption,
  Quote,
  QuoteCategory,
  RoleAssignment,
  SoftThemeId,
  UserRole,
} from '../types/library';
import { LIBRARY_MEDIA } from '../data/seedData';
import {
  BOOK_CATEGORIES,
  QUOTE_CATEGORIES,
  SOFT_THEMES,
  resolveUserRolePermissions,
  validateBookInput,
  validateQuoteInput,
} from '../utils/libraryLogic';
import {
  assignUserRole,
  createBookInLibrary,
  createQuoteInLibrary,
  deleteBookFromLibrary,
  deleteQuoteFromLibrary,
  makeSafeId,
  markContactMessageReviewed,
  seedLibraryToFirestore,
  subscribeContactMessages,
  subscribeRoles,
} from '../services/libraryService';
import { requestLibraryNotifications } from '../services/notificationsService';
import { LibraryButton } from './LibraryButton';
import { PWAInstallButton } from './PWAControls';

interface SettingsViewProps {
  theme: SoftThemeId;
  fontSize: FontSizeOption;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  isSignedIn: boolean;
  onChangeTheme: (t: SoftThemeId) => void;
  onChangeFontSize: (s: FontSizeOption) => void;
  onToggleNotifications: (enabled: boolean) => void;
  onToggleSound: (enabled: boolean) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  theme,
  fontSize,
  notificationsEnabled,
  soundEnabled,
  isSignedIn,
  onChangeTheme,
  onChangeFontSize,
  onToggleNotifications,
  onToggleSound,
}) => {
  const [notifFeedback, setNotifFeedback] = useState<string | null>(null);

  const handleNotificationToggle = async () => {
    if (notificationsEnabled) {
      onToggleNotifications(false);
      setNotifFeedback('تم إيقاف إشعارات اقتباس اليوم.');
      return;
    }
    const res = await requestLibraryNotifications();
    onToggleNotifications(res.granted);
    setNotifFeedback(res.message);
  };

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-10 space-y-10 animate-gentle-reveal">
      <div className="border-b border-[var(--border-hairline)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[var(--accent-primary)] mb-1">
            تخصيص تجربة القراءة
          </p>
          <h1 className="font-editorial text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
            الإعدادات والمظهر
          </h1>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          {isSignedIn
            ? 'تُحفظ إعداداتك تلقائيًا في حسابك وتظهر على الويب والهاتف.'
            : 'تُحفظ الإعدادات محليًا الآن، وسجّل الدخول لمزامنتها عبر جميع أجهزتك.'}
        </p>
      </div>

      {/* 1. Soft Light Theme Selector */}
      <section className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-6 md:p-8 space-y-5 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Palette className="w-5 h-5 text-[var(--accent-primary)] icon-float" aria-hidden="true" />
          <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
            سمات الألوان الفاتحة الموحدة
          </h2>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          اختر السمة اللطيفة المناسبة لذوقك؛ تُطبّق السمة المختارة على كامل صفحات المكتبة والقارئ.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOFT_THEMES.map((item) => {
            const active = theme === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeTheme(item.id)}
                aria-pressed={active}
                className={`text-right rounded-2xl p-4 border transition-all cursor-pointer flex items-start gap-3.5 ${
                  active
                    ? 'border-[var(--accent-primary)] bg-[var(--bg-surface-soft)] shadow-xs'
                    : 'border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:bg-[var(--bg-surface-soft)]/50'
                }`}
              >
                <span
                  className="w-9 h-9 rounded-xl border border-black/10 shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: item.swatchBg }}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: item.swatchAccent }}
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[var(--text-primary)]">
                      {item.name}
                    </span>
                    {active && <Check className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />}
                  </div>
                  <p className="mt-1 text-xs text-[var(--text-secondary)] leading-snug">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Reading Typography & Audio */}
      <section className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-6 md:p-8 space-y-6 shadow-xs">
        <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
          تفضيلات القراءة والصوت والإشعارات
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--border-hairline)]">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">حجم خط قارئ الكتب</p>
            <p className="text-xs text-[var(--text-secondary)]">ينطبق على قارئ الكتب في الويب والهاتف</p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-surface-soft)] self-start">
            {(
              [
                { id: 'small', label: 'صغير' },
                { id: 'medium', label: 'متوسط' },
                { id: 'large', label: 'كبير' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeFontSize(opt.id)}
                className={`px-4 py-2 rounded-lg text-xs font-medium cursor-pointer ${
                  fontSize === opt.id
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pb-5 border-b border-[var(--border-hairline)]">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-[var(--accent-primary)] icon-float" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">المؤثرات الصوتية عند تقليب الصفحات</p>
              <p className="text-xs text-[var(--text-secondary)]">صوت ورقي ناعم عند الانتقال بين الفصول</p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={soundEnabled}
            onClick={() => onToggleSound(!soundEnabled)}
            className={`min-h-[40px] px-4 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
              soundEnabled
                ? 'bg-[var(--accent-primary)] text-white'
                : 'bg-[var(--bg-surface-soft)] text-[var(--text-secondary)]'
            }`}
          >
            {soundEnabled ? 'مفعّل' : 'مكتوم'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[var(--accent-primary)] icon-float" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">إشعارات اقتباس اليوم</p>
              <p className="text-xs text-[var(--text-secondary)]">تنبيه لطيف عند تحديث اقتباس الصباح</p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={notificationsEnabled}
            onClick={handleNotificationToggle}
            className={`min-h-[40px] px-4 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
              notificationsEnabled
                ? 'bg-[var(--accent-primary)] text-white'
                : 'bg-[var(--bg-surface-soft)] text-[var(--text-secondary)]'
            }`}
          >
            {notificationsEnabled ? 'مفعّل' : 'تفعيل الإشعارات'}
          </button>
        </div>
        {notifFeedback && (
          <p className="text-xs text-[var(--accent-primary)]">{notifFeedback}</p>
        )}
      </section>

      {/* 3. Mobile Application & PWA */}
      <section className="rounded-3xl bg-[var(--bg-surface-soft)]/70 border border-[var(--border-hairline)] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <Smartphone className="w-6 h-6 text-[var(--accent-primary)] shrink-0 mt-1 icon-float" aria-hidden="true" />
          <div>
            <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
              تطبيق Android و iOS وتثبيت PWA
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)] max-w-xl leading-relaxed">
              تطبيق «كل كلمة حكاية» مهيّأ للتثبيت المباشر على الهواتف كتطبيق ويب تقدمي (PWA) كما يحتوي على حزمة Capacitor جاهزة للبناء والتوزيع على متجري Google Play وApp Store.
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <PWAInstallButton />
        </div>
      </section>
    </div>
  );
};

interface AccountViewProps {
  user: User | null;
  books: Book[];
  quotes: Quote[];
  favoriteBookIds: string[];
  favoriteQuoteIds: string[];
  readingProgress: Record<string, number>;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
  onOpenBook: (book: Book) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  user,
  books,
  quotes,
  favoriteBookIds,
  favoriteQuoteIds,
  readingProgress,
  onSignIn,
  onSignOut,
  onOpenBook,
}) => {
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const favBooks = books.filter((b) => favoriteBookIds.includes(b.id));
  const favQuotes = quotes.filter((q) => favoriteQuoteIds.includes(q.id));

  const handleLogin = async () => {
    setAuthError(null);
    setSigningIn(true);
    try {
      await onSignIn();
    } catch {
      setAuthError('لم تكتمل عملية تسجيل الدخول عبر Google. يرجى السماح بالنوافذ المنبثقة والمحاولة مجددًا.');
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-10 space-y-10 animate-gentle-reveal">
      <div className="border-b border-[var(--border-hairline)] pb-6">
        <p className="text-xs font-medium text-[var(--accent-primary)] mb-1">
          الملف الشخصي والمزامنة
        </p>
        <h1 className="font-editorial text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
          حسابي في المكتبة
        </h1>
      </div>

      {/* Account Card (Clean reader-facing profile without any exposed admin triggers) */}
      <section className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-surface-soft)] text-[var(--accent-primary)] flex items-center justify-center shrink-0">
            <UserIcon className="w-8 h-8 icon-float" aria-hidden="true" />
          </div>
          <div>
            {user ? (
              <>
                <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                  {user.displayName || 'قارئ كل كلمة حكاية'}
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {user.email} · قارئ في المكتبة
                </p>
              </>
            ) : (
              <>
                <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                  وضع القارئ الزائر
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-md">
                  سجّل الدخول بحساب Google لحفظ مفضلتك وسماتك وتقدّم قراءتك في السحابة ومزامنتها بين الويب وتطبيق الهاتف.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {user ? (
            <LibraryButton
              variant="secondary"
              size="md"
              onClick={onSignOut}
              icon={<LogOut className="w-4 h-4" aria-hidden="true" />}
            >
              تسجيل الخروج
            </LibraryButton>
          ) : (
            <LibraryButton
              variant="primary"
              size="md"
              loading={signingIn}
              onClick={handleLogin}
              icon={<LogIn className="w-4 h-4" aria-hidden="true" />}
            >
              تسجيل الدخول عبر Google
            </LibraryButton>
          )}
        </div>
      </section>

      {authError && (
        <div role="alert" className="rounded-xl bg-[#FDF2F2] border border-[#9E3B3B]/30 p-4 text-sm text-[#7D2C2C]">
          {authError}
        </div>
      )}

      {/* Favorites Books & Quotes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[var(--accent-primary)] icon-float" aria-hidden="true" />
              <span>كتبي المفضلة</span>
            </h3>
            <span className="font-mono-num text-xs text-[var(--text-muted)]">{favBooks.length}</span>
          </div>

          {favBooks.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)] py-6 text-center">
              لم تحفظ أي كتاب في مفضلتك بعد. استكشف قسم الكتب وأضف ما يروق لك.
            </p>
          ) : (
            <div className="space-y-3">
              {favBooks.map((book) => (
                <div
                  key={book.id}
                  className="rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] p-4 flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">{book.title}</h4>
                    <p className="text-xs text-[var(--text-muted)]">
                      {book.author}
                      {typeof readingProgress[book.id] === 'number'
                        ? ` · فصل ${readingProgress[book.id] + 1}`
                        : ''}
                    </p>
                  </div>
                  <LibraryButton variant="secondary" size="sm" onClick={() => onOpenBook(book)}>
                    قراءة
                  </LibraryButton>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Heart className="w-5 h-5 text-[var(--accent-primary)] icon-float" aria-hidden="true" />
              <span>كلمات محفوظة</span>
            </h3>
            <span className="font-mono-num text-xs text-[var(--text-muted)]">{favQuotes.length}</span>
          </div>

          {favQuotes.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)] py-6 text-center">
              احفظ الكلمات التي تلمس قلبك لتجدها هنا دائمًا.
            </p>
          ) : (
            <div className="space-y-3">
              {favQuotes.map((q) => (
                <div
                  key={q.id}
                  className="rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] p-4"
                >
                  <p className="font-editorial text-lg text-[var(--text-primary)]">«{q.text}»</p>
                  <p className="mt-1.5 text-xs text-[var(--text-muted)]">{q.author}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

interface AdminViewProps {
  unlocked: boolean;
  user: User | null;
  userRole: UserRole;
  books: Book[];
  quotes: Quote[];
  onLockAdmin: () => void;
  onSignInGoogle: () => Promise<void>;
  onBookCreatedLocal: (book: Book) => void;
  onQuoteCreatedLocal: (quote: Quote) => void;
  onBookDeletedLocal: (id: string) => void;
  onQuoteDeletedLocal: (id: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  unlocked,
  user,
  userRole,
  books,
  quotes,
  onLockAdmin,
  onSignInGoogle,
  onBookCreatedLocal,
  onQuoteCreatedLocal,
  onBookDeletedLocal,
  onQuoteDeletedLocal,
}) => {
  const perms = resolveUserRolePermissions(userRole);
  const hasCloudAdmin = Boolean(user && perms.canEditContent);
  const [activeTab, setActiveTab] = useState<'books' | 'quotes' | 'messages' | 'roles'>('books');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [roles, setRoles] = useState<RoleAssignment[]>([]);
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const [connectingCloud, setConnectingCloud] = useState(false);

  // Add Book Form
  const [bTitle, setBTitle] = useState('');
  const [bAuthor, setBAuthor] = useState('');
  const [bCategory, setBCategory] = useState<BookCategory>('أدب وخواطر');
  const [bSynopsis, setBSynopsis] = useState('');
  const [bMinutes, setBMinutes] = useState(12);
  const [bChapterTitle, setBChapterTitle] = useState('');
  const [bChapterContent, setBChapterContent] = useState('');
  const [bookErrors, setBookErrors] = useState<Record<string, string>>({});
  const [savingBook, setSavingBook] = useState(false);

  // Add Quote Form
  const [qText, setQText] = useState('');
  const [qAuthor, setQAuthor] = useState('');
  const [qSource, setQSource] = useState('');
  const [qCategory, setQCategory] = useState<QuoteCategory>('كلمات تلمس القلب');
  const [qMood, setQMood] = useState('طمأنينة');
  const [qDaily, setQDaily] = useState(false);
  const [quoteErrors, setQuoteErrors] = useState<Record<string, string>>({});
  const [savingQuote, setSavingQuote] = useState(false);

  // Assign Role Form (Super Admin Exclusive)
  const [rUid, setRUid] = useState('');
  const [rEmail, setREmail] = useState('');
  const [rRole, setRRole] = useState<UserRole>('assistant');
  const [rTitle, setRTitle] = useState('مساعد تحرير');

  useEffect(() => {
    if (!unlocked || !user || !perms.canEditContent) return;
    const unsubMessages = subscribeContactMessages(setMessages);
    let unsubRoles = () => {};
    if (perms.isSuperAdmin) {
      unsubRoles = subscribeRoles(setRoles);
    }
    return () => {
      unsubMessages();
      unsubRoles();
    };
  }, [unlocked, user, perms.canEditContent, perms.isSuperAdmin]);

  if (!unlocked) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-16 text-center space-y-4">
        <ShieldCheck className="w-10 h-10 text-[var(--accent-primary)] mx-auto icon-float" aria-hidden="true" />
        <h1 className="font-editorial text-3xl font-bold text-[var(--text-primary)]">
          لوحة الإدارة مقفلة
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          هذه المنطقة خاصة بمديري المكتبة فقط.
        </p>
        <LibraryButton variant="secondary" size="md" onClick={onLockAdmin}>
          العودة إلى الرئيسية
        </LibraryButton>
      </div>
    );
  }

  const handleConnectGoogle = async () => {
    setConnectingCloud(true);
    try {
      await onSignInGoogle();
      setStatusNote('تم التحقق من اتصال الحساب السحابي.');
    } catch {
      setStatusNote('تعذّر إكمال تسجيل الدخول السحابي عبر Google. يرجى السماح بالنوافذ المنبثقة.');
    } finally {
      setConnectingCloud(false);
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = validateBookInput({
      title: bTitle,
      author: bAuthor,
      synopsis: bSynopsis,
      readingMinutes: bMinutes,
      chapterTitle: bChapterTitle,
      chapterContent: bChapterContent,
    });
    setBookErrors(val.errors);
    if (!val.valid) return;

    setSavingBook(true);
    try {
      const id = makeSafeId('book');
      const newBookPayload: Omit<Book, 'createdAt' | 'updatedAt'> = {
        id,
        title: bTitle.trim(),
        author: bAuthor.trim(),
        category: bCategory,
        synopsis: bSynopsis.trim(),
        coverColor: '#FBECEF',
        coverImage: LIBRARY_MEDIA.bookArt,
        readingMinutes: Number(bMinutes),
        featured: true,
        chapters: [
          {
            id: 'ch-1',
            title: bChapterTitle.trim(),
            content: bChapterContent.trim(),
          },
        ],
        createdBy: user?.uid || 'admin-gate',
      };

      onBookCreatedLocal(newBookPayload);
      if (hasCloudAdmin) {
        await createBookInLibrary(newBookPayload);
        setStatusNote('تم نشر الكتاب في المكتبة ومزامنته على الويب والهاتف بنجاح.');
      } else {
        setStatusNote('تمت إضافة الكتاب إلى المكتبة محليًا بنجاح.');
      }
      setBTitle('');
      setBAuthor('');
      setBSynopsis('');
      setBChapterTitle('');
      setBChapterContent('');
    } finally {
      setSavingBook(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    onBookDeletedLocal(bookId);
    if (hasCloudAdmin) {
      await deleteBookFromLibrary(bookId);
    }
    setStatusNote('تم حذف الكتاب من القائمة.');
  };

  const handleAddQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = validateQuoteInput({ text: qText, author: qAuthor, mood: qMood });
    setQuoteErrors(val.errors);
    if (!val.valid) return;

    setSavingQuote(true);
    try {
      const newQuotePayload: Omit<Quote, 'createdAt' | 'updatedAt'> = {
        id: makeSafeId('quote'),
        text: qText.trim(),
        author: qAuthor.trim(),
        sourceTitle: qSource.trim(),
        category: qCategory,
        mood: qMood.trim(),
        isDailyHighlight: qDaily,
        createdBy: user?.uid || 'admin-gate',
      };

      onQuoteCreatedLocal(newQuotePayload);
      if (hasCloudAdmin) {
        await createQuoteInLibrary(newQuotePayload);
        setStatusNote('تمت إضافة الاقتباس ومزامنته مع جميع القراء.');
      } else {
        setStatusNote('تمت إضافة الاقتباس إلى المكتبة محليًا بنجاح.');
      }
      setQText('');
      setQAuthor('');
      setQSource('');
    } finally {
      setSavingQuote(false);
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    onQuoteDeletedLocal(quoteId);
    if (hasCloudAdmin) {
      await deleteQuoteFromLibrary(quoteId);
    }
    setStatusNote('تم حذف الاقتباس من القائمة.');
  };

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rUid.trim() || !rEmail.trim() || !user || !perms.isSuperAdmin) return;
    await assignUserRole({
      uid: rUid.trim(),
      email: rEmail.trim(),
      role: rRole,
      title: rTitle.trim() || 'مساعد',
      assignedBy: user.uid,
    });
    setRUid('');
    setREmail('');
    setStatusNote('تم تحديث صلاحية العضو بنجاح.');
  };

  const handleSeedCloud = async () => {
    if (!user || !perms.canEditContent) return;
    await seedLibraryToFirestore(user.uid);
    setStatusNote('تمت مزامنة الكتب والاقتباسات والفريق الأساسية إلى قاعدة بيانات Firestore.');
  };

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 space-y-8 animate-gentle-reveal">
      {/* Separate Admin Header */}
      <div className="rounded-3xl bg-[var(--bg-surface-soft)] border border-[var(--border-hairline)] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[var(--accent-primary)] mb-1">
            لوحة تحكم المديرين السرية
          </p>
          <h1 className="font-editorial text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
            إدارة محتوى «كل كلمة حكاية»
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {hasCloudAdmin ? (
            <LibraryButton variant="secondary" size="sm" onClick={handleSeedCloud}>
              مزامنة البيانات الأساسية للسحابة
            </LibraryButton>
          ) : (
            <LibraryButton
              variant="secondary"
              size="sm"
              loading={connectingCloud}
              onClick={handleConnectGoogle}
              icon={<LogIn className="w-3.5 h-3.5" aria-hidden="true" />}
            >
              ربط المزامنة السحابية (Google)
            </LibraryButton>
          )}
          <LibraryButton variant="tinted" size="sm" onClick={onLockAdmin}>
            قفل وإغلاق لوحة الإدارة
          </LibraryButton>
        </div>
      </div>

      {!hasCloudAdmin && (
        <div className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4 text-xs md:text-sm text-[var(--text-secondary)]">
          لوحة الإدارة مفتوحة محليًا الآن؛ يمكنك إضافة وحذف الكتب والاقتباسات فورًا، أو ربط حساب المدير عبر Google لحفظ التغييرات في قاعدة البيانات السحابية ومراجعتها عبر جميع الأجهزة.
        </div>
      )}

      {statusNote && (
        <div role="status" className="rounded-xl bg-[#EAF6F0] border border-[#3F7E61]/30 p-4 text-sm text-[#24553F]">
          {statusNote}
        </div>
      )}

      {/* Admin Section Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-[var(--bg-surface-soft)] w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('books')}
          className={`px-4 py-2 rounded-lg text-xs font-medium cursor-pointer ${
            activeTab === 'books' ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs' : 'text-[var(--text-secondary)]'
          }`}
        >
          الكتب ({books.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('quotes')}
          className={`px-4 py-2 rounded-lg text-xs font-medium cursor-pointer ${
            activeTab === 'quotes' ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs' : 'text-[var(--text-secondary)]'
          }`}
        >
          الاقتباسات ({quotes.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 rounded-lg text-xs font-medium cursor-pointer ${
            activeTab === 'messages' ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs' : 'text-[var(--text-secondary)]'
          }`}
        >
          رسائل القرّاء ({messages.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 rounded-lg text-xs font-medium cursor-pointer ${
            activeTab === 'roles' ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs' : 'text-[var(--text-secondary)]'
          }`}
        >
          صلاحيات المديرة العليا
        </button>
      </div>

      {/* Tab 1: Books Management */}
      {activeTab === 'books' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={handleAddBook}
            className="lg:col-span-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-6 space-y-4"
          >
            <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Plus className="w-5 h-5 text-[var(--accent-primary)] icon-float" aria-hidden="true" />
              <span>إضافة كتاب جديد</span>
            </h2>
            <div>
              <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">عنوان الكتاب</label>
              <input
                type="text"
                value={bTitle}
                onChange={(e) => setBTitle(e.target.value)}
                className="w-full min-h-[42px] px-3.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-sm"
              />
              {bookErrors.title && <p className="text-xs text-[#9E3B3B] mt-1">{bookErrors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">المؤلف</label>
                <input
                  type="text"
                  value={bAuthor}
                  onChange={(e) => setBAuthor(e.target.value)}
                  className="w-full min-h-[42px] px-3.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-sm"
                />
                {bookErrors.author && <p className="text-xs text-[#9E3B3B] mt-1">{bookErrors.author}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">التصنيف</label>
                <select
                  value={bCategory}
                  onChange={(e) => setBCategory(e.target.value as BookCategory)}
                  className="w-full min-h-[42px] px-3 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-sm"
                >
                  {BOOK_CATEGORIES.filter((c) => c !== 'الكل').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">مدة القراءة (دقائق)</label>
              <input
                type="number"
                min={1}
                max={600}
                value={bMinutes}
                onChange={(e) => setBMinutes(Number(e.target.value))}
                className="w-full min-h-[42px] px-3.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">نبذة الكتاب</label>
              <textarea
                rows={2}
                value={bSynopsis}
                onChange={(e) => setBSynopsis(e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-sm"
              />
              {bookErrors.synopsis && <p className="text-xs text-[#9E3B3B] mt-1">{bookErrors.synopsis}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">عنوان الفصل الأول</label>
              <input
                type="text"
                value={bChapterTitle}
                onChange={(e) => setBChapterTitle(e.target.value)}
                className="w-full min-h-[42px] px-3.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-sm"
              />
              {bookErrors.chapterTitle && <p className="text-xs text-[#9E3B3B] mt-1">{bookErrors.chapterTitle}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">نص الفصل الأول</label>
              <textarea
                rows={4}
                value={bChapterContent}
                onChange={(e) => setBChapterContent(e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-sm"
              />
              {bookErrors.chapterContent && <p className="text-xs text-[#9E3B3B] mt-1">{bookErrors.chapterContent}</p>}
            </div>

            <LibraryButton type="submit" variant="primary" size="md" loading={savingBook}>
              نشر الكتاب على الويب والهاتف
            </LibraryButton>
          </form>

          <div className="lg:col-span-7 space-y-3">
            {books.map((book) => (
              <div
                key={book.id}
                className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">{book.title}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{book.author} · {book.category}</p>
                </div>
                <LibraryButton
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteBook(book.id)}
                  icon={<Trash2 className="w-3.5 h-3.5" aria-hidden="true" />}
                >
                  حذف
                </LibraryButton>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Quotes Management */}
      {activeTab === 'quotes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={handleAddQuote}
            className="lg:col-span-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-6 space-y-4"
          >
            <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--accent-primary)] icon-float" aria-hidden="true" />
              <span>إضافة اقتباس أو كلمة</span>
            </h2>
            <div>
              <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">نص الكلمة</label>
              <textarea
                rows={3}
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-sm"
              />
              {quoteErrors.text && <p className="text-xs text-[#9E3B3B] mt-1">{quoteErrors.text}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">الكاتب</label>
                <input
                  type="text"
                  value={qAuthor}
                  onChange={(e) => setQAuthor(e.target.value)}
                  className="w-full min-h-[42px] px-3.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-sm"
                />
                {quoteErrors.author && <p className="text-xs text-[#9E3B3B] mt-1">{quoteErrors.author}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">القسم</label>
                <select
                  value={qCategory}
                  onChange={(e) => setQCategory(e.target.value as QuoteCategory)}
                  className="w-full min-h-[42px] px-3 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-sm"
                >
                  {QUOTE_CATEGORIES.filter((c) => c !== 'الكل').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">المصدر (اختياري)</label>
                <input
                  type="text"
                  value={qSource}
                  onChange={(e) => setQSource(e.target.value)}
                  className="w-full min-h-[42px] px-3.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">الطابع</label>
                <input
                  type="text"
                  value={qMood}
                  onChange={(e) => setQMood(e.target.value)}
                  className="w-full min-h-[42px] px-3.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-sm"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer">
              <input
                type="checkbox"
                checked={qDaily}
                onChange={(e) => setQDaily(e.target.checked)}
                className="w-4 h-4 accent-[var(--accent-primary)]"
              />
              <span>إدراج ضمن ترشيحات «اقتباس اليوم»</span>
            </label>

            <LibraryButton type="submit" variant="primary" size="md" loading={savingQuote}>
              نشر الكلمة في المكتبة
            </LibraryButton>
          </form>

          <div className="lg:col-span-7 space-y-3">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-editorial text-lg text-[var(--text-primary)]">«{quote.text}»</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{quote.author} · {quote.category}</p>
                </div>
                <LibraryButton
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteQuote(quote.id)}
                  icon={<Trash2 className="w-3.5 h-3.5" aria-hidden="true" />}
                >
                  حذف
                </LibraryButton>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Contact Messages */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-8 text-center text-sm text-[var(--text-secondary)]">
              {hasCloudAdmin
                ? 'لا توجد رسائل تواصل جديدة حاليًا.'
                : 'سجّل الدخول بحساب المدير عبر Google لعرض رسائل القرّاء المتزامنة في السحابة.'}
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {msg.name} ({msg.email}) · {msg.status === 'reviewed' ? 'تمت المراجعة' : 'رسالة جديدة'}
                  </div>
                  <h3 className="font-bold text-base text-[var(--text-primary)] mt-1">{msg.subject}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{msg.message}</p>
                </div>
                {msg.status === 'new' && (
                  <LibraryButton
                    variant="tinted"
                    size="sm"
                    onClick={() => markContactMessageReviewed(msg.id)}
                  >
                    تحديد كمقروءة
                  </LibraryButton>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Super Admin Exclusive RBAC */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={handleAssignRole}
            className="lg:col-span-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-6 space-y-4"
          >
            <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
              تعيين صلاحيات الفريق (المديرة العليا فقط)
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              تمنح ملك أحمد سامي صلاحية «مساعد» لأعضاء الفريق (مصطفى حواس، مريم طارق، حبيبة رؤوف، جوليا جاد) عبر معرف الحساب UID.
            </p>
            {!perms.isSuperAdmin && (
              <p className="text-xs text-[#9E3B3B]">
                تعديل صلاحيات السحابة يتطلب ربط حساب المديرة العليا عبر Google أولًا.
              </p>
            )}
            <div>
              <label className="block text-xs font-medium mb-1">معرف المستخدم (UID)</label>
              <input
                type="text"
                value={rUid}
                onChange={(e) => setRUid(e.target.value)}
                required
                className="w-full min-h-[42px] px-3.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={rEmail}
                onChange={(e) => setREmail(e.target.value)}
                required
                className="w-full min-h-[42px] px-3.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">الصلاحية</label>
                <select
                  value={rRole}
                  onChange={(e) => setRRole(e.target.value as UserRole)}
                  className="w-full min-h-[42px] px-3 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-sm"
                >
                  <option value="assistant">مساعد (assistant)</option>
                  <option value="super_admin">مديرة عليا (super_admin)</option>
                  <option value="reader">قارئ عادي (reader)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">المسمى</label>
                <input
                  type="text"
                  value={rTitle}
                  onChange={(e) => setRTitle(e.target.value)}
                  className="w-full min-h-[42px] px-3.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-sm"
                />
              </div>
            </div>
            <LibraryButton type="submit" variant="primary" size="md">
              حفظ الصلاحية
            </LibraryButton>
          </form>

          <div className="lg:col-span-7 space-y-3">
            {roles.map((r) => (
              <div
                key={r.uid}
                className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">{r.email}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{r.title} · {r.role}</p>
                </div>
                <span className="font-mono-num text-xs text-[var(--text-muted)]">{r.uid.slice(0, 10)}...</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
