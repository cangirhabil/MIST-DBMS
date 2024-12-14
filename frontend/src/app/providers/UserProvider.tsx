// app/providers/UserProvider.tsx
'use client'

import { getUserProfile } from '@/services/user.service'
import { useUserStore } from '@/store/user'
import { useEffect } from 'react'

async function getCurrentUser() {
  try {
    const response = await getUserProfile()
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
