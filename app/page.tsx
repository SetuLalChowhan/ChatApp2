'use client';

import React, { useState, useEffect } from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { InteractiveDemoSection } from '@/components/landing/InteractiveDemoSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { ArchitectureSection } from '@/components/landing/ArchitectureSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CtaSection } from '@/components/landing/CtaSection';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { UserDropdown } from '@/components/ui/UserDropdown';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

/**
 * Public Creative Landing Page for Part 2.
 * Hand-crafted, minimal, production-ready marketing showcase for the Chat Application.
 */
export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);

  // Client hydration check to prevent SSR authentication flashes
  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col selection:bg-sky-500/20 selection:text-sky-500 dark:selection:text-sky-300 transition-colors duration-150">
      {/* Top Minimal Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-150">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-slate-900 dark:text-zinc-100 font-bold tracking-tight text-base hover:opacity-85 transition-opacity"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-xs">
              <MessageSquare className="h-4 w-4" />
            </div>
            <span>Chat</span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle size="md" />

            {/* Dynamic Auth Header */}
            {!hasMounted ? (
              <div className="h-9 w-9 rounded-full" />
            ) : isAuthenticated ? (
              <UserDropdown />
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="text-xs sm:text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors px-3 py-1.5"
                >
                  Sign In
                </Link>
                <Link
                  href="/chat"
                  className="rounded-xl bg-slate-900 dark:bg-zinc-100 px-4 py-2 text-xs sm:text-sm font-semibold text-white dark:text-zinc-950 hover:bg-slate-800 dark:hover:bg-white transition-colors shadow-xs"
                >
                  Open App
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Creative Bonus: Interactive Live Playground */}
        <InteractiveDemoSection />

        {/* 3. How It Works (3 Clear Steps) */}
        <HowItWorksSection />

        {/* 4. Engineering & Architecture Highlights */}
        <ArchitectureSection />

        {/* 5. Core Feature Capabilities */}
        <FeaturesSection />

        {/* 6. Call to Action */}
        <CtaSection />
      </main>

      {/* 7. Minimal Footer */}
      <LandingFooter />
    </div>
  );
}
