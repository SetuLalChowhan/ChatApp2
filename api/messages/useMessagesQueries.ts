import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from './messages.api';
import { Message, SendMessageRequest, MessageHistoryResponse } from '@/types/message';
import { CONVERSATION_QUERY_KEYS } from '../conversations/useConversationsQueries';

/**
 * Centralized Cache Keys for Message Threads
 */
export const MESSAGE_QUERY_KEYS = {
  byConversation: (conversationId: string | null) =>
    ['messages', conversationId] as const,
};

/**
 * Hook to retrieve message history for an active conversation.
 * Automatically polls every 3.5s as a fallback to guarantee zero missed messages.
 */
export const useGetMessagesQuery = (conversationId: string | null) => {
  return useQuery<MessageHistoryResponse, Error>({
    queryKey: MESSAGE_QUERY_KEYS.byConversation(conversationId),
    queryFn: () => {
      if (!conversationId) {
        return Promise.resolve({ messages: [], hasMore: false });
      }
      return messagesApi.getMessages(conversationId, 50);
    },
    enabled: !!conversationId,
    staleTime: 1000 * 5, // 5s fresh cache window
    refetchInterval: conversationId ? 3500 : false, // 3.5s active polling fallback
  });
};

/**
 * Hook to send a message.
 * Immediately appends confirmed message to the local TanStack cache
 * and updates conversations list ordering.
 */
export const useSendMessageMutation = (conversationId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation<Message, Error, SendMessageRequest>({
    mutationFn: (data: SendMessageRequest) => messagesApi.sendMessage(data),
    onSuccess: (newMessage) => {
      // Append confirmed message directly into TanStack cache
      queryClient.setQueryData<MessageHistoryResponse>(
        MESSAGE_QUERY_KEYS.byConversation(conversationId),
        (old) => {
          if (!old) return { messages: [newMessage], hasMore: false };
          const exists = old.messages.some((m) => m._id === newMessage._id);
          if (exists) return old;
          return {
            ...old,
            messages: [...old.messages, newMessage],
          };
        }
      );

      // Invalidate conversations list to bump active chat to top with new snippet
      queryClient.invalidateQueries({ queryKey: CONVERSATION_QUERY_KEYS.all });
    },
  });
};
