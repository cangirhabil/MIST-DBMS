// auth-store.ts
import { User } from '@/types/user'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  checkAuth: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
      checkAuth: () => {
        const state = get()
        return !!(state.token && state.user && state.isAuthenticated)
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage), // localStorage kullanımını açıkça belirt
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated, // isAuthenticated'ı da persist et
      }),
    },
  ),
)
export default useAuthStore