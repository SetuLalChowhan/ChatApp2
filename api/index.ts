/**
 * Central Barrel Exports for the API & Query Layer
 * 
 * Provides unified access to all feature-specific REST services and TanStack Query hooks.
 */

// Core Query Provider & Client configuration
export * from './queryClient';
export * from './QueryProvider';

// Authentication API & Hooks
export * from './auth/auth.api';
export * from './auth/useAuthQueries';

// User Search API & Hooks
export * from './users/users.api';
export * from './users/useUsersQueries';

// Conversations & Group Management API & Hooks
export * from './conversations/conversations.api';
export * from './conversations/useConversationsQueries';

// Message Threads & History API & Hooks
export * from './messages/messages.api';
export * from './messages/useMessagesQueries';
