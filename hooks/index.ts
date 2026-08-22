/**
 * Application Custom Hooks
 * 
 * High-level UI and state management hooks:
 * - useAuth: Authentication state, login, logout, and token session persistence
 * - useTheme: Light / Dark theme switching with localStorage sync
 * - useConversations: Conversation list orchestrator connecting TanStack Query and socket events
 * - useMessages: Message history and composer state
 * - useSocket: Socket.io real-time connection and event subscription manager
 * - useAutoScroll: Smart auto-scrolling with stick-to-bottom and unread messages badge
 */

export * from './useAuth';
export * from './useTheme';
export * from './useConversations';
export * from './useMessages';
export * from './useSocket';
export * from './useAutoScroll';
