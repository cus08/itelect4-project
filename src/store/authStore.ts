// src/store/authStore.ts -- the finished file
// ===== SESSIONS 6-8: the store invented its own token ================
// interface AuthState {
// token: string | null;
// userName: string | null;
// login: (name: string) => void;
// logout: () => void;
// }
//
// login: (name) => set({ token: `demo-token-${name}`, userName: name })
//
// NOTE: That token was a string this file made up. Nothing checked it,
// because nothing could -- ProtectedRoute only ever asked whether
// it was null. A real token is issued by /api/auth/login and
// signed with a secret only the API knows.
// ===== SESSION 10: the store keeps a token it was given ==============

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthState {
  token: string | null;
  userName: string | null;
  // Two values in, nothing invented. The login page gets them from
  // the API and hands them here.
  setSession: (token: string, userName: string) => void;
  logout: () => void;
}

// This file deliberately does not import ../api/client. client.ts
// reads the token out of this store on every request, so a store that
// called client.ts back would be an import loop. Keeping the fetching
// in the pages and the state here means the arrow only points one way.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,
      setSession: (token, userName) => set({ token, userName }),
      logout: () => set({ token: null, userName: null }),
    }),
    {
      name: "itelect4-auth", // the localStorage key it writes to
      partialize: (state) => ({ // save ONLY these two fields
        token: state.token,
        userName: state.userName,
      }),
    }
  )
);

export default useAuthStore;

// The token is good for two hours -- that is the expiresIn in
// itelect4-backend's login route. Persist keeps it across a reload,
// so the app can come back holding one the API has already stopped
// accepting: the next request answers 401, and Log out then log in
// again is the fix.
