'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

/**
 * Minimal Landing Page Footer.
 */
export const LandingFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-zinc-900 bg-slate-50 dark:bg-zinc-950 py-10 transition-colors duration-150">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-zinc-400">
          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-zinc-100">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-950">
              <MessageSquare className="h-3 w-3" />
            </div>
            <span>Chat</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-slate-900 dark:hover:text-zinc-100 transition-colors">
              Sign In
            </Link>
            <span>•</span>
            <Link href="/chat" className="hover:text-slate-900 dark:hover:text-zinc-100 transition-colors">
              Open App
            </Link>
            <span>•</span>
            <a
              href="https://frontend-task-chatapp.onrender.com/docs/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-zinc-100 transition-colors"
            >
              Swagger Docs
            </a>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-zinc-500">
            Production Frontend Application
          </p>
        </div>
      </div>
    </footer>
  );
};
