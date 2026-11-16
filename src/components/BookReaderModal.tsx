import React, { useState } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Heart,
  X,
} from 'lucide-react';
import type { Book, FontSizeOption } from '../types/library';
import { calculateReadingProgressPercent } from '../utils/libraryLogic';
import { audioEngine } from '../utils/audioEngine';
import { LibraryButton } from './LibraryButton';

interface BookReaderModalProps {
  book: Book;
  initialChapterIndex: number;
  fontSize: FontSizeOption;
  soundEnabled: boolean;
  isFavorite: boolean;
  onToggleFavorite: (bookId: string) => void;
  onChangeFontSize: (size: FontSizeOption) => void;
  onSaveProgress: (bookId: string, chapterIndex: number) => void;
  onClose: () => void;
}

export const BookReaderModal: React.FC<BookReaderModalProps> = ({
  book,
  initialChapterIndex,
  fontSize,
  soundEnabled,
  isFavorite,
  onToggleFavorite,
  onChangeFontSize,
  onSaveProgress,
  onClose,
}) => {
  const safeInitial = Math.max(0, Math.min(initialChapterIndex, book.chapters.length - 1));
  const [chapterIndex, setChapterIndex] = useState(safeInitial);

  const chapter = book.chapters[chapterIndex] || book.chapters[0];
  const progressPercent = calculateReadingProgressPercent(chapterIndex, book.chapters.length);

  const selectChapter = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= book.chapters.length) return;
    audioEngine.playPageTurnSfx(soundEnabled);
    setChapterIndex(nextIndex);
    onSaveProgress(book.id, nextIndex);
  };

  const proseSizeClass =
    fontSize === 'small'
      ? 'text-base leading-loose'
      : fontSize === 'large'
        ? 'text-xl md:text-2xl leading-[2.1]'
        : 'text-lg leading-[1.95]';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reader-book-title"
      className="fixed inset-0 z-50 bg-[var(--bg-canvas)] flex flex-col overflow-hidden"
    >
      {/* Reader Header */}
      <header className="shrink-0 bg-[var(--bg-surface)] border-b border-[var(--border-hairline)] px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق قارئ الكتاب"
            className="min-h-[44px] min-w-[44px] rounded-xl border border-[var(--border-hairline)] flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-surface-soft)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2
              id="reader-book-title"
              className="font-editorial text-lg md:text-xl font-bold text-[var(--text-primary)] truncate"
            >
              {book.title}
            </h2>
            <p className="text-xs text-[var(--text-muted)] truncate">
              {book.author} · {book.category}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Font size segmented control */}
          <div
            className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-surface-soft)]"
            role="group"
            aria-label="حجم خط القراءة"
          >
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
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  fontSize === opt.id
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onToggleFavorite(book.id)}
            aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
            className={`min-h-[44px] px-3.5 rounded-xl border inline-flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-[var(--bg-accent-tint)] border-[var(--accent-primary)]/35 text-[var(--accent-primary)]'
                : 'bg-[var(--bg-surface)] border-[var(--border-hairline)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-soft)]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} aria-hidden="true" />
            <span className="hidden md:inline">{isFavorite ? 'في المفضلة' : 'حفظ'}</span>
          </button>
        </div>
      </header>

      {/* Progress Hairline */}
      <div className="h-1 bg-[var(--bg-surface-soft)] w-full shrink-0">
        <div
          className="h-full bg-[var(--accent-primary)] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Reader Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Chapter Sidebar */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-[var(--text-muted)]">
                  فهرس الفصول
                </span>
                <span className="font-mono-num text-xs text-[var(--accent-primary)]">
                  {progressPercent}%
                </span>
              </div>
              <div className="space-y-2">
                {book.chapters.map((ch, idx) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => selectChapter(idx)}
                    className={`w-full text-right px-3.5 py-3 rounded-xl text-sm transition-colors cursor-pointer ${
                      idx === chapterIndex
                        ? 'bg-[var(--bg-surface-soft)] text-[var(--accent-primary)] font-semibold'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-canvas)]'
                    }`}
                  >
                    {ch.title}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Reading Column (65-75ch Editorial Measure) */}
          <article className="lg:col-span-8 bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-hairline)] p-6 md:p-12 shadow-xs">
            {/* Mobile Chapter & Font Bar */}
            <div className="lg:hidden flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-[var(--border-hairline)]">
              <label htmlFor="mobile-chapter-select" className="sr-only">
                اختر الفصل
              </label>
              <select
                id="mobile-chapter-select"
                value={chapterIndex}
                onChange={(e) => selectChapter(Number(e.target.value))}
                className="flex-1 min-w-[160px] min-h-[40px] px-3 rounded-xl bg-[var(--bg-surface-soft)] border border-[var(--border-hairline)] text-xs font-medium text-[var(--text-primary)]"
              >
                {book.chapters.map((ch, idx) => (
                  <option key={ch.id} value={idx}>
                    {ch.title}
                  </option>
                ))}
              </select>

              <div className="sm:hidden flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-surface-soft)]">
                {(
                  [
                    { id: 'small', label: 'ص' },
                    { id: 'medium', label: 'م' },
                    { id: 'large', label: 'ك' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    aria-label={`حجم الخط ${opt.id}`}
                    onClick={() => onChangeFontSize(opt.id)}
                    className={`min-w-[32px] min-h-[32px] rounded-lg text-xs font-medium cursor-pointer ${
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

            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-4">
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                <span>فصل {chapterIndex + 1} من {book.chapters.length}</span>
              </span>
              <span className="font-mono-num">التقدم {progressPercent}%</span>
            </div>

            <h3 className="font-editorial text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-6 pb-4 border-b border-[var(--border-hairline)]">
              {chapter?.title}
            </h3>

            <div className={`space-y-6 text-[var(--text-primary)] max-w-prose ${proseSizeClass}`}>
              {chapter?.content.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>

            {/* Chapter Footer Navigation */}
            <div className="mt-10 pt-6 border-t border-[var(--border-hairline)] flex items-center justify-between gap-2">
              <LibraryButton
                variant="secondary"
                size="sm"
                disabled={chapterIndex === 0}
                onClick={() => selectChapter(chapterIndex - 1)}
                icon={<ChevronRight className="w-4 h-4" aria-hidden="true" />}
              >
                السابق
              </LibraryButton>

              <span className="font-mono-num text-xs text-[var(--text-muted)]">
                {chapterIndex + 1} / {book.chapters.length}
              </span>

              <LibraryButton
                variant="primary"
                size="sm"
                disabled={chapterIndex >= book.chapters.length - 1}
                onClick={() => selectChapter(chapterIndex + 1)}
                icon={<ChevronLeft className="w-4 h-4" aria-hidden="true" />}
              >
                التالي
              </LibraryButton>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
