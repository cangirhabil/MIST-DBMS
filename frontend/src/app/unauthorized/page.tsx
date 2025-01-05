'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTE_PATHS } from '@/constants/route'
import { useRouter } from 'next/navigation'
import { LockIcon } from 'lucide-react'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto bg-red-100 dark:bg-red-900/20 w-16 h-16 rounded-full flex items-center justify-center">
            <LockIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Yetkisiz Erişim</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <p className="text-center text-gray-600 dark:text-gray-300">
            Bu sayfaya erişmek için giriş yapmanız gerekmektedir.
          </p>
          <Button
            className="w-full bg-red-600 hover:bg-red-700 transition-colors"
            onClick={() => router.push(ROUTE_PATHS.HOME)}
          >
            Giriş Yap
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
