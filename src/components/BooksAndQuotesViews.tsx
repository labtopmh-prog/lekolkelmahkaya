import React, { useState } from 'react';
import { BookOpen, Check, Copy, Heart, Search, Sparkles } from 'lucide-react';
import type { Book, BookCategory, Quote, QuoteCategory } from '../types/library';
import {
  BOOK_CATEGORIES,
  QUOTE_CATEGORIES,
  filterBooks,
  filterQuotes,
  getDailyQuote,
} from '../utils/libraryLogic';
import { EditorialImage } from './EditorialImage';
import { LibraryButton } from './LibraryButton';

interface BooksCatalogViewProps {
  books: Book[];
  favoriteBookIds: string[];
  readingProgress: Record<string, number>;
  onOpenBook: (book: Book) => void;
  onToggleFavoriteBook: (bookId: string) => void;
}

export const BooksCatalogView: React.FC<BooksCatalogViewProps> = ({
  books,
  favoriteBookIds,
  readingProgress,
  onOpenBook,
  onToggleFavoriteBook,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'الكل'>('الكل');

  const filtered = filterBooks(books, searchQuery, selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 space-y-8 animate-gentle-reveal">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border-hairline)] pb-6">
        <div>
          <p className="text-xs font-medium text-[var(--accent-primary)] mb-1">
            فهرس القراءة الرقمي
          </p>
          <h1 className="font-editorial text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
            مكتبة الكتب
          </h1>
        </div>
        <p className="text-sm text-[var(--text-secondary)] max-w-md">
          اختر كتابًا وابدأ القراءة مباشرة عبر قارئ متجاوب ومريح للعين على الحاسوب والهاتف.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <label htmlFor="book-search-input" className="sr-only">
            ابحث في الكتب
          </label>
          <Search
            className="w-4 h-4 text-[var(--text-muted)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="book-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالعنوان أو اسم المؤلف..."
            className="w-full min-h-[44px] pr-10 pl-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-2 focus:outline-[var(--accent-primary)]"
          />
        </div>

        <div
          className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-surface-soft)]"
          role="group"
          aria-label="تصنيفات الكتب"
        >
          {BOOK_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                selectedCategory === category
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-12 text-center">
          <p className="font-editorial text-2xl text-[var(--text-primary)]">
            لم نجد كتبًا مطابقة لبحثك
          </p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            جرّب كلمات بحث أبسط أو اختر تصنيف «الكل».
          </p>
          <div className="mt-5">
            <LibraryButton
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('الكل');
              }}
            >
              إعادة ضبط الفلترة
            </LibraryButton>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((book) => {
            const fav = favoriteBookIds.includes(book.id);
            const savedChapterIdx = readingProgress[book.id];
            const hasProgress = typeof savedChapterIdx === 'number' && savedChapterIdx > 0;
            return (
              <article
                key={book.id}
                className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 shadow-xs"
              >
                <div>
                  <div className="h-44 overflow-hidden bg-[var(--bg-surface-soft)]">
                    <EditorialImage
                      src={book.coverImage}
                      alt={book.title}
                      fallbackTitle={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-[var(--text-muted)] mb-2">
                      {book.category} · <span className="font-mono-num">{book.chapters.length}</span> فصول ·{' '}
                      <span className="font-mono-num">{book.readingMinutes}</span> د
                    </div>
                    <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                      {book.title}
                    </h2>
                    <p className="text-xs text-[var(--accent-primary)] mt-1">{book.author}</p>
                    <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
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
                    {hasProgress ? 'متابعة القراءة' : 'افتح الكتاب'}
                  </LibraryButton>
                  <button
                    type="button"
                    onClick={() => onToggleFavoriteBook(book.id)}
                    aria-label={fav ? `إزالة ${book.title} من المفضلة` : `إضافة ${book.title} إلى المفضلة`}
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
      )}
    </div>
  );
};

interface QuotesPageProps {
  mode: 'heart_words' | 'daily_quote';
  quotes: Quote[];
  favoriteQuoteIds: string[];
  onToggleFavoriteQuote: (quoteId: string) => void;
}

export const QuotesAndHeartView: React.FC<QuotesPageProps> = ({
  mode,
  quotes,
  favoriteQuoteIds,
  onToggleFavoriteQuote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<QuoteCategory | 'الكل'>(
    mode === 'heart_words' ? 'كلمات تلمس القلب' : 'الكل'
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const dailyQuote = getDailyQuote(quotes);
  const filtered = filterQuotes(quotes, searchQuery, selectedCategory);

  const handleCopy = async (quote: Quote) => {
    try {
      await navigator.clipboard.writeText(`«${quote.text}» — ${quote.author}`);
      setCopiedId(quote.id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(quote.id);
      window.setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 space-y-10 animate-gentle-reveal">
      <div className="border-b border-[var(--border-hairline)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[var(--accent-primary)] mb-1">
            {mode === 'daily_quote' ? 'إشراقة صباحية متجددة' : 'أقوال وحكم وخواطر'}
          </p>
          <h1 className="font-editorial text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
            {mode === 'daily_quote' ? 'اقتباس اليوم' : 'كلمات تلمس القلب'}
          </h1>
        </div>
        <p className="text-sm text-[var(--text-secondary)] max-w-md">
          {mode === 'daily_quote'
            ? 'كلمة مضيئة نختارها لك كل يوم لتبدأ يومك بنبرة هادئة ومتفائلة.'
            : 'صفحة مستقلة تجمع أرقّ الكلمات والحكم الأدبية التي تبعث السكينة في النفس.'}
        </p>
      </div>

      {/* Featured Daily Quote Hero (Highlighted prominently on Daily Quote mode) */}
      {dailyQuote && mode === 'daily_quote' && (
        <section className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-8 md:p-14 text-center shadow-xs">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-[var(--accent-primary)] mb-4">
            <Sparkles className="w-4 h-4 icon-float" aria-hidden="true" />
            <span>اختيار اليوم · {dailyQuote.mood}</span>
          </div>
          <blockquote className="font-editorial text-3xl md:text-5xl leading-relaxed text-[var(--text-primary)] max-w-4xl mx-auto">
            «{dailyQuote.text}»
          </blockquote>
          <p className="mt-6 text-sm text-[var(--text-secondary)]">
            {dailyQuote.author}
            {dailyQuote.sourceTitle ? ` · ${dailyQuote.sourceTitle}` : ''}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <LibraryButton
              variant="primary"
              size="sm"
              onClick={() => handleCopy(dailyQuote)}
              icon={
                copiedId === dailyQuote.id ? (
                  <Check className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Copy className="w-4 h-4" aria-hidden="true" />
                )
              }
            >
              {copiedId === dailyQuote.id ? 'تم النسخ' : 'نسخ الاقتباس'}
            </LibraryButton>
            <LibraryButton
              variant="tinted"
              size="sm"
              onClick={() => onToggleFavoriteQuote(dailyQuote.id)}
              icon={
                <Heart
                  className={`w-4 h-4 ${favoriteQuoteIds.includes(dailyQuote.id) ? 'fill-current' : ''}`}
                  aria-hidden="true"
                />
              }
            >
              {favoriteQuoteIds.includes(dailyQuote.id) ? 'محفوظ في المفضلة' : 'حفظ في المفضلة'}
            </LibraryButton>
          </div>
        </section>
      )}

      {/* Search & Category Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <label htmlFor="quote-search-input" className="sr-only">
            ابحث في الاقتباسات
          </label>
          <Search
            className="w-4 h-4 text-[var(--text-muted)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="quote-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في الكلمات أو اسم الكاتب..."
            className="w-full min-h-[44px] pr-10 pl-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-2 focus:outline-[var(--accent-primary)]"
          />
        </div>

        <div
          className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-surface-soft)]"
          role="group"
          aria-label="تصنيفات الكلمات"
        >
          {QUOTE_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                selectedCategory === category
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Quotes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((quote) => {
          const fav = favoriteQuoteIds.includes(quote.id);
          const isCopied = copiedId === quote.id;
          return (
            <article
              key={quote.id}
              className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-7 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="text-xs text-[var(--text-muted)] mb-3">
                  {quote.category} · {quote.mood}
                </div>
                <blockquote className="font-editorial text-2xl leading-relaxed text-[var(--text-primary)]">
                  «{quote.text}»
                </blockquote>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-hairline)] flex items-center justify-between gap-3">
                <div className="text-xs text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--text-primary)]">{quote.author}</span>
                  {quote.sourceTitle ? ` · ${quote.sourceTitle}` : ''}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(quote)}
                    aria-label={`نسخ اقتباس ${quote.author}`}
                    className="min-h-[40px] px-3 rounded-xl border border-[var(--border-hairline)] text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-surface-soft)] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-[#3F7E61]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'نُسخ' : 'نسخ'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleFavoriteQuote(quote.id)}
                    aria-label={fav ? 'إزالة الاقتباس من المفضلة' : 'حفظ الاقتباس في المفضلة'}
                    className={`min-h-[40px] min-w-[40px] rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                      fav
                        ? 'bg-[var(--bg-accent-tint)] border-[var(--accent-primary)]/35 text-[var(--accent-primary)]'
                        : 'border-[var(--border-hairline)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-soft)]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
