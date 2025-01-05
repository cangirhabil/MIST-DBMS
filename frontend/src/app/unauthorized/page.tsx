'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTE_PATHS } from '@/constants/route'
import { useRouter } from 'next/navigation'
import { LockIcon } from 'lucide-react'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center">
      <Card className="w-full max-w-[420px] shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center">
            <LockIcon className="h-8 w-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Yetkisiz Erişim</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <p className="text-gray-600 text-center">
            Bu sayfaya erişmek için giriş yapmanız gerekmektedir.
          </p>
          <Button
            className="w-full bg-primary hover:bg-primary/90 transition-colors duration-200"
            onClick={() => router.push(ROUTE_PATHS.HOME)}
          >
            Giriş Yap
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
