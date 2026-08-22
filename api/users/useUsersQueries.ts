import { useQuery } from '@tanstack/react-query';
import { usersApi } from './users.api';

/**
 * Cache keys for user search queries
 */
export const USER_QUERY_KEYS = {
  search: (q: string) => ['users', 'search', q] as const,
};

/**
 * Hook to search users with automatic TanStack Query caching.
 * Searches only when a non-empty query string is provided.
 */
export const useSearchUsersQuery = (query: string) => {
  const cleanQuery = query.trim();

  return useQuery({
    queryKey: USER_QUERY_KEYS.search(cleanQuery),
    queryFn: () => usersApi.searchUsers(cleanQuery),
    enabled: cleanQuery.length > 0,
    staleTime: 1000 * 60 * 2, // Cache search results for 2 minutes
  });
};
