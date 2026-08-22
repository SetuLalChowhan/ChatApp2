'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar';
import Link from 'next/link';
import { MessageSquare, LogOut } from 'lucide-react';

/**
 * User Avatar Dropdown powered by official Shadcn DropdownMenu primitives.
 * Sized comfortably with readable typography.
 */
export const UserDropdown: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-sky-500 transition-transform active:scale-95 cursor-pointer"
          aria-label="User menu"
        >
          <Avatar name={user.name} size="md" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-56 p-2 rounded-2xl shadow-xl">
        {/* User Info Label */}
        <DropdownMenuLabel className="font-normal px-3 py-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">
              {user.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">
              {user.phone}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1.5" />

        {/* Links */}
        <DropdownMenuItem asChild>
          <Link
            href="/chat"
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-zinc-300 rounded-xl cursor-pointer"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Open Chat</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1.5" />

        <DropdownMenuItem
          onClick={logout}
          className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400 focus:bg-rose-50 dark:focus:bg-rose-500/10 focus:text-rose-700 dark:focus:text-rose-300 rounded-xl cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
