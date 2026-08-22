'use client';

import { useState, useCallback } from 'react';
import { Conversation, CreateGroupRequest } from '@/types/conversation';
import { useAuth } from './useAuth';
import { Message } from '@/types/message';
import {
  useGetConversationsQuery,
  useStartConversationMutation,
  useCreateGroupMutation,
  CONVERSATION_QUERY_KEYS,
} from '@/api/conversations/useConversationsQueries';
import { useQueryClient } from '@tanstack/react-query';

export const useConversations = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // TanStack Query for conversations caching & polling
  const {
    data: conversations = [],
    isLoading,
    error,
    refetch,
  } = useGetConversationsQuery(isAuthenticated);

  const startMutation = useStartConversationMutation();
  const createGroupMutation = useCreateGroupMutation();

  // Start 1-to-1 conversation
  const startDirectConversation = useCallback(
    async (userId: string): Promise<Conversation> => {
      const conv = await startMutation.mutateAsync({ userId });
      setActiveConversationId(conv._id);
      return conv;
    },
    [startMutation]
  );

  // Create Group conversation
  const createGroupConversation = useCallback(
    async (data: CreateGroupRequest): Promise<Conversation> => {
      const group = await createGroupMutation.mutateAsync(data);
      setActiveConversationId(group._id);
      return group;
    },
    [createGroupMutation]
  );

  // Update conversation on new message in TanStack cache
  const handleNewMessageUpdate = useCallback(
    (message: Message) => {
      const convId =
        typeof message.conversation === 'string'
          ? message.conversation
          : (message.conversation as any)?._id;

      const senderId =
        typeof message.sender === 'string' ? message.sender : message.sender?._id;

      queryClient.setQueryData<Conversation[]>(
        CONVERSATION_QUERY_KEYS.all,
        (prev = []) => {
          const index = prev.findIndex((c) => c._id === convId);
          if (index !== -1) {
            const updatedConv: Conversation = {
              ...prev[index],
              lastMessage: {
                text: message.text,
                sender: senderId,
                createdAt: message.createdAt,
              },
              updatedAt: message.createdAt,
            };
            const rest = prev.filter((_, i) => i !== index);
            return [updatedConv, ...rest];
          }
          return prev;
        }
      );
    },
    [queryClient]
  );

  const activeConversation = conversations.find((c) => c._id === activeConversationId) || null;

  return {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    isLoading,
    error: error ? error.message : null,
    refetch,
    startDirectConversation,
    createGroupConversation,
    handleNewMessageUpdate,
  };
};
