import apiClient from '@/lib/api-client';
import { UserSearchResult } from '@/types/user';

/**
 * Users REST API Methods
 * 
 * Provides team member search by name or phone number.
 */
export const usersApi = {
  /**
   * Search registered users by partial name or phone number match.
   * Returns empty array if query is blank.
   */
  searchUsers: async (query: string): Promise<UserSearchResult[]> => {
    if (!query.trim()) return [];
    const response = await apiClient.get<UserSearchResult[]>('/users/search', {
      params: { q: query.trim() },
    });
    return response.data;
  },
};
