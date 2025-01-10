// app/providers/UserProvider.tsx
'use client'

import { userService } from '@/lib/services/user.service'
import { useUserStore } from '@/store/user'
import { useAuthStore } from '@/store/auth'
import { useEffect } from 'react'

async function getCurrentUser() {
  try {
    const userId = useAuthStore.getState().user?.id
    if (!userId) return null
    const response = await userService.getUserProfile(userId)
    return response
  } catch (error) {
    console.error('Kullanıcı alınırken hata oluştu:', error)
    return null
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const setCurrentUser = useUserStore((state) => state.setCurrentUser)

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser()
      setCurrentUser(user as any)
    }

    fetchUser()
  }, [setCurrentUser])

  return <>{children}</>
}
