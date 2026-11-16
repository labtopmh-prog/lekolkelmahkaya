import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';
import { verifyAdminPassword } from '../utils/libraryLogic';
import { LibraryButton } from './LibraryButton';

interface AdminPasscodeModalProps {
  open: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

export const AdminPasscodeModal: React.FC<AdminPasscodeModalProps> = ({
  open,
  onClose,
  onUnlock,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(password)) {
      setPassword('');
      setError(null);
      onUnlock();
    } else {
      setError('كلمة المرور غير صحيحة.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-gate-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B241E]/40 backdrop-blur-xs p-4"
    >
      <div className="w-full max-w-sm rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-6 shadow-2xl animate-gentle-reveal">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[var(--accent-primary)]">
            <Lock className="w-4 h-4 icon-float" aria-hidden="true" />
            <h2 id="admin-gate-title" className="font-editorial text-xl font-bold text-[var(--text-primary)]">
              دخول لوحة الإدارة
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setPassword('');
              setError(null);
              onClose();
            }}
            aria-label="إغلاق"
            className="min-h-[40px] min-w-[40px] rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-surface-soft)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-passcode-input" className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
              أدخل كلمة مرور الإدارة
            </label>
            <input
              id="admin-passcode-input"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full min-h-[44px] px-4 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] focus:outline-2 focus:outline-[var(--accent-primary)]"
            />
            {error && <p className="mt-1.5 text-xs text-[#9E3B3B]">{error}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <LibraryButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setPassword('');
                setError(null);
                onClose();
              }}
            >
              إلغاء
            </LibraryButton>
            <LibraryButton type="submit" variant="primary" size="sm">
              دخول
            </LibraryButton>
          </div>
        </form>
      </div>
    </div>
  );
};
