import apiClient from '@/lib/api-client';
import { Message, SendMessageRequest, MessageHistoryResponse } from '@/types/message';

/**
 * Messages REST API Service
 * 
 * Handles fetching paginated historical messages for a conversation
 * and posting new outgoing messages.
 */
export const messagesApi = {
  /**
   * Fetch paginated message history for a specific conversation.
   * Supports `limit` and cursor-based `before` parameters.
   */
  getMessages: async (
    conversationId: string,
    limit: number = 50,
    before?: string
  ): Promise<MessageHistoryResponse> => {
    const response = await apiClient.get<any>(`/conversations/${conversationId}/messages`, {
      params: {
        limit,
        ...(before ? { before } : {}),
      },
    });

    if (response.data && Array.isArray(response.data.messages)) {
      return response.data;
    }
    if (Array.isArray(response.data)) {
      return {
        messages: response.data,
        hasMore: false,
      };
    }
    return {
      messages: [],
      hasMore: false,
    };
  },

  /**
   * Send a new message to a conversation.
   */
  sendMessage: async (data: SendMessageRequest): Promise<Message> => {
    const response = await apiClient.post<Message>('/messages', data);
    return response.data;
  },
};
