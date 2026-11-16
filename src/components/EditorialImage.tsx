import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface EditorialImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const EditorialImage: React.FC<EditorialImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[var(--bg-surface-soft)] via-[var(--bg-canvas)] to-[var(--bg-accent-tint)] text-[var(--accent-primary)] p-6 ${className}`}
      >
        <BookOpen className="w-8 h-8 opacity-75" aria-hidden="true" />
        {fallbackTitle && (
          <span className="font-editorial text-sm text-center text-[var(--text-secondary)]">
            {fallbackTitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
