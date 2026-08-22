'use client';

import React, { useState, useEffect } from 'react';
import { Conversation } from '@/types/conversation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  useRenameGroupMutation,
  useAddParticipantsMutation,
  useRemoveParticipantMutation,
  usePromoteAdminMutation,
} from '@/api/conversations/useConversationsQueries';
import { GroupRenameSection } from './GroupRenameSection';
import { GroupAddMembersSection } from './GroupAddMembersSection';
import { GroupMembersList } from './GroupMembersList';
import { LogOut } from 'lucide-react';

interface GroupManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation | null;
  onUpdated: () => void;
  onLeftGroup: () => void;
}

/**
 * Group Management Modal orchestrator.
 * Combines GroupRenameSection, GroupAddMembersSection, GroupMembersList, and Leave Group action.
 */
export const GroupManagementModal: React.FC<GroupManagementModalProps> = ({
  isOpen,
  onClose,
  conversation,
  onUpdated,
  onLeftGroup,
}) => {
  const { user: currentUser } = useAuth();
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const convId = conversation?._id || '';

  // TanStack Query Mutations
  const renameMutation = useRenameGroupMutation(convId);
  const addParticipantsMutation = useAddParticipantsMutation(convId);
  const removeParticipantMutation = useRemoveParticipantMutation(convId);
  const promoteAdminMutation = usePromoteAdminMutation(convId);

  useEffect(() => {
    if (conversation) {
      setError(null);
      setSuccessMessage(null);
    }
  }, [conversation, isOpen]);

  if (!conversation) return null;

  const myId = currentUser?._id;
  const isAdmin = conversation.admins?.includes(myId || '');
  const participants = conversation.participants || [];

  // 1. Rename Group Action
  const handleRename = async (newName: string) => {
    setError(null);
    try {
      await renameMutation.mutateAsync({ name: newName });
      setSuccessMessage('Group renamed successfully');
      onUpdated();
    } catch (err: any) {
      setError(err.message || 'Failed to rename group');
    }
  };

  // 2. Add Members Action
  const handleAddMembers = async (userIds: string[]) => {
    setError(null);
    try {
      await addParticipantsMutation.mutateAsync({ userIds });
      setSuccessMessage('Members added successfully');
      onUpdated();
    } catch (err: any) {
      setError(err.message || 'Failed to add members');
    }
  };

  // 3. Promote Admin Action
  const handlePromoteAdmin = async (userId: string) => {
    setActionLoadingId(`promote-${userId}`);
    setError(null);
    try {
      await promoteAdminMutation.mutateAsync({ userId });
      setSuccessMessage('Member promoted to admin');
      onUpdated();
    } catch (err: any) {
      setError(err.message || 'Failed to promote member');
    } finally {
      setActionLoadingId(null);
    }
  };

  // 4. Remove Member Action
  const handleRemoveMember = async (userId: string) => {
    setActionLoadingId(`remove-${userId}`);
    setError(null);
    try {
      await removeParticipantMutation.mutateAsync(userId);
      setSuccessMessage('Member removed');
      onUpdated();
    } catch (err: any) {
      setError(err.message || 'Failed to remove member');
    } finally {
      setActionLoadingId(null);
    }
  };

  // 5. Leave Group Action
  const handleLeaveGroup = async () => {
    if (!confirm('Are you sure you want to leave this group?')) return;
    if (!myId) return;

    setActionLoadingId('leave');
    setError(null);
    try {
      await removeParticipantMutation.mutateAsync(myId);
      onClose();
      onLeftGroup();
    } catch (err: any) {
      setError(err.message || 'Failed to leave group');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={conversation.name || 'Group Details'}
      description={`${participants.length} members • ${isAdmin ? 'You are an Admin' : 'Member'}`}
    >
      <div className="space-y-4">
        {/* Status Alerts */}
        {error && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-2.5 text-xs text-rose-600 dark:text-rose-300">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs text-emerald-600 dark:text-emerald-300">
            {successMessage}
          </div>
        )}

        {/* Group Name & Rename Header Section */}
        <GroupRenameSection
          groupName={conversation.name || 'Group'}
          memberCount={participants.length}
          isAdmin={Boolean(isAdmin)}
          isSaving={renameMutation.isPending}
          onRename={handleRename}
        />

        {/* Add Members Section (Admin only) */}
        {isAdmin && (
          <GroupAddMembersSection
            existingParticipants={participants}
            isSubmitting={addParticipantsMutation.isPending}
            onAddMembers={handleAddMembers}
          />
        )}

        {/* Members List with Actions */}
        <GroupMembersList
          participants={participants}
          admins={conversation.admins}
          currentUserId={myId}
          isCurrentUserAdmin={Boolean(isAdmin)}
          actionLoadingId={actionLoadingId}
          onPromoteAdmin={handlePromoteAdmin}
          onRemoveMember={handleRemoveMember}
        />

        {/* Modal Footer with Leave Group & Close */}
        <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 flex justify-between items-center">
          <button
            onClick={handleLeaveGroup}
            disabled={actionLoadingId === 'leave'}
            className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Leave Group</span>
          </button>

          <Button size="sm" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
