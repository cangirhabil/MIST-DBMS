//unauthorized/page.tsx

'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTE_PATHS } from '@/constants/route'
import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="container flex h-screen w-screen items-center justify-center">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle>Yetkisiz Erişim</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Bu sayfaya erişmek için giriş yapmanız gerekmektedir.</p>
          <Button className="w-full" onClick={() => router.push(ROUTE_PATHS.AUTH)}>
            Giriş Yap
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
