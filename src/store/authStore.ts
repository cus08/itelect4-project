import { create } from 'zustand';

export interface AuthState {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: 'mock-jwt-token-12345',
  login: (token: string) => set({ token }),
  logout: () => set({ token: null }),
}));
