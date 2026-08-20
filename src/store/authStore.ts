import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthState {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: 'mock-jwt-token-12345',
      login: (token: string) => set({ token }),
      logout: () => set({ token: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
