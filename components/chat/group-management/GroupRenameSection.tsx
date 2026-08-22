'use client';

import React, { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Edit2 } from 'lucide-react';

interface GroupRenameSectionProps {
  groupName: string;
  memberCount: number;
  isAdmin: boolean;
  isSaving: boolean;
  onRename: (newName: string) => Promise<void>;
}

/**
 * Group name header with inline renaming form for admins.
 */
export const GroupRenameSection: React.FC<GroupRenameSectionProps> = ({
  groupName,
  memberCount,
  isAdmin,
  isSaving,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(groupName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSaving) return;
    await onRename(name.trim());
    setIsEditing(false);
  };

  return (
    <div className="rounded-xl bg-slate-50 dark:bg-zinc-950/60 p-3 border border-slate-200 dark:border-zinc-800 transition-colors">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Group name"
            autoFocus
            disabled={isSaving}
            className="py-1.5 text-xs"
          />
          <Button type="submit" size="sm" isLoading={isSaving}>
            Save
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsEditing(false);
              setName(groupName);
            }}
          >
            Cancel
          </Button>
        </form>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={groupName || 'Group'} isGroup size="md" />
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{groupName}</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400">{memberCount} participants</p>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 rounded-lg p-1.5 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Rename Group"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Rename</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
