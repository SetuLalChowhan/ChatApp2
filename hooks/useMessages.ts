'use client';

import { useCallback, useRef } from 'react';
import { Message, MessageHistoryResponse } from '@/types/message';
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  MESSAGE_QUERY_KEYS,
} from '@/api/messages/useMessagesQueries';
import { useQueryClient } from '@tanstack/react-query';

export const useMessages = (conversationId: string | null) => {
  const queryClient = useQueryClient();
  const activeConversationIdRef = useRef<string | null>(conversationId);
  activeConversationIdRef.current = conversationId;

  // TanStack Query for messages list
  const {
    data: messageData = { messages: [], hasMore: false },
    isLoading,
    error,
    refetch,
  } = useGetMessagesQuery(conversationId);

  const sendMutation = useSendMessageMutation(conversationId);

  // Send message using TanStack Query mutation
  const sendMessage = useCallback(
    async (text: string): Promise<Message | null> => {
      if (!conversationId || !text.trim() || sendMutation.isPending) return null;

      const trimmedText = text.trim();
      return await sendMutation.mutateAsync({
        conversationId,
        text: trimmedText,
      });
    },
    [conversationId, sendMutation]
  );

  // Incoming socket message handler updating TanStack cache directly
  const handleIncomingMessage = useCallback(
    (newMsg: Message) => {
      const msgConvId =
        typeof newMsg.conversation === 'string'
          ? newMsg.conversation
          : (newMsg.conversation as any)?._id;

      if (msgConvId) {
        queryClient.setQueryData<MessageHistoryResponse>(
          MESSAGE_QUERY_KEYS.byConversation(msgConvId),
          (prev) => {
            if (!prev) return { messages: [newMsg], hasMore: false };
            const newId = newMsg._id || (newMsg as any).id;
            if (newId && prev.messages.some((m) => (m._id || (m as any).id) === newId)) {
              return prev;
            }
            return {
              ...prev,
              messages: [...prev.messages, newMsg],
            };
          }
        );
      }
    },
    [queryClient]
  );

  // Ensure chronological sort
  const messages = [...messageData.messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return {
    messages,
    isLoading,
    isSending: sendMutation.isPending,
    error: error ? error.message : null,
    hasMore: messageData.hasMore,
    sendMessage,
    handleIncomingMessage,
    refetch,
  };
};
