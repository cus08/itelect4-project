import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      isDarkMode: false,
      isCompactVariant: false,
      searchQuery: '',        // intentionally NOT persisted (see partialize)
      showOnlyAvailable: false,

      toggleDarkMode: () => {
        const next = !get().isDarkMode;
        set({ isDarkMode: next });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', next);
        }
      },
      toggleCompactVariant: () =>
        set((state) => ({ isCompactVariant: !state.isCompactVariant })),
      setSearchQuery: (query: string) => set({ searchQuery: query }),
      toggleAvailableOnly: () =>
        set((state) => ({ showOnlyAvailable: !state.showOnlyAvailable })),
    }),
    {
      name: 'ui-storage',
      // Persist dark mode & compact variant but NOT the search box
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        isCompactVariant: state.isCompactVariant,
      }),
      // After rehydration, sync the <html> class with the stored value
      onRehydrateStorage: () => (state) => {
        if (state?.isDarkMode && typeof document !== 'undefined') {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);
