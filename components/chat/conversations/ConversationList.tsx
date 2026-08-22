'use client';

import React, { useState, useMemo } from 'react';
import { Conversation, getConversationTitle } from '@/types/conversation';
import { ConversationItem } from './ConversationItem';
import { ConversationSkeleton } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { UserDropdown } from '@/components/ui/UserDropdown';
import Link from 'next/link';
import {
  MessageSquarePlus,
  Users,
  Search,
  MessagesSquare,
  MessageSquare,
} from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  isLoading: boolean;
  error: string | null;
  onSelect: (id: string) => void;
  onOpenNewDirect: () => void;
  onOpenNewGroup: () => void;
  onRetry: () => void;
}

type FilterTab = 'all' | 'direct' | 'groups';

/**
 * Production-ready Sidebar component displaying active conversations.
 * Sized comfortably for desktop and mobile with readable typography and segmented filter tabs.
 */
export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeId,
  isLoading,
  error,
  onSelect,
  onOpenNewDirect,
  onOpenNewGroup,
  onRetry,
}) => {
  const { user } = useAuth();
  const [filterQuery, setFilterQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  // Filter conversations locally by tab and search query
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const isGroup =
        c.type === 'group' || (c.participants && c.participants.length > 2);

      // Tab filter
      if (activeTab === 'direct' && isGroup) return false;
      if (activeTab === 'groups' && !isGroup) return false;

      // Text query filter
      if (!filterQuery.trim()) return true;
      const q = filterQuery.toLowerCase();
      const title = getConversationTitle(c, user?._id).toLowerCase();
      const matchName = title.includes(q);
      const matchParticipant =
        (typeof c.participant !== 'string' &&
          (c.participant?.name?.toLowerCase().includes(q) ||
            c.participant?.phone?.toLowerCase().includes(q))) ||
        c.participants?.some((p) => {
          if (typeof p === 'string') return false;
          return p.name?.toLowerCase().includes(q) || p.phone?.toLowerCase().includes(q);
        });
      const matchMessage = c.lastMessage?.text?.toLowerCase().includes(q);
      return matchName || matchParticipant || matchMessage;
    });
  }, [conversations, filterQuery, activeTab, user?._id]);

  const groupCount = useMemo(
    () =>
      conversations.filter(
        (c) => c.type === 'group' || (c.participants && c.participants.length > 2)
      ).length,
    [conversations]
  );
  const directCount = conversations.length - groupCount;

  return (
    <div className="flex h-full flex-col bg-white dark:bg-zinc-900 border-r border-slate-200/90 dark:border-zinc-800/80 transition-colors duration-150 select-none">
      {/* Sidebar Top Header */}
      <div className="p-4 border-b border-slate-200/80 dark:border-zinc-800/80 shrink-0 space-y-3.5">
        {/* Brand Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-85 transition-opacity"
            title="Go to Home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-xs">
              <MessageSquare className="h-4 w-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              Chats
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewDirect}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              title="New Direct Message"
              aria-label="New Direct Message"
            >
              <MessageSquarePlus className="h-4 w-4" />
            </button>
            <button
              onClick={onOpenNewGroup}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              title="Create New Group"
              aria-label="Create New Group"
            >
              <Users className="h-4 w-4" />
            </button>
            <ThemeToggle size="sm" />
            <UserDropdown />
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages & contacts..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/60 pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:border-slate-400 dark:focus:border-zinc-600 focus:outline-none transition-colors"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-zinc-500 pointer-events-none" />
        </div>

        {/* Segmented Filter Tabs: All, Direct, Groups */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-zinc-950/60 border border-slate-200/80 dark:border-zinc-800/80 gap-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            <span>All</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'all'
                  ? 'bg-slate-100 dark:bg-zinc-700 text-slate-900 dark:text-zinc-100'
                  : 'bg-slate-200/80 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
              }`}
            >
              {conversations.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'direct'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            <span>Direct</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'direct'
                  ? 'bg-slate-100 dark:bg-zinc-700 text-slate-900 dark:text-zinc-100'
                  : 'bg-slate-200/80 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
              }`}
            >
              {directCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'groups'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            <span>Groups</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'groups'
                  ? 'bg-slate-100 dark:bg-zinc-700 text-slate-900 dark:text-zinc-100'
                  : 'bg-slate-200/80 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
              }`}
            >
              {groupCount}
            </span>
          </button>
        </div>
      </div>

      {/* Conversations Scrollable List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1 custom-scrollbar">
        {isLoading && conversations.length === 0 ? (
          <ConversationSkeleton count={6} />
        ) : error ? (
          <ErrorState title="Failed to load chats" message={error} onRetry={onRetry} />
        ) : filteredConversations.length === 0 ? (
          <div className="py-10">
            <EmptyState
              title={
                filterQuery
                  ? 'No results found'
                  : activeTab === 'groups'
                  ? 'No group channels yet'
                  : activeTab === 'direct'
                  ? 'No direct messages yet'
                  : 'No conversations yet'
              }
              description={
                filterQuery
                  ? `No conversations match "${filterQuery}"`
                  : activeTab === 'groups'
                  ? 'Create a group to collaborate with multiple teammates in a shared channel.'
                  : activeTab === 'direct'
                  ? 'Search for a teammate by name or phone number to start a 1-to-1 conversation.'
                  : 'Start a 1-to-1 conversation or create a group to begin messaging.'
              }
              icon={
                activeTab === 'groups' ? (
                  <Users className="h-5 w-5 stroke-[1.5] text-indigo-600 dark:text-indigo-400" />
                ) : activeTab === 'direct' ? (
                  <MessageSquarePlus className="h-5 w-5 stroke-[1.5] text-sky-600 dark:text-sky-400" />
                ) : (
                  <MessagesSquare className="h-5 w-5 stroke-[1.5]" />
                )
              }
            >
              {!filterQuery && (
                <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-2 w-full max-w-xs">
                  {activeTab === 'groups' ? (
                    <button
                      onClick={onOpenNewGroup}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-950 px-4 py-2 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-white transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                    >
                      <Users className="h-3.5 w-3.5 text-indigo-400 dark:text-indigo-600" />
                      <span>Create Group</span>
                    </button>
                  ) : activeTab === 'direct' ? (
                    <button
                      onClick={onOpenNewDirect}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-950 px-4 py-2 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-white transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                    >
                      <MessageSquarePlus className="h-3.5 w-3.5 text-sky-400 dark:text-sky-600" />
                      <span>New Direct Message</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={onOpenNewDirect}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-950 px-3.5 py-2 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-white transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                      >
                        <MessageSquarePlus className="h-3.5 w-3.5" />
                        <span>New Chat</span>
                      </button>
                      <button
                        onClick={onOpenNewGroup}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700/60 px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                      >
                        <Users className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>Create Group</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </EmptyState>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <ConversationItem
              key={conv._id}
              conversation={conv}
              isActive={conv._id === activeId}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};
