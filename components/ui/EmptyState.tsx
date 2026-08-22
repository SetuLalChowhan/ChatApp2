'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon | React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Human empty state view with friendly icon, title, and optional call to action buttons.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  children,
  className = '',
}) => {
  const isComponent = React.isValidElement(icon);
  const IconComponent = typeof icon === 'function' ? (icon as LucideIcon) : null;

  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center ${className}`}>
      {icon && (
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/50 text-slate-500 dark:text-zinc-400 shadow-xs">
          {isComponent ? icon : IconComponent ? <IconComponent className="h-5 w-5 stroke-[1.75]" /> : null}
        </div>
      )}
      <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">{title}</h4>
      <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{description}</p>
      
      {children ? (
        <div className="mt-4 w-full flex justify-center">{children}</div>
      ) : actionLabel && onAction ? (
        <div className="mt-4">
          <Button size="sm" variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
};
