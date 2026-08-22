'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { LoadingSpinner } from '@/components/ui/LoadingState';
import { useSearchUsersQuery } from '@/api/users/useUsersQueries';
import { UserSearchResult } from '@/types/user';
import { useAuth } from '@/hooks/useAuth';
import { Search, X, Check, Users } from 'lucide-react';
import { CreateGroupRequest } from '@/types/conversation';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (data: CreateGroupRequest) => Promise<any>;
}

interface GroupFormData {
  groupName: string;
}

/**
 * Modal dialog for creating a new group conversation.
 * Powered by react-hook-form and TanStack Query user search.
 */
export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onCreateGroup,
}) => {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<UserSearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GroupFormData>({
    defaultValues: {
      groupName: '',
    },
  });

  // Use TanStack Query hook for debounced user search
  const { data: searchResults = [], isLoading: isSearching } = useSearchUsersQuery(searchQuery);

  const filteredResults = searchResults.filter((u) => u._id !== currentUser?._id);

  const toggleSelectUser = (user: UserSearchResult) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((u) => u._id === user._id);
      if (exists) {
        return prev.filter((u) => u._id !== user._id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleRemoveSelected = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== userId));
  };

  const onSubmit = async (data: GroupFormData) => {
    setError(null);

    const name = data.groupName.trim();
    if (selectedUsers.length < 2) {
      setError('A group needs at least 2 other members (3 total members including you).');
      return;
    }

    try {
      await onCreateGroup({
        name,
        participantIds: selectedUsers.map((u) => u._id),
      });
      onClose();
      reset();
      setSelectedUsers([]);
      setSearchQuery('');
    } catch (err: any) {
      setError(err.message || 'Failed to create group');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Group Conversation"
      description="Name your group and add team members"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-2.5 text-xs text-rose-600 dark:text-rose-300">
            {error}
          </div>
        )}

        <Input
          label="Group Name"
          placeholder="e.g. Design & Engineering"
          disabled={isSubmitting}
          error={errors.groupName?.message}
          {...register('groupName', {
            required: 'Group name is required',
            minLength: { value: 2, message: 'Group name must be at least 2 characters' },
          })}
        />

        {/* Selected Participants Chips */}
        {selectedUsers.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
              Selected Members ({selectedUsers.length})
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 dark:bg-zinc-950/60 rounded-xl border border-slate-200 dark:border-zinc-800">
              {selectedUsers.map((u) => (
                <span
                  key={u._id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-200 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700/70 px-2.5 py-1 text-xs text-slate-800 dark:text-zinc-200 shadow-xs"
                >
                  <span>{u.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSelected(u._id)}
                    className="text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-full p-0.5 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Participant Search */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300">
            Add Members (select at least 2)
          </label>
          <div className="relative">
            <Input
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isSubmitting}
              className="pl-9"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-zinc-400 pointer-events-none" />
          </div>

          <div className="max-h-40 overflow-y-auto space-y-1 pr-1 custom-scrollbar border border-slate-200 dark:border-zinc-800/80 rounded-xl p-1 bg-slate-50 dark:bg-zinc-950/40 min-h-24">
            {isSearching ? (
              <div className="flex items-center justify-center py-6 gap-2">
                <LoadingSpinner size="sm" />
                <span className="text-xs text-slate-500 dark:text-zinc-400">Searching...</span>
              </div>
            ) : searchQuery.trim() && filteredResults.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 dark:text-zinc-400">
                No matching users found
              </div>
            ) : !searchQuery.trim() ? (
              <div className="py-6 text-center text-xs text-slate-500 dark:text-zinc-400 flex flex-col items-center gap-1">
                <Users className="h-4 w-4 text-slate-400 dark:text-zinc-400" />
                <span>Search and click users to add to group</span>
              </div>
            ) : (
              filteredResults.map((user) => {
                const isSelected = selectedUsers.some((u) => u._id === user._id);
                return (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => toggleSelectUser(user)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-slate-200 dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 border border-slate-300 dark:border-zinc-700/50'
                        : 'hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar name={user.name} size="sm" />
                      <div>
                        <p className="text-xs font-medium text-slate-800 dark:text-zinc-200">{user.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-400">{user.phone}</p>
                      </div>
                    </div>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded border ${
                        isSelected
                          ? 'bg-slate-900 dark:bg-zinc-100 border-slate-900 dark:border-zinc-100 text-white dark:text-zinc-950'
                          : 'border-slate-300 dark:border-zinc-700 text-transparent'
                      }`}
                    >
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-zinc-800">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={isSubmitting}
            disabled={selectedUsers.length < 2}
          >
            Create Group
          </Button>
        </div>
      </form>
    </Modal>
  );
};
