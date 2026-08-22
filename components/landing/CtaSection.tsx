'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

/**
 * Final Call-to-Action Section.
 * Clean, intentional, and purposeful with readable typography.
 */
export const CtaSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <section className="py-24 md:py-32 border-t border-slate-200/80 dark:border-zinc-900 bg-slate-100/50 dark:bg-zinc-950/80 text-center transition-colors duration-150">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100 sm:text-4xl lg:text-5xl leading-[1.28] sm:leading-[1.22] lg:leading-[1.18]">
          Start messaging with your team today.
        </h2>
        <p className="mt-4 max-w-lg mx-auto text-base sm:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
          Experience real-time direct messaging, group collaboration, and clean architecture right now.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-zinc-100 px-6 py-3.5 text-sm sm:text-base font-semibold text-white dark:text-zinc-950 hover:bg-slate-800 dark:hover:bg-white transition-colors shadow-xs"
          >
            <span>{hasMounted && isAuthenticated ? 'Go to Chat' : 'Get Started Now'}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <a
            href="https://frontend-task-chatapp.onrender.com/docs/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-3.5 text-sm sm:text-base font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors shadow-xs"
          >
            <BookOpen className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
            <span>Swagger API Specs</span>
          </a>
        </div>
      </div>
    </section>
  );
};
