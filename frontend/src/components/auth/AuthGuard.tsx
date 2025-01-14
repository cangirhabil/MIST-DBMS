// components/AuthGuard.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/auth'
import { ROUTE_PATHS } from '@/constants/route'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    if (user === null) {
      router.replace(ROUTE_PATHS.HOME)
    }
    else if (user?.id === 'cm5wwbr0t000inz0f1m6jniww') {
      router.replace(ROUTE_PATHS.ADMIN_STATISTICS)
    }else {
      router.replace(ROUTE_PATHS.MY_LISTS)
    }
  }, [user, router])

  if (!user) {
    return <>{children}</>
  }

  return null
}
