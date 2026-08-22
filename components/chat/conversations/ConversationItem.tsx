'use client';

import React from 'react';
import { Conversation, getConversationTitle } from '@/types/conversation';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
}

/**
 * Comfortable, production-ready conversation row in the sidebar.
 * Features readable typography, clear Group tags, and subtle active state.
 */
export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onSelect,
}) => {
  const { user: currentUser } = useAuth();
  const isGroup =
    conversation.type === 'group' ||
    (conversation.participants && conversation.participants.length > 2);

  // Determine conversation title dynamically for direct chats vs group chats
  const title = getConversationTitle(conversation, currentUser?._id);

  // Format timestamp (e.g., '10:45 AM' if today, otherwise 'Aug 22')
  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const lastMessageText = conversation.lastMessage?.text || 'No messages yet';
  const lastMessageTime = formatTime(
    conversation.lastMessage?.createdAt || conversation.updatedAt
  );

  return (
    <button
      onClick={() => onSelect(conversation._id)}
      className={`group relative w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-colors duration-100 cursor-pointer ${
        isActive
          ? 'bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-medium shadow-2xs'
          : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-zinc-100'
      }`}
    >
      {/* Active Left Indicator Bar */}
      {isActive && (
        <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-slate-900 dark:bg-zinc-100" />
      )}

      {/* Avatar with G badge only for group channels */}
      <div className="relative shrink-0">
        <Avatar name={title} isGroup={isGroup} size="md" />
        {isGroup && (
          <span
            className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold bg-indigo-600 text-white border-2 border-white dark:border-zinc-900 shadow-xs"
            title="Group Channel"
          >
            G
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1.5 mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`text-sm sm:text-[14.5px] truncate ${
                isActive
                  ? 'font-bold text-slate-900 dark:text-zinc-100'
                  : 'font-semibold text-slate-800 dark:text-zinc-200 group-hover:text-slate-900 dark:group-hover:text-zinc-100'
              }`}
            >
              {title}
            </span>
            {isGroup && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shrink-0 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                Group
              </span>
            )}
          </div>

          {lastMessageTime && (
            <span className="text-[11px] text-slate-400 dark:text-zinc-500 shrink-0 font-normal">
              {lastMessageTime}
            </span>
          )}
        </div>

        <p className="text-xs sm:text-[13px] text-slate-500 dark:text-zinc-400 truncate leading-relaxed">
          {lastMessageText}
        </p>
      </div>
    </button>
  );
};
