import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from './auth.api';
import { LoginRequest, LoginResponse } from '@/types/auth';

/**
 * Centralized Query Keys for Authentication
 * Ensures consistent cache referencing across the entire application.
 */
export const AUTH_QUERY_KEY = {
  me: ['auth', 'me'] as const,
};

/**
 * Hook for authenticating a user.
 * Upon successful login, immediately populates the current user profile in the cache.
 */
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      // Optimistically set the authenticated user in the query cache
      queryClient.setQueryData(AUTH_QUERY_KEY.me, data.user);
    },
  });
};

/**
 * Hook to retrieve the currently logged in user profile.
 * Cached for 10 minutes to avoid redundant network requests.
 */
export const useGetMeQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: AUTH_QUERY_KEY.me,
    queryFn: () => authApi.getMe(),
    enabled,
    staleTime: 1000 * 60 * 10, // Keep fresh for 10 minutes
  });
};
