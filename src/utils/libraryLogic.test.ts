import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeArabic,
  filterBooks,
  filterQuotes,
  getDailyQuote,
  calculateReadingProgressPercent,
  resolveUserRolePermissions,
  validateContactInput,
  validateBookInput,
  validateQuoteInput,
  verifyAdminPassword,
  processSecretTap,
} from './libraryLogic';
import { SEED_BOOKS, SEED_QUOTES, SEED_TEAM } from '../data/seedData';

test('team seed data includes Habiba Raouf accurately', () => {
  const habiba = SEED_TEAM.find((m) => m.id === 'habiba-raouf');
  assert.ok(habiba);
  assert.equal(habiba.name, 'حبيبة رؤوف');
  assert.equal(habiba.roleTitle, 'مساعدة');
});

test('verifyAdminPassword strictly matches configured admin passcode', () => {
  assert.equal(verifyAdminPassword('mktba2025@'), true);
  assert.equal(verifyAdminPassword('mktba2025'), false);
  assert.equal(verifyAdminPassword(''), false);
});

test('processSecretTap triggers only on 6 consecutive taps within window', () => {
  let taps: number[] = [];
  for (let i = 0; i < 5; i += 1) {
    const res = processSecretTap(taps, 1000 + i * 300, 5000, 6);
    assert.equal(res.triggered, false);
    taps = res.nextTimestamps;
  }
  const sixth = processSecretTap(taps, 2600, 5000, 6);
  assert.equal(sixth.triggered, true);
  assert.equal(sixth.nextTimestamps.length, 0);

  // Expired taps outside window do not trigger
  const stale = processSecretTap([1000, 1100, 1200, 1300, 1400], 10000, 5000, 6);
  assert.equal(stale.triggered, false);
  assert.equal(stale.nextTimestamps.length, 1);
});

test('normalizeArabic strips diacritics and normalizes hamza/taa marbuta', () => {
  assert.equal(normalizeArabic('أَثَرُ الكَلِمَةِ الطَّيِّبَةِ'), 'اثر الكلمه الطيبه');
  assert.equal(normalizeArabic('إلهامٌ وَحِكْمَةٌ'), 'الهام وحكمه');
});

test('filterBooks filters accurately by category and normalized Arabic search', () => {
  const all = filterBooks(SEED_BOOKS, '', 'الكل');
  assert.equal(all.length, SEED_BOOKS.length);

  const bySearch = filterBooks(SEED_BOOKS, 'رسائل الصباح', 'الكل');
  assert.equal(bySearch.length >= 1, true);
  assert.equal(bySearch[0].title.includes('رسائل'), true);

  const byCategory = filterBooks(SEED_BOOKS, '', 'حكايات ملهمة');
  assert.equal(byCategory.every((b) => b.category === 'حكايات ملهمة'), true);
});

test('filterQuotes filters by category and mood/text', () => {
  const heartWords = filterQuotes(SEED_QUOTES, '', 'كلمات تلمس القلب');
  assert.equal(heartWords.length > 0, true);
  assert.equal(heartWords.every((q) => q.category === 'كلمات تلمس القلب'), true);
});

test('getDailyQuote deterministically picks a highlighted quote for a given date', () => {
  const d1 = new Date(2026, 10, 16);
  const d2 = new Date(2026, 10, 16);
  const q1 = getDailyQuote(SEED_QUOTES, d1);
  const q2 = getDailyQuote(SEED_QUOTES, d2);
  assert.ok(q1);
  assert.equal(q1.id, q2?.id);
});

test('calculateReadingProgressPercent computes accurate chapter percentage', () => {
  assert.equal(calculateReadingProgressPercent(0, 4), 25);
  assert.equal(calculateReadingProgressPercent(3, 4), 100);
  assert.equal(calculateReadingProgressPercent(0, 0), 0);
});

test('resolveUserRolePermissions enforces super_admin > assistant > reader hierarchy', () => {
  const superAdmin = resolveUserRolePermissions('super_admin');
  assert.equal(superAdmin.isSuperAdmin, true);
  assert.equal(superAdmin.canManageTeamAndRoles, true);
  assert.equal(superAdmin.canDeleteContent, true);

  const assistant = resolveUserRolePermissions('assistant');
  assert.equal(assistant.isSuperAdmin, false);
  assert.equal(assistant.canEditContent, true);
  assert.equal(assistant.canManageTeamAndRoles, false);
  assert.equal(assistant.canDeleteContent, false);

  const reader = resolveUserRolePermissions('reader');
  assert.equal(reader.isAssistant, false);
  assert.equal(reader.canEditContent, false);
});

test('validation helpers reject empty/invalid inputs and accept valid inputs', () => {
  const badContact = validateContactInput({
    name: 'أ',
    email: 'invalid',
    subject: '',
    message: 'ق',
  });
  assert.equal(badContact.valid, false);
  assert.ok(badContact.errors.name);
  assert.ok(badContact.errors.email);

  const goodContact = validateContactInput({
    name: 'سلمى محمود',
    email: 'salma@example.com',
    subject: 'اقتراح كتاب جديد',
    message: 'أتمنى إضافة ديوان جديد في قسم الشعر والنثر.',
  });
  assert.equal(goodContact.valid, true);

  const badBook = validateBookInput({
    title: '',
    author: 'أ',
    synopsis: 'قصير',
    readingMinutes: 0,
    chapterTitle: '',
    chapterContent: 'قصير',
  });
  assert.equal(badBook.valid, false);

  const goodQuote = validateQuoteInput({
    text: 'الكلمة الصادقة تضيء عتمة الأيام.',
    author: 'ملك أحمد سامي',
    mood: 'طمأنينة',
  });
  assert.equal(goodQuote.valid, true);
});
