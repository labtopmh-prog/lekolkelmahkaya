import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  Heart,
  Home,
  Menu,
  Settings,
  Sparkles,
  User,
  Users,
  X,
  Mail,
  Info,
  Library,
} from 'lucide-react';
import type { AppPage } from '../types/library';
import { PWAInstallButton } from './PWAControls';

interface AppNavigationProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  userDisplayName: string | null;
  onReplayIntro: () => void;
}

export const AppNavigation: React.FC<AppNavigationProps> = ({
  currentPage,
  onNavigate,
  userDisplayName,
  onReplayIntro,
}) => {
  const [openMenu, setOpenMenu] = useState<'library' | 'more' | null>(null);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!openMenu) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openMenu]);

  const go = (page: AppPage) => {
    setOpenMenu(null);
    setMobileSheetOpen(false);
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLibraryActive = ['library', 'books', 'heart_words', 'daily_quote'].includes(currentPage);
  const isMoreActive = ['about', 'contact', 'settings'].includes(currentPage);

  return (
    <>
      {/* Desktop & Mobile Top Navigation Bar (Strict 3-Zone Contract) */}
      <header className="sticky top-0 z-30 bg-[var(--bg-surface)]/92 backdrop-blur-md border-b border-[var(--border-hairline)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single Text Brand Wordmark */}
          <button
            type="button"
            onClick={() => go('home')}
            className="font-editorial text-2xl font-bold text-[var(--text-primary)] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent-primary)] rounded-lg px-1"
          >
            كل كلمة حكاية
          </button>

          {/* Zone 2: Clean Single-Line Nav Links with Accessible Submenus */}
          <nav
            ref={navRef}
            aria-label="التنقل الرئيسي"
            className="hidden lg:flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]"
          >
            <button
              type="button"
              onClick={() => go('home')}
              className={`py-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                currentPage === 'home'
                  ? 'text-[var(--accent-primary)] font-semibold underline underline-offset-8'
                  : 'hover:text-[var(--text-primary)]'
              }`}
            >
              الرئيسية
            </button>

            <div className="relative">
              <button
                type="button"
                aria-expanded={openMenu === 'library'}
                onClick={() => setOpenMenu((m) => (m === 'library' ? null : 'library'))}
                className={`py-1.5 inline-flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isLibraryActive
                    ? 'text-[var(--accent-primary)] font-semibold underline underline-offset-8'
                    : 'hover:text-[var(--text-primary)]'
                }`}
              >
                <span>المكتبة</span>
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              </button>

              {openMenu === 'library' && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-lg p-2 z-40"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => go('library')}
                    className="w-full text-right px-3 py-2.5 rounded-xl text-sm text-[var(--text-primary)] hover:bg-[var(--bg-surface-soft)] flex items-center gap-2.5 cursor-pointer"
                  >
                    <Library className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
                    <span>قاعات المكتبة</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => go('books')}
                    className="w-full text-right px-3 py-2.5 rounded-xl text-sm text-[var(--text-primary)] hover:bg-[var(--bg-surface-soft)] flex items-center gap-2.5 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
                    <span>الكتب</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => go('heart_words')}
                    className="w-full text-right px-3 py-2.5 rounded-xl text-sm text-[var(--text-primary)] hover:bg-[var(--bg-surface-soft)] flex items-center gap-2.5 cursor-pointer"
                  >
                    <Heart className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
                    <span>كلمات تلمس القلب</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => go('daily_quote')}
                    className="w-full text-right px-3 py-2.5 rounded-xl text-sm text-[var(--text-primary)] hover:bg-[var(--bg-surface-soft)] flex items-center gap-2.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
                    <span>اقتباس اليوم</span>
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => go('books')}
              className={`py-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                currentPage === 'books'
                  ? 'text-[var(--accent-primary)] font-semibold underline underline-offset-8'
                  : 'hover:text-[var(--text-primary)]'
              }`}
            >
              الكتب
            </button>

            <button
              type="button"
              onClick={() => go('team')}
              className={`py-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                currentPage === 'team'
                  ? 'text-[var(--accent-primary)] font-semibold underline underline-offset-8'
                  : 'hover:text-[var(--text-primary)]'
              }`}
            >
              فريق المكتبة
            </button>

            <div className="relative">
              <button
                type="button"
                aria-expanded={openMenu === 'more'}
                onClick={() => setOpenMenu((m) => (m === 'more' ? null : 'more'))}
                className={`py-1.5 inline-flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isMoreActive
                    ? 'text-[var(--accent-primary)] font-semibold underline underline-offset-8'
                    : 'hover:text-[var(--text-primary)]'
                }`}
              >
                <span>عن المكتبة</span>
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              </button>

              {openMenu === 'more' && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-52 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-lg p-2 z-40"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => go('about')}
                    className="w-full text-right px-3 py-2.5 rounded-xl text-sm text-[var(--text-primary)] hover:bg-[var(--bg-surface-soft)] flex items-center gap-2.5 cursor-pointer"
                  >
                    <Info className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
                    <span>من نحن</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => go('contact')}
                    className="w-full text-right px-3 py-2.5 rounded-xl text-sm text-[var(--text-primary)] hover:bg-[var(--bg-surface-soft)] flex items-center gap-2.5 cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
                    <span>تواصل معنا</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => go('settings')}
                    className="w-full text-right px-3 py-2.5 rounded-xl text-sm text-[var(--text-primary)] hover:bg-[var(--bg-surface-soft)] flex items-center gap-2.5 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
                    <span>الإعدادات</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Single Primary Account Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => go('account')}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-white text-xs md:text-sm font-medium inline-flex items-center gap-2 whitespace-nowrap shrink-0 hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
            >
              <User className="w-4 h-4" aria-hidden="true" />
              <span className="max-w-[110px] truncate">
                {userDisplayName ? userDisplayName : 'حسابي'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Thumb Navigation Bar (Under 15% Viewport Height) */}
      <nav
        aria-label="تنقل الهاتف السريع"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[var(--bg-surface)]/95 backdrop-blur-md border-t border-[var(--border-hairline)]"
      >
        <div className="grid grid-cols-5 h-16 items-center">
          <button
            type="button"
            onClick={() => go('home')}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
              currentPage === 'home' ? 'text-[var(--accent-primary)] font-semibold' : 'text-[var(--text-secondary)]'
            }`}
          >
            <Home className="w-5 h-5" aria-hidden="true" />
            <span className="text-[10px]">الرئيسية</span>
          </button>

          <button
            type="button"
            onClick={() => go('books')}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
              currentPage === 'books' ? 'text-[var(--accent-primary)] font-semibold' : 'text-[var(--text-secondary)]'
            }`}
          >
            <BookOpen className="w-5 h-5" aria-hidden="true" />
            <span className="text-[10px]">الكتب</span>
          </button>

          <button
            type="button"
            onClick={() => go('heart_words')}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
              currentPage === 'heart_words' || currentPage === 'daily_quote'
                ? 'text-[var(--accent-primary)] font-semibold'
                : 'text-[var(--text-secondary)]'
            }`}
          >
            <Heart className="w-5 h-5" aria-hidden="true" />
            <span className="text-[10px]">كلمات</span>
          </button>

          <button
            type="button"
            onClick={() => go('account')}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
              currentPage === 'account' ? 'text-[var(--accent-primary)] font-semibold' : 'text-[var(--text-secondary)]'
            }`}
          >
            <User className="w-5 h-5" aria-hidden="true" />
            <span className="text-[10px]">حسابي</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileSheetOpen(true)}
            aria-label="فتح القائمة الكاملة"
            className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
              mobileSheetOpen ? 'text-[var(--accent-primary)] font-semibold' : 'text-[var(--text-secondary)]'
            }`}
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
            <span className="text-[10px]">القائمة</span>
          </button>
        </div>
      </nav>

      {/* Mobile Full Navigation Sheet */}
      {mobileSheetOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex items-end bg-[#2B241E]/35 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="قائمة أقسام المكتبة"
        >
          <div className="w-full rounded-t-3xl bg-[var(--bg-surface)] border-t border-[var(--border-hairline)] p-5 pb-8 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="w-10 h-1.5 bg-[var(--border-hairline)] rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                أقسام «كل كلمة حكاية»
              </h2>
              <button
                type="button"
                onClick={() => setMobileSheetOpen(false)}
                aria-label="إغلاق القائمة"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-surface-soft)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {(
                [
                  { id: 'home', label: 'الرئيسية', icon: Home },
                  { id: 'library', label: 'المكتبة', icon: Library },
                  { id: 'books', label: 'الكتب', icon: BookOpen },
                  { id: 'heart_words', label: 'كلمات تلمس القلب', icon: Heart },
                  { id: 'daily_quote', label: 'اقتباس اليوم', icon: Sparkles },
                  { id: 'team', label: 'فريق المكتبة', icon: Users },
                  { id: 'about', label: 'من نحن', icon: Info },
                  { id: 'contact', label: 'تواصل معنا', icon: Mail },
                  { id: 'settings', label: 'الإعدادات', icon: Settings },
                  { id: 'account', label: 'الحساب', icon: User },
                ] as const
              ).map((item) => {
                const Icon = item.icon;
                const active = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => go(item.id)}
                    className={`min-h-[48px] px-3.5 py-2.5 rounded-xl border text-right flex items-center gap-2.5 text-sm font-medium cursor-pointer ${
                      active
                        ? 'bg-[var(--bg-surface-soft)] border-[var(--accent-primary)]/40 text-[var(--accent-primary)]'
                        : 'bg-[var(--bg-canvas)] border-[var(--border-hairline)] text-[var(--text-primary)]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 icon-float" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setMobileSheetOpen(false);
                  onReplayIntro();
                }}
                className="text-xs font-medium text-[var(--accent-primary)] underline underline-offset-4 cursor-pointer"
              >
                إعادة مشاهدة الفيديو التقديمي
              </button>
              <PWAInstallButton compact />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface AppFooterProps {
  onNavigate: (page: AppPage) => void;
  onReplayIntro: () => void;
  onSecretAdminTap: () => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({
  onNavigate,
  onReplayIntro,
  onSecretAdminTap,
}) => {
  const go = (p: AppPage) => {
    onNavigate(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 pb-24 lg:pb-12 border-t border-[var(--border-hairline)] bg-[var(--bg-surface-soft)]/55">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
              كل كلمة حكاية
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] max-w-md">
              مكتبة رقمية ومنصة أدبية متكاملة تجمع بين الويب وتطبيقات الهاتف، صُممت بهوية فاتحة هادئة لتمنح كل قارئ ركنًا دافئًا للقراءة والتأمل.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onReplayIntro}
                className="text-xs font-medium text-[var(--accent-primary)] underline underline-offset-4 cursor-pointer"
              >
                إعادة تشغيل المقدمة السينمائية
              </button>
              <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
              <PWAInstallButton compact />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[var(--text-muted)] mb-3">
              أقسام المكتبة
            </h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li><button type="button" onClick={() => go('home')} className="hover:text-[var(--text-primary)] cursor-pointer">الرئيسية</button></li>
              <li><button type="button" onClick={() => go('library')} className="hover:text-[var(--text-primary)] cursor-pointer">المكتبة</button></li>
              <li><button type="button" onClick={() => go('books')} className="hover:text-[var(--text-primary)] cursor-pointer">الكتب</button></li>
              <li><button type="button" onClick={() => go('heart_words')} className="hover:text-[var(--text-primary)] cursor-pointer">كلمات تلمس القلب</button></li>
              <li><button type="button" onClick={() => go('daily_quote')} className="hover:text-[var(--text-primary)] cursor-pointer">اقتباس اليوم</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[var(--text-muted)] mb-3">
              المؤسسة والحساب
            </h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li><button type="button" onClick={() => go('team')} className="hover:text-[var(--text-primary)] cursor-pointer">فريق المكتبة</button></li>
              <li><button type="button" onClick={() => go('about')} className="hover:text-[var(--text-primary)] cursor-pointer">من نحن</button></li>
              <li><button type="button" onClick={() => go('contact')} className="hover:text-[var(--text-primary)] cursor-pointer">تواصل معنا</button></li>
              <li><button type="button" onClick={() => go('settings')} className="hover:text-[var(--text-primary)] cursor-pointer">الإعدادات</button></li>
              <li><button type="button" onClick={() => go('account')} className="hover:text-[var(--text-primary)] cursor-pointer">حسابي</button></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border-hairline)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
          <span
            onClick={onSecretAdminTap}
            data-testid="secret-admin-trigger"
            className="select-none"
          >
            © 2026 مكتبة كل كلمة حكاية — بإدارة ملك أحمد سامي وفريق المكتبة.
          </span>
          <span>تجربة متزامنة للويب وتطبيقات Android و iOS</span>
        </div>
      </div>
    </footer>
  );
};
