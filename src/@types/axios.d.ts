// eslint-disable-next-line @typescript-eslint/no-unused-vars
import 'axios';
import type React from 'react';

declare module 'axios' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface AxiosRequestConfig {
    confirm?: { type: 'delete'; content: string | React.ReactNode };
    success?: string | { message: string; duration?: number; callback?: () => void };
    error?:
      | string
      | { message: string; duration?: number }
      | ((err: { message: string; name: 'user' | 'system' }) => void)
      | boolean;
    loading?: boolean;
  }
}
