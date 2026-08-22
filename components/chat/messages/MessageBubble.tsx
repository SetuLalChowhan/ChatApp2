'use client';

import React from 'react';
import { Message } from '@/types/message';
import { useAuth } from '@/hooks/useAuth';
import { Check, Clock } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isGroup: boolean;
  senderName: string;
  isFirstInGroup?: boolean;
}

/**
 * Production-ready chat message bubble component.
 * Features natural consecutive message grouping, subtle delivery timestamps,
 * and high-contrast dual-mode bubble backgrounds.
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isGroup,
  senderName,
  isFirstInGroup = true,
}) => {
  const { user } = useAuth();

  const senderId =
    typeof message.sender === 'string'
      ? message.sender
      : message.sender?._id || '';

  const isOwn = senderId === user?._id || senderId === 'me';

  // Format message time (e.g. 10:42 AM)
  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const messageId = typeof message._id === 'string' ? message._id : '';
  const isOptimistic = messageId.startsWith('temp-');

  return (
    <div
      className={`flex flex-col ${
        isOwn ? 'items-end' : 'items-start'
      } group w-full select-text ${isFirstInGroup ? 'mt-2.5' : 'mt-0.5'}`}
    >
      {/* Show sender name only on the first message of a consecutive block in group chats */}
      {isGroup && !isOwn && isFirstInGroup && (
        <span className="mb-1 ml-1 text-[11px] font-semibold text-slate-600 dark:text-zinc-400">
          {senderName}
        </span>
      )}

      <div
        className={`relative max-w-[85%] sm:max-w-[70%] rounded-2xl px-3.5 py-2 shadow-2xs transition-colors duration-100 ${
          isOwn
            ? 'bg-sky-600 text-white rounded-br-xs'
            : 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-slate-200/90 dark:border-zinc-700/60 rounded-bl-xs'
        } ${isOptimistic ? 'opacity-70' : 'opacity-100'}`}
      >
        <p className="text-xs sm:text-sm whitespace-pre-wrap break-words leading-relaxed">
          {message.text}
        </p>

        {/* Message Timestamp and Delivery Status */}
        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[9px] select-none ${
            isOwn ? 'text-sky-100/80' : 'text-slate-400 dark:text-zinc-500'
          }`}
        >
          <span>{formatTime(message.createdAt)}</span>
          {isOwn && (
            <span>
              {isOptimistic ? (
                <Clock className="h-2.5 w-2.5 animate-pulse" />
              ) : (
                <Check className="h-2.5 w-2.5 stroke-[2.5]" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
