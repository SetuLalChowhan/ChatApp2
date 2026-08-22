'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface UseAutoScrollOptions {
  threshold?: number;
}

export const useAutoScroll = <T extends HTMLElement = HTMLDivElement>({
  threshold = 120,
}: UseAutoScrollOptions = {}) => {
  const containerRef = useRef<T | null>(null);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);
  const [hasNewUnseenMessages, setHasNewUnseenMessages] = useState<boolean>(false);
  const isAtBottomRef = useRef<boolean>(true);

  // Check scroll position
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = distanceFromBottom <= threshold;

    setIsAtBottom(atBottom);
    isAtBottomRef.current = atBottom;

    if (atBottom) {
      setHasNewUnseenMessages(false);
    }
  }, [threshold]);

  const scrollToBottom = useCallback((options?: { smooth?: boolean; force?: boolean }) => {
    const el = containerRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: options?.smooth ? 'smooth' : 'auto',
    });
    setHasNewUnseenMessages(false);
    setIsAtBottom(true);
    isAtBottomRef.current = true;
  }, []);

  // Handler called whenever messages array changes
  const onMessagesChange = useCallback(
    (isOwnMessage: boolean = false) => {
      if (isOwnMessage || isAtBottomRef.current) {
        // Immediate or smooth scroll if user sent it or is at bottom
        scrollToBottom({ smooth: true });
      } else {
        // User is reading older messages
        setHasNewUnseenMessages(true);
      }
    },
    [scrollToBottom]
  );

  return {
    containerRef,
    isAtBottom,
    hasNewUnseenMessages,
    handleScroll,
    scrollToBottom,
    onMessagesChange,
  };
};
