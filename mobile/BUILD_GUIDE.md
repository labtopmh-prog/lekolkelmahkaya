# دليل بناء وتشغيل تطبيق الهاتف (Android & iOS) — كل كلمة حكاية

تم إعداد المشروع ليعمل على منصتين بهوية واحدة وقاعدة بيانات سحابية مشتركة (Firebase Firestore + Authentication):

## 1. تطبيق الويب التقدمي (PWA)
- يعمل مباشرة عبر المتصفح على الحاسوب والهاتف.
- يدعم التثبيت على الشاشة الرئيسية لنظام Android وiOS عبر زر التثبيت داخل صفحة الإعدادات أو شريط المتصفح.
- يحتفظ بالملفات والكتب الأساسية للعمل السلس عند ضعف الاتصال.

## 2. تطبيق الهاتف الأصلي (Capacitor — Android & iOS)
ملف الإعداد `capacitor.config.ts` مُجهّز بالمعرّف `com.kolkalimahekaya.library` واسم التطبيق `كل كلمة حكاية`.

### خطوات بناء تطبيق Android (عبر Android Studio):
1. تثبيت حزمة أندرويد: `npm install @capacitor/android`
2. إضافة مشروع Android الأصلي: `npx cap add android`
3. مزامنة نسخة البناء مع التطبيق: `npm run mobile:sync`
4. فتح المشروع في Android Studio وتوقيع ملف APK / AAB للنشر: `npx cap open android`

### خطوات بناء تطبيق iOS (عبر Xcode على macOS):
1. تثبيت حزمة iOS: `npm install @capacitor/ios`
2. إضافة مشروع iOS الأصلي: `npx cap add ios`
3. مزامنة نسخة البناء مع التطبيق: `npm run mobile:sync`
4. فتح المشروع في Xcode والتوزيع عبر TestFlight / App Store: `npx cap open ios`

## 3. المزامنة المشتركة
- يستخدم تطبيقا الويب والهاتف نفس ملف `firebase-applet-config.json` ونفس قواعد الأمان `firestore.rules`.
- أي كتاب أو اقتباس تتم إضافته من لوحة الإدارة على الويب يظهر فورًا في تطبيق الهاتف، وتُحفظ المفضلة والسمات في حساب المستخدم على جميع الأجهزة.
