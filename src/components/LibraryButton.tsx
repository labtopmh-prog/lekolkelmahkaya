import React from 'react';
import { Loader2 } from 'lucide-react';

export type LibraryButtonVariant = 'primary' | 'secondary' | 'tinted' | 'quiet' | 'danger';
export type LibraryButtonSize = 'sm' | 'md' | 'lg';

interface LibraryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: LibraryButtonVariant;
  size?: LibraryButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const LibraryButton: React.FC<LibraryButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  type = 'button',
  ...rest
}) => {
  const sizeClasses: Record<LibraryButtonSize, string> = {
    sm: 'min-h-[40px] px-4 py-2 text-xs gap-1.5',
    md: 'min-h-[44px] px-6 py-2.5 text-sm gap-2',
    lg: 'min-h-[48px] px-8 py-3 text-base gap-2.5',
  };

  const variantClasses: Record<LibraryButtonVariant, string> = {
    primary:
      'bg-[var(--accent-primary)] text-white shadow-sm hover:bg-[var(--accent-hover)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
    secondary:
      'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-hairline)] shadow-xs hover:bg-[var(--bg-surface-soft)] hover:-translate-y-0.5 active:scale-[0.98]',
    tinted:
      'bg-[var(--bg-surface-soft)] text-[var(--accent-primary)] border border-[var(--border-hairline)] hover:bg-[var(--bg-accent-tint)] active:scale-[0.98]',
    quiet:
      'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline-offset-4 hover:underline',
    danger:
      'bg-[#FDF2F2] text-[#9E3B3B] border border-[#E8C5C5] hover:bg-[#FBE4E4] active:scale-[0.98]',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-xl font-medium whitespace-nowrap shrink-0 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)] disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      <span className="shrink-0 inline-flex items-center">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : icon}
      </span>
      <span>{children}</span>
    </button>
  );
};
