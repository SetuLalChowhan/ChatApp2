'use client';

import React from 'react';
import { ArrowDown } from 'lucide-react';

interface NewMessageBadgeProps {
  visible: boolean;
  onClick: () => void;
}

/**
 * Floating badge indicating unread messages when the user is scrolled up.
 * Clicking smoothly scrolls the viewport to the newest message.
 */
export const NewMessageBadge: React.FC<NewMessageBadgeProps> = ({
  visible,
  onClick,
}) => {
  if (!visible) return null;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 animate-bounce">
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 rounded-full bg-sky-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg hover:bg-sky-500 transition-all cursor-pointer select-none"
        aria-label="Scroll to new messages"
      >
        <ArrowDown className="h-3.5 w-3.5 stroke-[2.5]" />
        <span>New messages</span>
      </button>
    </div>
  );
};
