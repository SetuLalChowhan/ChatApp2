'use client';

import React, { useState } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

/**
 * Next.js App Router Provider wrapper for TanStack Query.
 * Maintains client instance per React component lifecycle.
 */
export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 30, // 30s
            gcTime: 1000 * 60 * 5, // 5m
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
