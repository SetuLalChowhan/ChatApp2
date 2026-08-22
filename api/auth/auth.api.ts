import apiClient from '@/lib/api-client';
import { LoginRequest, LoginResponse } from '@/types/auth';
import { User } from '@/types/user';

/**
 * Authentication REST API Methods
 * 
 * Handles user login (with automatic registration for new phone numbers)
 * and fetching current authenticated user profile.
 */
export const authApi = {
  /**
   * Log in or register automatically using a phone number and full name.
   * Returns JWT token and User profile data.
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  /**
   * Fetch the currently logged-in user profile from JWT session.
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
};
