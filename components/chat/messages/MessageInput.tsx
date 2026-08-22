'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (text: string) => Promise<void>;
  isSending: boolean;
  disabled?: boolean;
}

/**
 * Message composer input at the bottom of the chat pane.
 * Features auto-expanding multiline textarea, Enter-to-send (with Shift+Enter for newlines),
 * and dynamic send loading indicator.
 */
export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isSending,
  disabled = false,
}) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize textarea height to accommodate multiline text up to 140px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [text]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSending || disabled) return;

    try {
      await onSendMessage(trimmed);
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.focus();
      }
    } catch {
      // Error is caught and surfaced in the mutation hook
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isValid = text.trim().length > 0;

  return (
    <div className="border-t border-slate-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 p-3 sm:p-4 backdrop-blur-xs shrink-0 transition-colors duration-150">
      <div className="flex items-end gap-2 rounded-2xl bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 p-1.5 px-3 focus-within:border-sky-500 dark:focus-within:border-zinc-600 transition-colors">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Press Enter to send, Shift+Enter for new line)"
          disabled={disabled || isSending}
          rows={1}
          className="flex-1 max-h-32 min-h-6 resize-none bg-transparent py-1.5 text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none disabled:opacity-50 leading-relaxed custom-scrollbar"
        />

        <button
          onClick={handleSend}
          disabled={!isValid || isSending || disabled}
          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-150 shrink-0 cursor-pointer ${
            isValid && !isSending
              ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs'
              : 'bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 cursor-not-allowed opacity-60'
          }`}
          aria-label="Send message"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};
