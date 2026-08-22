'use client';

import React, { useState } from 'react';
import { Conversation, getConversationTitle, getConversationSubtitle } from '@/types/conversation';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar';
import { ArrowLeft, Users, Phone, Settings, Info } from 'lucide-react';
import { GroupManagementModal } from '../group-management/GroupManagementModal';

interface ChatHeaderProps {
  conversation: Conversation | null;
  onBack?: () => void;
  onUpdated?: () => void;
  onLeftGroup?: () => void;
}

/**
 * Compact, production-ready conversation header.
 * Shows participant avatar, title, subtitle (member count or phone),
 * and quick access to group management features.
 */
export const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  onBack,
  onUpdated = () => {},
  onLeftGroup = () => {},
}) => {
  const { user: currentUser } = useAuth();
  const [showGroupModal, setShowGroupModal] = useState(false);

  if (!conversation) return null;

  const isGroup =
    conversation.type === 'group' ||
    (conversation.participants && conversation.participants.length > 2);
  const myId = currentUser?._id;
  const isAdmin = conversation.admins?.includes(myId || '');

  const title = getConversationTitle(conversation, currentUser?._id);
  const subtitle = getConversationSubtitle(conversation, currentUser?._id);

  return (
    <>
      <div className="flex h-14 items-center justify-between border-b border-slate-200/90 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 px-4 z-10 shrink-0 transition-colors duration-150">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          <Avatar name={title} isGroup={isGroup} size="md" />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate">
                {title}
              </h2>
              {isGroup && (
                <span className="px-1.5 py-0.2 rounded text-[8px] font-semibold uppercase tracking-wider shrink-0 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Group
                </span>
              )}
            </div>
            <p className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-zinc-400 truncate">
              {isGroup ? <Users className="h-3 w-3" /> : <Phone className="h-3 w-3" />}
              <span>{subtitle}</span>
            </p>
          </div>
        </div>

        {/* Group Management & Info button */}
        {isGroup && (
          <button
            onClick={() => setShowGroupModal(true)}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 hover:text-slate-900 dark:hover:text-zinc-100 border border-slate-200 dark:border-zinc-700/60 transition-colors cursor-pointer"
            title="Group settings & members"
            aria-label="Group settings & members"
          >
            {isAdmin ? <Settings className="h-3.5 w-3.5" /> : <Info className="h-3.5 w-3.5" />}
            <span>{isAdmin ? 'Manage Group' : 'Group Info'}</span>
          </button>
        )}
      </div>

      {/* Interactive Group Management Modal */}
      {isGroup && (
        <GroupManagementModal
          isOpen={showGroupModal}
          onClose={() => setShowGroupModal(false)}
          conversation={conversation}
          onUpdated={onUpdated}
          onLeftGroup={onLeftGroup}
        />
      )}
    </>
  );
};
