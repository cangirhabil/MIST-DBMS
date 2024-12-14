// store/useStore.ts
import { User } from '@/types/user'
import { create } from 'zustand'

type UserStore = {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
}

export const useUserStore = create<UserStore>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
}))
