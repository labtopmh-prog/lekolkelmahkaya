import type {
  Book,
  BookCategory,
  Quote,
  QuoteCategory,
  SoftThemeDefinition,
  SoftThemeId,
  UserRole,
} from '../types/library';

export const SOFT_THEMES: SoftThemeDefinition[] = [
  {
    id: 'cream',
    name: 'الكريمي الهادئ',
    description: 'ورق دافئ بإضاءة صباحية ناعمة وذهبي هادئ',
    swatchBg: '#FCF9F4',
    swatchAccent: '#8D5B4C',
  },
  {
    id: 'rose',
    name: 'الوردي الفاتح',
    description: 'أجواء شاعرية بلمسات وردية رقيقة مريحة للعين',
    swatchBg: '#FBECEF',
    swatchAccent: '#A3556B',
  },
  {
    id: 'lavender',
    name: 'اللافندر الحالم',
    description: 'هدوء تأملي بدرجات البنفسجي الفاتح الناعم',
    swatchBg: '#F2EEFA',
    swatchAccent: '#6D589E',
  },
  {
    id: 'sky',
    name: 'الأزرق السماوي',
    description: 'صفاء ذهني مستوحى من سماء الصباح الصافية',
    swatchBg: '#EAF4FA',
    swatchAccent: '#3D7596',
  },
  {
    id: 'mint',
    name: 'الأخضر النعناعي',
    description: 'انتعاش حديقة المكتبة بألوان نباتية هادئة',
    swatchBg: '#EAF6F0',
    swatchAccent: '#3F7E61',
  },
  {
    id: 'peach',
    name: 'الخوخي الدافئ',
    description: 'دفء الغروب اللطيف مع لمسات بيج مخملية',
    swatchBg: '#FDF0E6',
    swatchAccent: '#AD6741',
  },
];

export const BOOK_CATEGORIES: Array<BookCategory | 'الكل'> = [
  'الكل',
  'أدب وخواطر',
  'روايات قصيرة',
  'حكايات ملهمة',
  'تنمية وبصيرة',
  'شعر ونثر',
];

export const QUOTE_CATEGORIES: Array<QuoteCategory | 'الكل'> = [
  'الكل',
  'كلمات تلمس القلب',
  'اقتباس اليوم',
  'حكم وأقوال',
  'تأملات هادئة',
];

export function normalizeArabic(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
}

export function filterBooks(
  books: Book[],
  searchQuery: string,
  category: BookCategory | 'الكل'
): Book[] {
  const normQuery = normalizeArabic(searchQuery);
  return books.filter((book) => {
    const matchesCategory = category === 'الكل' || book.category === category;
    if (!matchesCategory) return false;
    if (!normQuery) return true;

    const searchable = normalizeArabic(
      `${book.title} ${book.author} ${book.synopsis} ${book.category}`
    );
    return searchable.includes(normQuery);
  });
}

export function filterQuotes(
  quotes: Quote[],
  searchQuery: string,
  category: QuoteCategory | 'الكل'
): Quote[] {
  const normQuery = normalizeArabic(searchQuery);
  return quotes.filter((quote) => {
    const matchesCategory = category === 'الكل' || quote.category === category;
    if (!matchesCategory) return false;
    if (!normQuery) return true;

    const searchable = normalizeArabic(
      `${quote.text} ${quote.author} ${quote.sourceTitle} ${quote.mood}`
    );
    return searchable.includes(normQuery);
  });
}

export function getDailyQuote(quotes: Quote[], date: Date = new Date()): Quote | null {
  if (!quotes || quotes.length === 0) return null;
  const highlighted = quotes.filter((q) => q.isDailyHighlight);
  const pool = highlighted.length > 0 ? highlighted : quotes;
  const daySeed =
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const index = daySeed % pool.length;
  return pool[index];
}

export function calculateReadingProgressPercent(
  chapterIndex: number,
  totalChapters: number
): number {
  if (totalChapters <= 0) return 0;
  const clamped = Math.max(0, Math.min(chapterIndex, totalChapters - 1));
  return Math.round(((clamped + 1) / totalChapters) * 100);
}

export function getThemeDefinition(themeId: SoftThemeId): SoftThemeDefinition {
  return SOFT_THEMES.find((t) => t.id === themeId) ?? SOFT_THEMES[0];
}

export interface RolePermissions {
  isSuperAdmin: boolean;
  isAssistant: boolean;
  canEditContent: boolean;
  canManageTeamAndRoles: boolean;
  canDeleteContent: boolean;
  roleLabelArabic: string;
}

export function resolveUserRolePermissions(role: UserRole): RolePermissions {
  if (role === 'super_admin') {
    return {
      isSuperAdmin: true,
      isAssistant: true,
      canEditContent: true,
      canManageTeamAndRoles: true,
      canDeleteContent: true,
      roleLabelArabic: 'المديرة العليا للمكتبة',
    };
  }
  if (role === 'assistant') {
    return {
      isSuperAdmin: false,
      isAssistant: true,
      canEditContent: true,
      canManageTeamAndRoles: false,
      canDeleteContent: false,
      roleLabelArabic: 'مساعد تحرير وإدارة محتوى',
    };
  }
  return {
    isSuperAdmin: false,
    isAssistant: false,
    canEditContent: false,
    canManageTeamAndRoles: false,
    canDeleteContent: false,
    roleLabelArabic: 'قارئ في المكتبة',
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateContactInput(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): ValidationResult {
  const errors: Record<string, string> = {};
  if (input.name.trim().length < 2) {
    errors.name = 'يرجى كتابة الاسم الكامل (حرفين على الأقل).';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.email = 'يرجى إدخال بريد إلكتروني صحيح.';
  }
  if (input.subject.trim().length < 2) {
    errors.subject = 'يرجى كتابة عنوان واضح للرسالة.';
  }
  if (input.message.trim().length < 5) {
    errors.message = 'يرجى كتابة نص الرسالة (5 أحرف على الأقل).';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateBookInput(input: {
  title: string;
  author: string;
  synopsis: string;
  readingMinutes: number;
  chapterTitle: string;
  chapterContent: string;
}): ValidationResult {
  const errors: Record<string, string> = {};
  if (input.title.trim().length < 2 || input.title.trim().length > 160) {
    errors.title = 'عنوان الكتاب يجب أن يكون بين حرفين و160 حرفًا.';
  }
  if (input.author.trim().length < 2 || input.author.trim().length > 120) {
    errors.author = 'اسم المؤلف يجب أن يكون بين حرفين و120 حرفًا.';
  }
  if (input.synopsis.trim().length < 8 || input.synopsis.trim().length > 1000) {
    errors.synopsis = 'وصف الكتاب يجب أن يكون بين 8 و1000 حرف.';
  }
  if (!Number.isFinite(input.readingMinutes) || input.readingMinutes < 1 || input.readingMinutes > 600) {
    errors.readingMinutes = 'مدة القراءة يجب أن تكون رقمًا بين 1 و600 دقيقة.';
  }
  if (input.chapterTitle.trim().length < 2) {
    errors.chapterTitle = 'يرجى كتابة عنوان الفصل الأول.';
  }
  if (input.chapterContent.trim().length < 20) {
    errors.chapterContent = 'محتوى الفصل الأول يجب أن لا يقل عن 20 حرفًا.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateQuoteInput(input: {
  text: string;
  author: string;
  mood: string;
}): ValidationResult {
  const errors: Record<string, string> = {};
  if (input.text.trim().length < 4 || input.text.trim().length > 600) {
    errors.text = 'نص الاقتباس يجب أن يكون بين 4 و600 حرف.';
  }
  if (input.author.trim().length < 2 || input.author.trim().length > 120) {
    errors.author = 'اسم القائل يجب أن يكون بين حرفين و120 حرفًا.';
  }
  if (input.mood.trim().length < 2 || input.mood.trim().length > 60) {
    errors.mood = 'الشعور أو الطابع الأدبي مطلوب.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

const ADMIN_PASSCODE = 'mktba2025@';

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSCODE;
}

export function processSecretTap(
  timestamps: number[],
  now: number,
  windowMs: number = 5000,
  threshold: number = 6
): { triggered: boolean; nextTimestamps: number[] } {
  const recent = timestamps.filter((t) => now - t <= windowMs);
  const next = [...recent, now];
  if (next.length >= threshold) {
    return { triggered: true, nextTimestamps: [] };
  }
  return { triggered: false, nextTimestamps: next };
}

