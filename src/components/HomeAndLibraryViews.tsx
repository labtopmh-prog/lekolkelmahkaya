import React from 'react';
import {
  ArrowLeft,
  BookOpen,
  Film,
  Heart,
  Smartphone,
  Sparkles,
  Users,
} from 'lucide-react';
import type { AppPage, Book, Quote, TeamMember } from '../types/library';
import { LIBRARY_MEDIA } from '../data/seedData';
import { getDailyQuote } from '../utils/libraryLogic';
import { EditorialImage } from './EditorialImage';
import { LibraryButton } from './LibraryButton';

interface HomeViewProps {
  books: Book[];
  quotes: Quote[];
  team: TeamMember[];
  favoriteBookIds: string[];
  onNavigate: (page: AppPage) => void;
  onOpenBook: (book: Book) => void;
  onToggleFavoriteBook: (bookId: string) => void;
  onReplayIntro: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  books,
  quotes,
  team,
  favoriteBookIds,
  onNavigate,
  onOpenBook,
  onToggleFavoriteBook,
  onReplayIntro,
}) => {
  const dailyQuote = getDailyQuote(quotes);
  const featuredBooks = books.filter((b) => b.featured).slice(0, 3);
  const showcaseBooks = featuredBooks.length > 0 ? featuredBooks : books.slice(0, 3);

  return (
    <div className="space-y-16 md:space-y-24">
      {/* 1. Editorial Hero Split */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-8 md:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center animate-gentle-reveal">
            <p className="text-xs md:text-sm font-medium text-[var(--accent-primary)] mb-3">
              مرحبًا بك في رحاب المكتبة الرقمية · الويب والهاتف
            </p>
            <h1 className="font-editorial text-4xl md:text-6xl font-bold text-[var(--text-primary)] leading-tight text-balance">
              كل كلمة حكاية
            </h1>
            <p className="mt-5 text-base md:text-lg leading-relaxed text-[var(--text-secondary)] max-w-xl">
              ملاذٌ مضيء للأدب الرفيع، والكتب التفاعلية، والكلمات التي تلمس القلب. اقرأ بهدوء على حاسوبك أو هاتفك مع مزامنة فورية لمكتبتك المفضلة وألوانك الهادئة.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3">
              <LibraryButton
                variant="primary"
                size="md"
                onClick={() => onNavigate('books')}
                icon={<BookOpen className="w-4 h-4 icon-float" aria-hidden="true" />}
                className="w-full sm:w-auto"
              >
                استكشف الكتب
              </LibraryButton>
              <LibraryButton
                variant="secondary"
                size="md"
                onClick={onReplayIntro}
                icon={<Film className="w-4 h-4 icon-float" aria-hidden="true" />}
                className="w-full sm:w-auto"
              >
                الفيلم التقديمي
              </LibraryButton>
            </div>
          </div>

          <div className="lg:col-span-6 animate-gentle-reveal" style={{ animationDelay: '120ms' }}>
            <div className="h-full min-h-[280px] lg:min-h-[420px] rounded-3xl overflow-hidden border border-[var(--border-hairline)] bg-[var(--bg-surface)] shadow-sm">
              <EditorialImage
                src={LIBRARY_MEDIA.interior}
                alt="قاعة مكتبة كل كلمة حكاية المضيئة بأشعة الصباح"
                fallbackTitle="مكتبة كل كلمة حكاية"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Daily Quote Spotlight */}
      {dailyQuote && (
        <section className="max-w-5xl mx-auto px-5 md:px-8 animate-gentle-reveal" style={{ animationDelay: '180ms' }}>
          <div className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-6 py-10 md:px-14 md:py-12 text-center shadow-xs">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[var(--accent-primary)] mb-4">
              <Sparkles className="w-4 h-4 icon-float" aria-hidden="true" />
              <span>اقتباس اليوم · {dailyQuote.mood}</span>
            </div>
            <blockquote className="font-editorial text-2xl md:text-4xl leading-relaxed text-[var(--text-primary)] max-w-3xl mx-auto">
              «{dailyQuote.text}»
            </blockquote>
            <p className="mt-5 text-sm text-[var(--text-secondary)]">
              {dailyQuote.author}
              {dailyQuote.sourceTitle ? ` · ${dailyQuote.sourceTitle}` : ''}
            </p>
            <div className="mt-7 flex justify-center">
              <LibraryButton
                variant="tinted"
                size="sm"
                onClick={() => onNavigate('daily_quote')}
                icon={<ArrowLeft className="w-4 h-4" aria-hidden="true" />}
              >
                صفحة اقتباس اليوم
              </LibraryButton>
            </div>
          </div>
        </section>
      )}

      {/* 3. Featured Books */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 animate-gentle-reveal" style={{ animationDelay: '240ms' }}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-medium text-[var(--accent-primary)] mb-1">
              مختارات القراءة الهادئة
            </p>
            <h2 className="font-editorial text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
              إصدارات مميزة من المكتبة
            </h2>
          </div>
          <LibraryButton
            variant="quiet"
            size="sm"
            onClick={() => onNavigate('books')}
            icon={<ArrowLeft className="w-4 h-4" aria-hidden="true" />}
          >
            عرض جميع الكتب ({books.length})
          </LibraryButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {showcaseBooks.map((book) => {
            const fav = favoriteBookIds.includes(book.id);
            return (
              <article
                key={book.id}
                className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 shadow-xs"
              >
                <div>
                  <div className="h-48 overflow-hidden bg-[var(--bg-surface-soft)]">
                    <EditorialImage
                      src={book.coverImage}
                      alt={book.title}
                      fallbackTitle={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-[var(--text-muted)] mb-2">
                      {book.category} · <span className="font-mono-num">{book.readingMinutes}</span> دقيقة قراءة
                    </div>
                    <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                      {book.title}
                    </h3>
                    <p className="text-xs text-[var(--accent-primary)] mt-1">{book.author}</p>
                    <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                      {book.synopsis}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 flex items-center justify-between gap-2">
                  <LibraryButton
                    variant="primary"
                    size="sm"
                    onClick={() => onOpenBook(book)}
                    icon={<BookOpen className="w-4 h-4" aria-hidden="true" />}
                  >
                    اقرأ الآن
                  </LibraryButton>
                  <button
                    type="button"
                    onClick={() => onToggleFavoriteBook(book.id)}
                    aria-label={fav ? `إزالة ${book.title} من المفضلة` : `حفظ ${book.title} في المفضلة`}
                    className={`min-h-[40px] min-w-[40px] rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                      fav
                        ? 'bg-[var(--bg-accent-tint)] border-[var(--accent-primary)]/35 text-[var(--accent-primary)]'
                        : 'border-[var(--border-hairline)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-soft)]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. Team Ensemble & Library Doors */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 animate-gentle-reveal" style={{ animationDelay: '300ms' }}>
        <div className="rounded-3xl bg-[var(--bg-surface-soft)]/70 border border-[var(--border-hairline)] p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-medium text-[var(--accent-primary)] mb-1">
                أرواح خلف كل سطر
              </p>
              <h2 className="font-editorial text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
                فريق كل كلمة حكاية
              </h2>
            </div>
            <LibraryButton
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('team')}
              icon={<Users className="w-4 h-4 icon-float" aria-hidden="true" />}
            >
              التعرّف على الفريق كاملًا
            </LibraryButton>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {team.map((member) => (
              <div
                key={member.id}
                className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4 text-center transition-transform duration-200 hover:-translate-y-1"
              >
                <EditorialImage
                  src={member.portraitUrl}
                  alt={member.name}
                  fallbackTitle={member.name}
                  className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-[var(--accent-gold)]/35"
                />
                <h3 className="mt-3 text-sm font-bold text-[var(--text-primary)]">
                  {member.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

interface LibraryOverviewViewProps {
  booksCount: number;
  quotesCount: number;
  onNavigate: (page: AppPage) => void;
}

export const LibraryOverviewView: React.FC<LibraryOverviewViewProps> = ({
  booksCount,
  quotesCount,
  onNavigate,
}) => {
  const wings = [
    {
      page: 'books' as AppPage,
      title: 'قاعة الكتب التفاعلية',
      desc: `تصفّح ${booksCount} كتابًا أدبيًا وقصصيًا بفصول مرتبة وقارئ مريح للعين.`,
      icon: BookOpen,
      tone: 'bg-[#FBECEF]/70',
    },
    {
      page: 'heart_words' as AppPage,
      title: 'ركن كلمات تلمس القلب',
      desc: `مختارات دافئة من الخواطر والهمسات الرقيقة (${quotesCount} نصًا ملهمًا).`,
      icon: Heart,
      tone: 'bg-[#F2EEFA]/70',
    },
    {
      page: 'daily_quote' as AppPage,
      title: 'منصة اقتباس اليوم',
      desc: 'جملة مضيئة تتجدد مع شمس كل يوم لترافق صباحك.',
      icon: Sparkles,
      tone: 'bg-[#EAF4FA]/70',
    },
    {
      page: 'settings' as AppPage,
      title: 'السمات وتطبيق الهاتف',
      desc: 'خصّص ألوان المكتبة الفاتحة، ومزامنة حسابك بين الويب وAndroid وiOS.',
      icon: Smartphone,
      tone: 'bg-[#EAF6F0]/70',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 space-y-12 animate-gentle-reveal">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-center">
          <p className="text-xs font-medium text-[var(--accent-primary)] mb-2">
            الدليل المعماري للمكتبة
          </p>
          <h1 className="font-editorial text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
            أقسام وقاعات المكتبة
          </h1>
          <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl">
            صُمّمت كل قاعة في «كل كلمة حكاية» لتمنحك انتقالًا هادئًا ومنظمًا بين الكتب الطويلة، والكلمات السريعة الدافئة، دون أي ازدحام بصري.
          </p>
        </div>
        <div className="lg:col-span-5">
          <div className="h-64 rounded-3xl overflow-hidden border border-[var(--border-hairline)]">
            <EditorialImage
              src={LIBRARY_MEDIA.exterior}
              alt="حديقة ومدخل مكتبة كل كلمة حكاية"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wings.map((wing) => {
          const Icon = wing.icon;
          return (
            <button
              key={wing.page}
              type="button"
              onClick={() => onNavigate(wing.page)}
              className="text-right rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-7 hover:-translate-y-1 transition-transform duration-200 cursor-pointer flex items-start gap-5 shadow-xs"
            >
              <div className={`w-12 h-12 rounded-2xl ${wing.tone} text-[var(--accent-primary)] flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6 icon-float" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                  {wing.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {wing.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
