import { create } from 'zustand';

export interface UIState {
  isDarkMode: boolean;
  isCompactVariant: boolean;
  searchQuery: string;
  showOnlyAvailable: boolean;
  toggleDarkMode: () => void;
  toggleCompactVariant: () => void;
  setSearchQuery: (query: string) => void;
  toggleAvailableOnly: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  isDarkMode: false,
  isCompactVariant: false,
  searchQuery: '',
  showOnlyAvailable: false,

  toggleDarkMode: () => {
    const next = !get().isDarkMode;
    set({ isDarkMode: next });
    if (typeof document !== 'undefined') {
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },
  toggleCompactVariant: () => set((state) => ({ isCompactVariant: !state.isCompactVariant })),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  toggleAvailableOnly: () => set((state) => ({ showOnlyAvailable: !state.showOnlyAvailable })),
}));
