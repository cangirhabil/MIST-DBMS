import { UserRole } from '@/types/auth'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: UserRole | null
  setUser: (user: UserRole | null) => void
  clearUser: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'auth-storage', // localStorage'da saklanacak key
    },
  ),
)

export default useAuthStore
