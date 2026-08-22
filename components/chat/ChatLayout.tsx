'use client';

import React, { useState, useCallback } from 'react';
import { useConversations } from '@/hooks/useConversations';
import { useMessages } from '@/hooks/useMessages';
import { useSocket } from '@/hooks/useSocket';
import { ConversationList } from './conversations/ConversationList';
import { ChatHeader } from './header/ChatHeader';
import { MessageList } from './messages/MessageList';
import { MessageInput } from './messages/MessageInput';
import { UserSearchModal } from './conversations/UserSearchModal';
import { CreateGroupModal } from './conversations/CreateGroupModal';
import { MessageSquare, MessagesSquare, Users } from 'lucide-react';
import { Message } from '@/types/message';

/**
 * Main ChatLayout container.
 * Manages the responsive two-column layout (sidebar + active conversation pane),
 * connects real-time socket events with TanStack Query state,
 * and handles direct/group creation modals.
 */
export const ChatLayout: React.FC = () => {
  // Modal visibility states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // Conversations query & mutations state
  const {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    isLoading: isConversationsLoading,
    error: conversationsError,
    refetch: refetchConversations,
    startDirectConversation,
    createGroupConversation,
    handleNewMessageUpdate,
  } = useConversations();

  // Active conversation messages state
  const {
    messages,
    isLoading: isMessagesLoading,
    isSending,
    sendMessage,
    handleIncomingMessage,
  } = useMessages(activeConversationId);

  // Real-time Socket.io message handler: updates message thread & conversation list snippet
  const onSocketNewMessage = useCallback(
    (msg: Message) => {
      handleIncomingMessage(msg);
      handleNewMessageUpdate(msg);
    },
    [handleIncomingMessage, handleNewMessageUpdate]
  );

  // Refresh conversation metadata whenever a conversation is updated on the server
  const onSocketConversationUpdated = useCallback(() => {
    refetchConversations();
  }, [refetchConversations]);

  // Initialize socket listener with our callbacks
  useSocket({
    onNewMessage: onSocketNewMessage,
    onConversationUpdated: onSocketConversationUpdated,
  });

  // Handle outbound message submission from the composer
  const handleSendMessage = async (text: string) => {
    const sent = await sendMessage(text);
    if (sent) {
      handleNewMessageUpdate(sent);
    }
  };

  // Handle starting a 1-to-1 conversation from the search modal
  const handleStartDirectChat = async (userId: string) => {
    await startDirectConversation(userId);
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 overflow-hidden select-none transition-colors duration-150">
      {/* Left Sidebar: Conversation List */}
      <div
        className={`w-full md:w-84 lg:w-[360px] shrink-0 h-full transition-all duration-200 ${
          activeConversationId ? 'hidden md:flex flex-col' : 'flex flex-col'
        }`}
      >
        <ConversationList
          conversations={conversations}
          activeId={activeConversationId}
          isLoading={isConversationsLoading}
          error={conversationsError}
          onSelect={(id) => setActiveConversationId(id)}
          onOpenNewDirect={() => setIsSearchOpen(true)}
          onOpenNewGroup={() => setIsGroupModalOpen(true)}
          onRetry={refetchConversations}
        />
      </div>

      {/* Right Main Pane: Active Chat Room or Empty State */}
      <div
        className={`flex-1 h-full flex-col bg-slate-50 dark:bg-zinc-950 transition-colors duration-150 ${
          activeConversationId ? 'flex' : 'hidden md:flex'
        }`}
      >
        {activeConversation ? (
          <>
            {/* Active Header with title, member count, and settings */}
            <ChatHeader
              conversation={activeConversation}
              onBack={() => setActiveConversationId(null)}
              onUpdated={refetchConversations}
              onLeftGroup={() => {
                setActiveConversationId(null);
                refetchConversations();
              }}
            />

            {/* Scrollable Message History with sticky auto-scroll */}
            <MessageList
              messages={messages}
              conversation={activeConversation}
              isLoading={isMessagesLoading}
            />

            {/* Multiline Message Composer */}
            <MessageInput
              onSendMessage={handleSendMessage}
              isSending={isSending}
            />
          </>
        ) : (
          /* Minimal placeholder shown when no conversation is currently active */
          <div className="flex h-full flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-zinc-950">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 mb-3 shadow-2xs">
              <MessagesSquare className="h-6 w-6 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
              Select a conversation
            </h3>
            <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Choose a conversation from the sidebar or start a new direct message.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2.5">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-950 px-3.5 py-2 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-white transition-colors cursor-pointer shadow-2xs"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Direct Message</span>
              </button>
              <button
                onClick={() => setIsGroupModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700/60 px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                <Users className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Create Group</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Direct User Search Modal */}
      <UserSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectUser={handleStartDirectChat}
      />

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onCreateGroup={createGroupConversation}
      />
    </div>
  );
};
