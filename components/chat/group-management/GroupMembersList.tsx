'use client';

import React from 'react';
import { GroupMemberItem } from './GroupMemberItem';
import { User } from '@/types/user';

interface GroupMembersListProps {
  participants: (User | string)[];
  admins?: string[];
  currentUserId?: string;
  isCurrentUserAdmin: boolean;
  actionLoadingId: string | null;
  onPromoteAdmin: (userId: string) => void;
  onRemoveMember: (userId: string) => void;
}

/**
 * Scrollable list of members inside a group conversation.
 */
export const GroupMembersList: React.FC<GroupMembersListProps> = ({
  participants,
  admins = [],
  currentUserId,
  isCurrentUserAdmin,
  actionLoadingId,
  onPromoteAdmin,
  onRemoveMember,
}) => {
  return (
    <div>
      <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
        Members ({participants.length})
      </h5>
      <div className="max-h-56 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
        {participants.map((p, idx) => {
          const isObj = typeof p !== 'string';
          const id = isObj ? p._id : p;
          const isParticipantAdmin = admins.includes(id);

          return (
            <GroupMemberItem
              key={id || idx}
              participant={p}
              index={idx}
              currentUserId={currentUserId}
              isCurrentUserAdmin={isCurrentUserAdmin}
              isParticipantAdmin={isParticipantAdmin}
              actionLoadingId={actionLoadingId}
              onPromoteAdmin={onPromoteAdmin}
              onRemoveMember={onRemoveMember}
            />
          );
        })}
      </div>
    </div>
  );
};
