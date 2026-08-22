'use client';

import React from 'react';
import { UserCheck, Users, Radio } from 'lucide-react';

/**
 * How It Works Section.
 * 3 concise steps explaining the core workflow with generous typography, leading, and spacing.
 */
export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: UserCheck,
      title: 'Instant Sign In & Registration',
      description:
        'Log in or auto-register using only your phone number and name. JWT sessions are cached locally and validated seamlessly in the background.',
    },
    {
      number: '02',
      icon: Users,
      title: 'Direct & Group Collaboration',
      description:
        'Search any teammate by name or phone, or assemble a team group. Manage roles, rename channels, promote admins, or leave groups at any time.',
    },
    {
      number: '03',
      icon: Radio,
      title: 'Live WebSocket Delivery',
      description:
        'Messages broadcast instantly over Socket.io connections with automatic REST polling fallback and smart auto-scrolling that tracks your view.',
    },
  ];

  return (
    <section className="py-20 md:py-28 border-t border-slate-200/80 dark:border-zinc-900 bg-slate-50/60 dark:bg-zinc-950/60 transition-colors duration-150">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="max-w-2xl mb-16 space-y-3.5">
          <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100 leading-[1.28] sm:leading-[1.22]">
            How it works in three simple steps.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed pt-0.5">
            From seamless sign-in to real-time group conversations with zero friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-700/60 shadow-2xs">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-base font-bold text-slate-400 dark:text-zinc-500">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 mb-2.5 leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-sm sm:text-[15px] text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
