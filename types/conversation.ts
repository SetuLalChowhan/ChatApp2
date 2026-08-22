import { User } from './user';

export interface LastMessage {
  text: string;
  sender: string | { _id: string; name: string };
  createdAt: string;
}

export interface Conversation {
  _id: string;
  type?: 'direct' | 'group';
  name?: string;
  createdBy?: string;
  admins?: string[];
  participant?: User | string;
  participants?: (User | string)[];
  lastMessage?: LastMessage;
  createdAt?: string;
  updatedAt?: string;
}

export interface StartConversationRequest {
  userId: string;
}

export interface CreateGroupRequest {
  name: string;
  participantIds: string[];
}

export interface AddParticipantsRequest {
  userIds: string[];
}

export interface PromoteAdminRequest {
  userId: string;
}

export interface RenameGroupRequest {
  name: string;
}

export const getConversationTitle = (conversation: Conversation, currentUserId?: string): string => {
  if (conversation.name) return conversation.name;
  
  // Single participant object (from direct chat response)
  if (conversation.participant && typeof conversation.participant !== 'string') {
    return conversation.participant.name || conversation.participant.phone || 'Direct Chat';
  }

  // Participants array (from group chat or populated direct chat)
  if (conversation.participants && Array.isArray(conversation.participants)) {
    const other = conversation.participants.find((p) => {
      if (typeof p === 'string') return p !== currentUserId;
      return p._id !== currentUserId;
    });
    if (other && typeof other !== 'string') {
      return other.name || other.phone || 'Direct Chat';
    }
  }

  return 'Direct Chat';
};

export const getConversationSubtitle = (conversation: Conversation, currentUserId?: string): string => {
  const isGroup = conversation.type === 'group' || (conversation.participants && conversation.participants.length > 2);
  if (isGroup) {
    const count = conversation.participants?.length || 0;
    return `${count} ${count === 1 ? 'member' : 'members'}`;
  }
  if (conversation.participant && typeof conversation.participant !== 'string') {
    return conversation.participant.phone || 'Direct conversation';
  }
  if (conversation.participants && Array.isArray(conversation.participants)) {
    const other = conversation.participants.find((p) => {
      if (typeof p === 'string') return p !== currentUserId;
      return p._id !== currentUserId;
    });
    if (other && typeof other !== 'string') {
      return other.phone || 'Direct conversation';
    }
  }
  return 'Direct conversation';
};
