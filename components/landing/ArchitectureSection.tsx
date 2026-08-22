'use client';

import React from 'react';
import { Layers, Database, ShieldAlert, Cpu } from 'lucide-react';

/**
 * Architecture & Engineering Highlights Section.
 * Demonstrates frontend technical craftsmanship with generous typography scale and spacing.
 */
export const ArchitectureSection: React.FC = () => {
  const points = [
    {
      title: 'TanStack Query State Architecture',
      description:
        'Feature-based query & mutation hooks with background garbage collection, stale time invalidation, and optimistic cache updates.',
      icon: Database,
    },
    {
      title: 'Socket.io & Polling Fallback',
      description:
        'Bi-directional WebSocket streaming on root origin with automated 3.5s/10s polling heartbeat for resilience against network drops.',
      icon: Layers,
    },
    {
      title: 'React Hook Form Validation',
      description:
        'Performant form handling and validation for login and group creation with detailed API error toast resolution.',
      icon: ShieldAlert,
    },
    {
      title: 'Radix UI Accessible Primitives',
      description:
        'Modal dialogs and user dropdown menus built with Radix UI ensuring keyboard navigation, focus trapping, and zero layout shift.',
      icon: Cpu,
    },
  ];

  return (
    <section className="py-20 md:py-28 border-t border-slate-200/80 dark:border-zinc-900 bg-white dark:bg-zinc-900/40 transition-colors duration-150">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="max-w-2xl mb-16 space-y-3.5">
          <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Technical Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100 leading-[1.28] sm:leading-[1.22]">
            Built with modern engineering standards.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed pt-0.5">
            Strict separation of concerns across data queries, UI state hooks, and feature components.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/60 p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-700/60 shadow-2xs">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 leading-snug">
                    {pt.title}
                  </h3>
                </div>
                <p className="text-sm sm:text-[15px] text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
                  {pt.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
