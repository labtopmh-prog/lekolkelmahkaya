import React, { useEffect } from 'react';
import { BookOpen } from 'lucide-react';

interface PageTurnTransitionProps {
  active: boolean;
  onComplete: () => void;
}

export const PageTurnTransition: React.FC<PageTurnTransitionProps> = ({
  active,
  onComplete,
}) => {
  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(() => {
      onComplete();
    }, 1150);
    return () => window.clearTimeout(timer);
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#FCF9F4] overflow-hidden"
      aria-live="polite"
      aria-label="الانتقال إلى المكتبة"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#FCF9F4] via-[#FBECEF] to-[#F2EEFA] opacity-90" />

      {/* Turning illuminated parchment page */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="animate-page-turn relative w-[92vw] max-w-4xl h-[78vh] rounded-2xl bg-[#FFFDF9] border border-[#C49A45]/30 shadow-2xl flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FBECEF] flex items-center justify-center text-[#8D5B4C] mb-5">
            <BookOpen className="w-8 h-8" aria-hidden="true" />
          </div>
          <p className="text-xs tracking-wide text-[#8C7F73] mb-2">مرحبًا بك في عالم القراءة الهادئ</p>
          <h2 className="font-editorial text-4xl md:text-6xl font-bold text-[#2B241E]">
            كل كلمة حكاية
          </h2>
          <div className="mt-6 w-32 h-[1px] bg-[#C49A45]/40" />
          <p className="mt-4 text-sm text-[#685D53] max-w-md leading-relaxed">
            تفتح صفحات الكتاب الآن لتقودك إلى قاعات المكتبة المضيئة...
          </p>
        </div>
      </div>
    </div>
  );
};
