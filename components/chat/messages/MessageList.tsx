'use client';

import React, { useEffect, useMemo } from 'react';
import { Message } from '@/types/message';
import { Conversation } from '@/types/conversation';
import { MessageBubble } from './MessageBubble';
import { NewMessageBadge } from './NewMessageBadge';
import { MessageSkeleton } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { MessageSquareDashed } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface MessageListProps {
  messages: Message[];
  conversation: Conversation | null;
  isLoading: boolean;
}

/**
 * MessageList renders the active conversation's message history.
 * Automatically groups consecutive messages from the same sender,
 * renders date headers, and handles smart auto-scrolling.
 */
export const MessageList: React.FC<MessageListProps> = ({
  messages,
  conversation,
  isLoading,
}) => {
  const { user } = useAuth();
  const {
    containerRef,
    hasNewUnseenMessages,
    handleScroll,
    scrollToBottom,
    onMessagesChange,
  } = useAutoScroll<HTMLDivElement>();

  const isGroup = Boolean(
    conversation?.type === 'group' ||
      (conversation?.participants && conversation.participants.length > 2)
  );

  // Map participant IDs to user names for group and direct chats
  const participantMap = useMemo(() => {
    const map = new Map<string, string>();
    if (
      conversation?.participant &&
      typeof conversation.participant !== 'string' &&
      conversation.participant._id
    ) {
      map.set(
        conversation.participant._id,
        conversation.participant.name || conversation.participant.phone
      );
    }
    conversation?.participants?.forEach((p) => {
      if (typeof p !== 'string' && p._id) {
        map.set(p._id, p.name || p.phone);
      }
    });
    return map;
  }, [conversation]);

  // Trigger intelligent auto-scroll whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      const senderId =
        typeof lastMsg.sender === 'string'
          ? lastMsg.sender
          : lastMsg.sender?._id;
      const isOwn = senderId === user?._id || senderId === 'me';
      onMessagesChange(isOwn);
    }
  }, [messages, onMessagesChange, user]);

  if (isLoading) {
    return (
      <div className="relative flex-1 min-h-0 bg-slate-50 dark:bg-zinc-950 transition-colors duration-150">
        <MessageSkeleton />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          icon={MessageSquareDashed}
          title="No messages yet"
          description="Send the first message to start the conversation."
        />
      </div>
    );
  }

  // Format date divider helper
  const formatDateHeader = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      if (isToday) return 'Today';

      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday =
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

      if (isYesterday) return 'Yesterday';

      return date.toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="relative flex-1 min-h-0 bg-slate-50 dark:bg-zinc-950 transition-colors duration-150">
      {/* Scrollable message container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto p-4 sm:p-6 custom-scrollbar"
      >
        {messages.map((msg, index) => {
          const prevMsg = index > 0 ? messages[index - 1] : null;
          const currentDateStr = msg?.createdAt ? new Date(msg.createdAt).toDateString() : '';
          const prevDateStr = prevMsg?.createdAt
            ? new Date(prevMsg.createdAt).toDateString()
            : null;
          const showDateHeader = !!currentDateStr && currentDateStr !== prevDateStr;

          const senderId =
            typeof msg?.sender === 'string'
              ? msg.sender
              : msg?.sender?._id || '';

          const prevSenderId = prevMsg
            ? typeof prevMsg?.sender === 'string'
              ? prevMsg.sender
              : prevMsg?.sender?._id || ''
            : null;

          // Check if message should group with previous message
          const timeDiff =
            msg.createdAt && prevMsg?.createdAt
              ? new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime()
              : Infinity;

          const isFirstInGroup =
            index === 0 ||
            showDateHeader ||
            senderId !== prevSenderId ||
            timeDiff > 5 * 60 * 1000; // > 5 minutes

          const senderName =
            typeof msg?.sender !== 'string' && msg?.sender?.name
              ? msg.sender.name
              : participantMap.get(senderId) || 'User';

          return (
            <React.Fragment key={msg?._id || (msg as any)?.id || index}>
              {showDateHeader && (
                <div className="flex items-center justify-center my-4">
                  <span className="rounded-full bg-slate-200/80 dark:bg-zinc-800/80 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-400 border border-slate-300/80 dark:border-zinc-700/50 select-none shadow-2xs">
                    {formatDateHeader(msg.createdAt)}
                  </span>
                </div>
              )}

              <MessageBubble
                message={msg}
                isGroup={isGroup}
                senderName={senderName}
                isFirstInGroup={isFirstInGroup}
              />
            </React.Fragment>
          );
        })}
      </div>

      {/* Floating "New Messages" Badge when user is scrolled up */}
      <NewMessageBadge
        visible={hasNewUnseenMessages}
        onClick={() => scrollToBottom({ smooth: true })}
      />
    </div>
  );
};
