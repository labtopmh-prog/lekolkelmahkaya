export type AppPage =
  | 'home'
  | 'library'
  | 'books'
  | 'heart_words'
  | 'daily_quote'
  | 'team'
  | 'about'
  | 'contact'
  | 'settings'
  | 'account'
  | 'admin';

export type SoftThemeId = 'cream' | 'rose' | 'lavender' | 'sky' | 'mint' | 'peach';

export type FontSizeOption = 'small' | 'medium' | 'large';

export type BookCategory =
  | 'أدب وخواطر'
  | 'روايات قصيرة'
  | 'حكايات ملهمة'
  | 'تنمية وبصيرة'
  | 'شعر ونثر';

export type QuoteCategory =
  | 'كلمات تلمس القلب'
  | 'اقتباس اليوم'
  | 'حكم وأقوال'
  | 'تأملات هادئة';

export type UserRole = 'super_admin' | 'assistant' | 'reader';

export interface Chapter {
  id: string;
  title: string;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  synopsis: string;
  coverColor: string;
  coverImage: string;
  readingMinutes: number;
  featured: boolean;
  chapters: Chapter[];
  createdBy: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  sourceTitle: string;
  category: QuoteCategory;
  mood: string;
  isDailyHighlight: boolean;
  createdBy: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface TeamMember {
  id: string;
  name: string;
  roleTitle: string;
  roleLevel: 'super_admin' | 'chief_assistant' | 'assistant';
  bio: string;
  portraitUrl: string;
  accentTone: string;
  sortOrder: number;
  updatedAt?: unknown;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  theme: SoftThemeId;
  fontSize: FontSizeOption;
  notificationsEnabled: boolean;
  favoriteBookIds: string[];
  favoriteQuoteIds: string[];
  readingProgress: Record<string, number>;
  updatedAt?: unknown;
}

export interface RoleAssignment {
  uid: string;
  email: string;
  role: UserRole;
  title: string;
  assignedBy: string;
  updatedAt?: unknown;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'reviewed';
  createdAt?: unknown;
}

export interface SoftThemeDefinition {
  id: SoftThemeId;
  name: string;
  description: string;
  swatchBg: string;
  swatchAccent: string;
}
