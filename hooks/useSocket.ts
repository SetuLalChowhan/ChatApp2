'use client';

import { useEffect, useRef } from 'react';
import { getSocket } from '@/lib/socket';
import { useAuth } from './useAuth';
import { Message } from '@/types/message';

interface SocketEvents {
  onNewMessage?: (message: Message) => void;
  onConversationUpdated?: (data: any) => void;
}

export const useSocket = ({ onNewMessage, onConversationUpdated }: SocketEvents = {}) => {
  const { token, isAuthenticated } = useAuth();
  const onNewMessageRef = useRef(onNewMessage);
  const onConversationUpdatedRef = useRef(onConversationUpdated);

  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
    onConversationUpdatedRef.current = onConversationUpdated;
  }, [onNewMessage, onConversationUpdated]);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const socket = getSocket(token);
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      if (onNewMessageRef.current) {
        onNewMessageRef.current(message);
      }
    };

    const handleConversationUpdated = (data: any) => {
      if (onConversationUpdatedRef.current) {
        onConversationUpdatedRef.current(data);
      }
    };

    socket.on('message:new', handleNewMessage);
    socket.on('conversation:updated', handleConversationUpdated);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('conversation:updated', handleConversationUpdated);
    };
  }, [isAuthenticated, token]);
};
