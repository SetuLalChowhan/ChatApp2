import { QueryClient } from '@tanstack/react-query';

/**
 * Global TanStack QueryClient Configuration
 * 
 * Default Rules:
 * - staleTime: 30 seconds before data is refetched in background
 * - gcTime: 5 minutes before unused cache queries are garbage-collected
 * - refetchOnWindowFocus: disabled to prevent redundant network spam
 * - retry: 1 attempt on network errors
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds
      gcTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});
