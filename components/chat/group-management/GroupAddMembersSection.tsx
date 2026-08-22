'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { LoadingSpinner } from '@/components/ui/LoadingState';
import { useSearchUsersQuery } from '@/api/users/useUsersQueries';
import { UserPlus, Search, Check, X } from 'lucide-react';
import { User } from '@/types/user';

interface GroupAddMembersSectionProps {
  existingParticipants: (User | string)[];
  isSubmitting: boolean;
  onAddMembers: (userIds: string[]) => Promise<void>;
}

/**
 * Expandable search panel allowing group admins to search and add multiple members.
 */
export const GroupAddMembersSection: React.FC<GroupAddMembersSectionProps> = ({
  existingParticipants,
  isSubmitting,
  onAddMembers,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const { data: searchResults = [], isLoading: isSearching } = useSearchUsersQuery(searchQuery);

  const existingIds = new Set(
    existingParticipants.map((p) => (typeof p === 'string' ? p : p._id))
  );
  const filteredResults = searchResults.filter((u) => !existingIds.has(u._id));

  const toggleSelectUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleAdd = async () => {
    if (selectedUserIds.length === 0 || isSubmitting) return;
    await onAddMembers(selectedUserIds);
    setIsAdding(false);
    setSelectedUserIds([]);
    setSearchQuery('');
  };

  if (!isAdding) {
    return (
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setIsAdding(true)}
        className="w-full gap-1.5"
      >
        <UserPlus className="h-3.5 w-3.5" />
        <span>Add Members to Group</span>
      </Button>
    );
  }

  return (
    <div className="space-y-2 rounded-xl bg-slate-50 dark:bg-zinc-950/70 p-3 border border-slate-200 dark:border-zinc-800 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
          Find people to add
        </span>
        <button
          onClick={() => {
            setIsAdding(false);
            setSelectedUserIds([]);
          }}
          className="text-slate-400 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="relative">
        <Input
          placeholder="Search by name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 py-1.5 text-xs"
          autoFocus
        />
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 dark:text-zinc-500 pointer-events-none" />
      </div>

      <div className="max-h-36 overflow-y-auto space-y-1 custom-scrollbar min-h-16">
        {isSearching ? (
          <div className="py-4 text-center">
            <LoadingSpinner size="sm" />
          </div>
        ) : searchQuery.trim() && filteredResults.length === 0 ? (
          <p className="py-4 text-center text-xs text-slate-500 dark:text-zinc-500">
            No new users found
          </p>
        ) : (
          filteredResults.map((user) => {
            const isSelected = selectedUserIds.includes(user._id);
            return (
              <button
                key={user._id}
                type="button"
                onClick={() => toggleSelectUser(user._id)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-slate-300 dark:border-zinc-700'
                    : 'hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Avatar name={user.name} size="sm" />
                  <div>
                    <p className="text-xs font-medium text-slate-800 dark:text-zinc-200">{user.name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400">{user.phone}</p>
                  </div>
                </div>
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded border ${
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

      {selectedUserIds.length > 0 && (
        <Button
          size="sm"
          className="w-full mt-2"
          onClick={handleAdd}
          isLoading={isSubmitting}
        >
          Add {selectedUserIds.length} Selected Member(s)
        </Button>
      )}
    </div>
  );
};
