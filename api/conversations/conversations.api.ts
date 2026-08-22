import apiClient from '@/lib/api-client';
import {
  Conversation,
  StartConversationRequest,
  CreateGroupRequest,
  AddParticipantsRequest,
  PromoteAdminRequest,
  RenameGroupRequest,
} from '@/types/conversation';

/**
 * Conversations REST API Service
 * 
 * Manages 1-to-1 direct chats, group creations, and all group admin features:
 * (adding members, kicking members, leaving groups, promoting admins, renaming groups).
 */
export const conversationsApi = {
  /**
   * Fetch all active conversations for the authenticated user.
   * Handles both `{ data: [...] }` envelope and direct array formats.
   */
  getConversations: async (): Promise<Conversation[]> => {
    const response = await apiClient.get<any>('/conversations');
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  /**
   * Start or open an existing 1-to-1 conversation with a specific user.
   */
  startConversation: async (data: StartConversationRequest): Promise<Conversation> => {
    const response = await apiClient.post<Conversation>('/conversations', data);
    return response.data;
  },

  /**
   * Create a new group conversation with a group name and initial participants.
   * Note: The backend requires at least 2 participants (3 members total including creator).
   */
  createGroup: async (data: CreateGroupRequest): Promise<Conversation> => {
    const response = await apiClient.post<Conversation>('/conversations/group', data);
    return response.data;
  },

  /**
   * Add one or more participants to an existing group (Admins only).
   */
  addParticipants: async (conversationId: string, data: AddParticipantsRequest): Promise<any> => {
    const response = await apiClient.post(`/conversations/${conversationId}/participants`, data);
    return response.data;
  },

  /**
   * Remove a member from a group (Admins only), or leave the group by passing your own userId.
   */
  removeParticipantOrLeave: async (conversationId: string, userId: string): Promise<any> => {
    const response = await apiClient.delete(`/conversations/${conversationId}/participants/${userId}`);
    return response.data;
  },

  /**
   * Promote an existing group member to group admin (Admins only).
   */
  promoteAdmin: async (conversationId: string, data: PromoteAdminRequest): Promise<any> => {
    const response = await apiClient.post(`/conversations/${conversationId}/admins`, data);
    return response.data;
  },

  /**
   * Rename a group conversation (Admins only).
   */
  renameGroup: async (conversationId: string, data: RenameGroupRequest): Promise<any> => {
    const response = await apiClient.patch(`/conversations/${conversationId}`, data);
    return response.data;
  },
};
