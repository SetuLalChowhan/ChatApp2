import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { conversationsApi } from './conversations.api';
import {
  Conversation,
  StartConversationRequest,
  CreateGroupRequest,
  AddParticipantsRequest,
  PromoteAdminRequest,
  RenameGroupRequest,
} from '@/types/conversation';

/**
 * Centralized Query Keys for Conversations
 */
export const CONVERSATION_QUERY_KEYS = {
  all: ['conversations'] as const,
  detail: (id: string) => ['conversations', id] as const,
};

/**
 * Hook to fetch the conversations list with 10s automatic background polling.
 */
export const useGetConversationsQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: CONVERSATION_QUERY_KEYS.all,
    queryFn: () => conversationsApi.getConversations(),
    enabled,
    staleTime: 1000 * 10, // Consider data fresh for 10s
    refetchInterval: 10000, // Non-aggressive background polling fallback
  });
};

/**
 * Hook to start a 1-to-1 conversation.
 * Automatically invalidates and refreshes the conversations list on success.
 */
export const useStartConversationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Conversation, Error, StartConversationRequest>({
    mutationFn: (data: StartConversationRequest) => conversationsApi.startConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATION_QUERY_KEYS.all });
    },
  });
};

/**
 * Hook to create a new group discussion.
 * Automatically refreshes conversations cache upon creation.
 */
export const useCreateGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Conversation, Error, CreateGroupRequest>({
    mutationFn: (data: CreateGroupRequest) => conversationsApi.createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATION_QUERY_KEYS.all });
    },
  });
};

/**
 * Hook to add new members to a group.
 */
export const useAddParticipantsMutation = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, AddParticipantsRequest>({
    mutationFn: (data: AddParticipantsRequest) =>
      conversationsApi.addParticipants(conversationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATION_QUERY_KEYS.all });
    },
  });
};

/**
 * Hook to remove a participant or leave a group.
 */
export const useRemoveParticipantMutation = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    mutationFn: (userId: string) =>
      conversationsApi.removeParticipantOrLeave(conversationId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATION_QUERY_KEYS.all });
    },
  });
};

/**
 * Hook to promote a group member to admin status.
 */
export const usePromoteAdminMutation = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, PromoteAdminRequest>({
    mutationFn: (data: PromoteAdminRequest) =>
      conversationsApi.promoteAdmin(conversationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATION_QUERY_KEYS.all });
    },
  });
};

/**
 * Hook to rename an existing group discussion.
 */
export const useRenameGroupMutation = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, RenameGroupRequest>({
    mutationFn: (data: RenameGroupRequest) =>
      conversationsApi.renameGroup(conversationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATION_QUERY_KEYS.all });
    },
  });
};
