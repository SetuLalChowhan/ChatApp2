'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingState';
import { useSearchUsersQuery } from '@/api/users/useUsersQueries';
import { Search, UserPlus, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (userId: string) => Promise<void>;
}

/**
 * Modal dialog for searching and initiating a 1-to-1 conversation.
 */
export const UserSearchModal: React.FC<UserSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectUser,
}) => {
  const { user: currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TanStack Query hook with automated caching
  const { data: results = [], isLoading, error: queryError } = useSearchUsersQuery(query);

  const filteredResults = results.filter((u) => u._id !== currentUser?._id);

  const handleStartChat = async (userId: string) => {
    setIsStarting(true);
    setError(null);
    try {
      await onSelectUser(userId);
      onClose();
      setQuery('');
    } catch (err: any) {
      setError(err.message || 'Could not start conversation');
    } finally {
      setIsStarting(false);
    }
  };

  const displayError = error || (queryError ? queryError.message : null);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Direct Conversation"
      description="Find another person by name or phone number"
    >
      <div className="space-y-4">
        <div className="relative">
          <Input
            placeholder="Search by name or phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="pl-9"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-zinc-400 pointer-events-none" />
        </div>

        {displayError && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-2.5 text-xs text-rose-600 dark:text-rose-300">
            {displayError}
          </div>
        )}

        {/* Results List */}
        <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar min-h-36">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <LoadingSpinner size="md" />
              <span className="text-xs text-slate-500 dark:text-zinc-400">Searching people...</span>
            </div>
          ) : query.trim() && filteredResults.length === 0 ? (
            <EmptyState
              title="No users found"
              description={`No matches found for "${query}". Check spelling or try a phone number.`}
            />
          ) : !query.trim() ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-xs text-slate-500 dark:text-zinc-400">
              <Search className="h-6 w-6 mb-2 text-slate-400 dark:text-zinc-400" />
              <span>Type a name or phone number above to search</span>
            </div>
          ) : (
            filteredResults.map((user) => (
              <button
                key={user._id}
                onClick={() => handleStartChat(user._id)}
                disabled={isStarting}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left group cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} size="md" />
                  <div>
                    <h5 className="text-sm font-medium text-slate-800 dark:text-zinc-200 group-hover:text-slate-900 dark:group-hover:text-zinc-100">
                      {user.name}
                    </h5>
                    <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400">
                      <Phone className="h-3 w-3" />
                      <span>{user.phone}</span>
                    </p>
                  </div>
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800 group-hover:bg-slate-200 dark:group-hover:bg-zinc-700 text-slate-700 dark:text-zinc-300">
                  <UserPlus className="h-3.5 w-3.5" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
