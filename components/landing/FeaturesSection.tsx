'use client';

import React from 'react';
import { Zap, Users, ArrowDownCircle, ShieldCheck, Search, MessageSquare } from 'lucide-react';

/**
 * Clean architectural feature grid with generous typography and spacing.
 */
export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Real-Time Sync',
      description:
        'Bi-directional WebSocket delivery paired with background polling for zero missed messages.',
    },
    {
      icon: Users,
      title: 'Direct & Group Chats',
      description:
        'Seamless 1-to-1 conversations and multi-member group discussions with admin controls.',
    },
    {
      icon: ArrowDownCircle,
      title: 'Smart Auto-Scroll',
      description:
        'Anchors scroll position when reading history and reveals a subtle new message indicator.',
    },
    {
      icon: Search,
      title: 'Debounced User Search',
      description:
        'Instant user lookup by name or phone with automated TanStack Query caching.',
    },
    {
      icon: ShieldCheck,
      title: 'Direct Authentication',
      description:
        'Automatic account registration and JWT session restoration stored securely in client storage.',
    },
    {
      icon: MessageSquare,
      title: 'Modern Architecture',
      description:
        'Built with Next.js App Router, TanStack Query, React Hook Form, and Tailwind CSS.',
    },
  ];

  return (
    <section className="py-20 md:py-28 border-t border-slate-200/80 dark:border-zinc-900 bg-white/50 dark:bg-zinc-950/50 transition-colors duration-150">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="max-w-2xl mb-16 space-y-3.5">
          <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100 leading-[1.28] sm:leading-[1.22]">
            Engineered for clarity and speed.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed font-normal pt-0.5">
            Every feature is purpose-built to provide a responsive, distraction-free messaging experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 mb-4 border border-slate-200/80 dark:border-zinc-700/60 shadow-2xs">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-[14.5px] text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
