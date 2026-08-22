'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Human error boundary state with clean retry action.
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load data',
  message = 'Something went wrong. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center ${className}`}>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20">
        <AlertCircle className="h-5 w-5" />
      </div>
      <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">{title}</h4>
      <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-zinc-400">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button size="sm" variant="secondary" onClick={onRetry} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try again</span>
          </Button>
        </div>
      )}
    </div>
  );
};
