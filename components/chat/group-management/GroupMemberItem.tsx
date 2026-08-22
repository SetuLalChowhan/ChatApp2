'use client';

import React from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { LoadingSpinner } from '@/components/ui/LoadingState';
import { ShieldCheck, Trash2 } from 'lucide-react';
import { User } from '@/types/user';

interface GroupMemberItemProps {
  participant: User | string;
  index: number;
  currentUserId?: string;
  isCurrentUserAdmin: boolean;
  isParticipantAdmin: boolean;
  actionLoadingId: string | null;
  onPromoteAdmin: (userId: string) => void;
  onRemoveMember: (userId: string) => void;
}

/**
 * Individual member item row in the group details list.
 * Displays member details, admin badge, promote button, and clean trash delete button.
 */
export const GroupMemberItem: React.FC<GroupMemberItemProps> = ({
  participant,
  index,
  currentUserId,
  isCurrentUserAdmin,
  isParticipantAdmin,
  actionLoadingId,
  onPromoteAdmin,
  onRemoveMember,
}) => {
  const isObj = typeof participant !== 'string';
  const id = isObj ? participant._id : participant;
  const name = isObj ? participant.name : `User ${index + 1}`;
  const phone = isObj ? participant.phone : '';
  const isMe = id === currentUserId;

  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 dark:bg-zinc-950/40 border border-slate-200 dark:border-zinc-800/80 transition-colors">
      <div className="flex items-center gap-2.5 min-w-0">
        <Avatar name={name} size="sm" />
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-800 dark:text-zinc-200 truncate">
            {name} {isMe && <span className="text-slate-400 dark:text-zinc-400 font-normal">(You)</span>}
          </p>
          {phone && <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">{phone}</p>}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {isParticipantAdmin ? (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-700 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-sky-500 dark:text-sky-400" />
            <span>Admin</span>
          </span>
        ) : (
          isCurrentUserAdmin && (
            <button
              onClick={() => onPromoteAdmin(id)}
              disabled={actionLoadingId === `promote-${id}`}
              className="text-[11px] text-slate-600 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-200 dark:hover:bg-zinc-800 px-2 py-1 rounded transition-colors cursor-pointer"
              title="Promote to Admin"
            >
              {actionLoadingId === `promote-${id}` ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Make Admin'
              )}
            </button>
          )
        )}

        {/* Admin can delete/remove non-self participants with clean trash icon */}
        {isCurrentUserAdmin && !isMe && (
          <button
            onClick={() => onRemoveMember(id)}
            disabled={actionLoadingId === `remove-${id}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:border-rose-500/30 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
            title="Remove member from group"
            aria-label="Remove member from group"
          >
            {actionLoadingId === `remove-${id}` ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
