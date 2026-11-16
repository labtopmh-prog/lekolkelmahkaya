import React, { useState } from 'react';
import { Download, Smartphone, WifiOff, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { LibraryButton } from './LibraryButton';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showMobileInfo, setShowMobileInfo] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <LibraryButton
        variant="tinted"
        size={compact ? 'sm' : 'md'}
        onClick={install}
        icon={<Download className="w-4 h-4" aria-hidden="true" />}
      >
        تثبيت التطبيق
      </LibraryButton>
    );
  }

  if (isIOS) {
    return (
      <>
        <LibraryButton
          variant="tinted"
          size={compact ? 'sm' : 'md'}
          onClick={() => setShowIOSGuide(true)}
          icon={<Smartphone className="w-4 h-4" aria-hidden="true" />}
        >
          تثبيت على الآيفون
        </LibraryButton>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B241E]/35 backdrop-blur-xs p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
          >
            <div className="w-full max-w-md rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 id="ios-install-title" className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                  تثبيت «كل كلمة حكاية» على iOS
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="إغلاق نافذة التثبيت"
                  className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-surface-soft)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ol className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)] list-decimal list-inside">
                <li>اضغط على زر <strong>المشاركة (Share)</strong> في شريط متصفح Safari.</li>
                <li>مرّر للأسفل واختر <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.</li>
                <li>اضغط <strong>إضافة</strong> لتشغيل المكتبة كتطبيق هاتف متكامل.</li>
              </ol>
              <div className="mt-6 flex justify-end">
                <LibraryButton variant="primary" size="sm" onClick={() => setShowIOSGuide(false)}>
                  فهمت
                </LibraryButton>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <LibraryButton
        variant="secondary"
        size={compact ? 'sm' : 'md'}
        onClick={() => setShowMobileInfo(true)}
        icon={<Smartphone className="w-4 h-4" aria-hidden="true" />}
      >
        تطبيق الهاتف
      </LibraryButton>

      {showMobileInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B241E]/35 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-guide-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 id="mobile-guide-title" className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                تطبيق Android و iOS وتثبيت PWA
              </h3>
              <button
                type="button"
                onClick={() => setShowMobileInfo(false)}
                aria-label="إغلاق"
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-surface-soft)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              يعمل المشروع كـ <strong>تطبيق ويب تقدمي (PWA)</strong> قابل للتثبيت مباشرة من المتصفح، كما يتضمن مشروع <strong>Capacitor</strong> جاهزًا للبناء والتوزيع على متاجر <strong>Android</strong> و<strong>iOS</strong> بنفس قاعدة بيانات Firebase المتزامنة.
            </p>
            <div className="mt-4 rounded-xl bg-[var(--bg-surface-soft)] p-3 text-xs text-[var(--text-secondary)] space-y-1 font-mono-num" dir="ltr">
              <div>npm run mobile:sync</div>
              <div>npm run mobile:android</div>
              <div>npm run mobile:ios</div>
            </div>
            <div className="mt-5 flex justify-end">
              <LibraryButton variant="primary" size="sm" onClick={() => setShowMobileInfo(false)}>
                إغلاق
              </LibraryButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-20 md:bottom-6 left-4 z-40 flex items-center gap-2 rounded-xl bg-[#FDF0E6] border border-[#AD6741]/30 px-4 py-2 text-xs font-medium text-[#7A4426] shadow-md"
    >
      <WifiOff className="w-4 h-4" aria-hidden="true" />
      <span>وضع عدم الاتصال — يتم عرض الكتب المحفوظة مؤقتًا</span>
    </div>
  );
};
