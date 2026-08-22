'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Play } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

/**
 * High-quality, human-crafted Hero Section.
 * Aligns strictly with the dashboard design system, typography, and color palette.
 */
export const HeroSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const scrollToDemo = () => {
    document.getElementById('interactive-demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-16 pb-16 md:pt-24 md:pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 px-3 py-1 text-xs font-medium text-slate-700 dark:text-zinc-300 shadow-xs mb-6 backdrop-blur-xs">
          <span className="flex h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
          <span>Real-Time WebSocket Messaging</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100 sm:text-5xl lg:text-6xl max-w-3xl mx-auto leading-[1.28] sm:leading-[1.2] lg:leading-[1.16]">
          A cleaner way to talk with your team.
        </h1>

        {/* Description */}
        <p className="mt-5 max-w-xl mx-auto text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
          Instant 1-to-1 direct messaging and multi-user group channels with admin controls, powered by bi-directional WebSockets, TanStack Query caching, and smart auto-scrolling.
        </p>

        {/* CTA Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-zinc-100 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white dark:text-zinc-950 hover:bg-slate-800 dark:hover:bg-white transition-colors shadow-xs"
          >
            <span>{hasMounted && isAuthenticated ? 'Go to Chat' : 'Open Application'}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            onClick={scrollToDemo}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors shadow-xs cursor-pointer"
          >
            <Play className="h-3.5 w-3.5 fill-current text-slate-600 dark:text-zinc-400" />
            <span>Try Live Preview</span>
          </button>
        </div>

        {/* Authentic Product UI Showcase */}
        <div className="mt-14 mx-auto max-w-4xl rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden text-left transition-colors duration-150">
          {/* Mock Window Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 px-4 py-3 bg-slate-50 dark:bg-zinc-950/60">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-zinc-700" />
              <div className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-zinc-700" />
              <div className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-zinc-700" />
              <span className="ml-2 text-xs font-medium text-slate-500 dark:text-zinc-400">
                Engineering & Design Group
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 font-medium">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span>Socket Connected</span>
            </div>
          </div>

          {/* Chat Canvas Preview */}
          <div className="p-4 sm:p-6 space-y-4 bg-slate-50/40 dark:bg-zinc-950/40 min-h-64 flex flex-col justify-end">
            {/* Incoming Bubble 1 */}
            <div className="flex flex-col items-start max-w-[85%] sm:max-w-[70%]">
              <span className="mb-1 ml-1 text-[11px] font-semibold text-slate-600 dark:text-zinc-400">
                Ada Lovelace
              </span>
              <div className="rounded-2xl rounded-tl-xs bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/60 p-3 text-xs sm:text-sm text-slate-900 dark:text-zinc-100 shadow-xs leading-relaxed">
                Just reviewed the Swagger spec. The group creation endpoint requires at least 2 participants.
              </div>
              <span className="mt-1 ml-1 text-[10px] text-slate-400 dark:text-zinc-400">10:42 AM</span>
            </div>

            {/* Outgoing Bubble 2 */}
            <div className="flex flex-col items-end w-full">
              <div className="rounded-2xl rounded-tr-xs bg-sky-600 p-3 text-xs sm:text-sm text-white max-w-[85%] sm:max-w-[70%] shadow-xs leading-relaxed text-left">
                Updated the group modal with validation and TanStack Query optimistic cache invalidation.
              </div>
              <div className="mt-1 mr-1 flex items-center gap-1 text-[10px] text-slate-400 dark:text-zinc-400">
                <span>10:43 AM</span>
                <Check className="h-3 w-3 text-sky-500" />
              </div>
            </div>

            {/* Incoming Bubble 3 */}
            <div className="flex flex-col items-start max-w-[85%] sm:max-w-[70%]">
              <span className="mb-1 ml-1 text-[11px] font-semibold text-slate-600 dark:text-zinc-400">
                Alex Mercer
              </span>
              <div className="rounded-2xl rounded-tl-xs bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/60 p-3 text-xs sm:text-sm text-slate-900 dark:text-zinc-100 shadow-xs leading-relaxed">
                Tested member promotion to admin and dynamic title resolution for direct chats. Super fast!
              </div>
              <span className="mt-1 ml-1 text-[10px] text-slate-400 dark:text-zinc-400">10:45 AM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
