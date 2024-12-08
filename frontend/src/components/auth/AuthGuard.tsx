// components/AuthGuard.tsx
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/auth'
import { ROUTE_PATHS } from '@/constants/route'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    if (user) {
      router.replace(ROUTE_PATHS.MY_LISTS) // veya başka bir sayfa
    }
  }, [user, router])

  // Kullanıcı authenticated ise ve yönlendirme yapılıyorsa
  // sayfanın içeriğini gösterme
  if (user) {
    return null
  }

  return <>{children}</>
}
