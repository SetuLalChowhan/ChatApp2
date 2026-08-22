import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://frontend-task-chatapp.onrender.com/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const extractErrorMessage = (error: any): string => {
  const data = error.response?.data;
  if (!data) return error.message || 'Network error occurred. Please check your connection.';

  // Check nested validation error details: details: [{ path, message }]
  if (data.error?.details && Array.isArray(data.error.details) && data.error.details.length > 0) {
    return data.error.details[0].message || data.error.message || 'Validation error';
  }
  if (data.details && Array.isArray(data.details) && data.details.length > 0) {
    return data.details[0].message || data.message || 'Validation error';
  }

  // Check error message strings
  if (typeof data.error === 'string') return data.error;
  if (typeof data.error?.message === 'string') return data.error.message;
  if (typeof data.message === 'string') return data.message;

  return error.message || 'An unexpected error occurred';
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = extractErrorMessage(error);
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
