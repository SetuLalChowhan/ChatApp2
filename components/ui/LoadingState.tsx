'use client';

import React from 'react';

/**
 * Animated Loading Spinner with light and dark mode contrasts.
 */
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3',
  };

  return (
    <div
      className={`animate-spin rounded-full border-slate-300 dark:border-zinc-700 border-t-slate-900 dark:border-t-zinc-200 ${sizeMap[size]} ${className}`}
    />
  );
};

/**
 * Skeleton placeholder for conversation sidebar list.
 */
export const ConversationSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-2 p-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl p-2.5 animate-pulse">
          <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-zinc-800 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <div className="h-3 w-24 rounded bg-slate-200 dark:bg-zinc-800" />
              <div className="h-2.5 w-10 rounded bg-slate-200/60 dark:bg-zinc-850" />
            </div>
            <div className="h-2.5 w-36 rounded bg-slate-200/60 dark:bg-zinc-850" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton placeholder for message thread list.
 * Fills the chat container properly without displacing the header or bottom composer.
 */
export const MessageSkeleton: React.FC = () => {
  return (
    <div className="h-full flex flex-col justify-end p-4 sm:p-6 space-y-4 animate-pulse overflow-hidden">
      <div className="flex justify-start">
        <div className="h-10 w-48 rounded-2xl bg-slate-200 dark:bg-zinc-800" />
      </div>
      <div className="flex justify-end">
        <div className="h-12 w-64 rounded-2xl bg-slate-300 dark:bg-zinc-750" />
      </div>
      <div className="flex justify-start">
        <div className="h-14 w-56 rounded-2xl bg-slate-200 dark:bg-zinc-800" />
      </div>
      <div className="flex justify-end">
        <div className="h-10 w-44 rounded-2xl bg-slate-300 dark:bg-zinc-750" />
      </div>
    </div>
  );
};
