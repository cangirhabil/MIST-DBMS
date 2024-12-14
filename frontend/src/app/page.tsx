'use client'
import loadingAnimation from '../../public/loading-animation.json'
import loadingAnimationSlow from '../../public/loading-animation-slow.json'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

import { loginWithEmailAndPassword, signupWithEmailAndPassword } from '@/services/auth.service'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { ROUTE_PATHS } from '@/constants/route'
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <div>Yükleniyor...</div>,
})
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    toast({
      title: isLogin ? 'Giriş yapılıyor...' : 'Hesap oluşturuluyor...',
      description: 'Lütfen bekleyin...',
    })

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const email = formData.get('email') as string
      const password = formData.get('password') as string
      const name = formData.get('name') as string

      if (isLogin) {
        const { success, user, error } = await loginWithEmailAndPassword(email, password)
        if (success && user) {
          toast({
            title: 'Başarılı!',
            description: 'Giriş başarılı.',
            variant: 'default',
          })
          await router.push(ROUTE_PATHS.MY_LISTS)
        } else {
          toast({
            title: 'Hata!',
            description: error || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.',
            variant: 'destructive',
          })
        }
      } else {
        const { success, user, error } = await signupWithEmailAndPassword(email, password, name)

        if (success && user) {
          toast({
            title: 'Başarılı!',
            description: 'Hesap başarıyla oluşturuldu.',
            variant: 'default',
          })

          await router.push(ROUTE_PATHS.SETTINGS)
        } else {
          toast({
            title: 'Hata!',
            description: error || 'Hesap oluşturulurken bir hata oluştu.',
            variant: 'destructive',
          })
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      toast({
        title: 'Hata!',
        description: isLogin
          ? 'Giriş yapılırken bir hata oluştu.'
          : 'Hesap oluşturulurken bir hata oluştu.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthGuard>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-50 h-50">
            {' '}
            <Lottie animationData={loadingAnimation} loop={true} />
          </div>
        </div>
      )}
      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-20 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-white">
            <Lottie animationData={loadingAnimationSlow} loop={true} />
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2 text-black">
              <p className="text-lg">
                &ldquo;Film ve dizi tutkunları için en kapsamlı platform. Kişiselleştirilmiş
                listeler oluşturabilir, izleme geçmişinizi takip edebilir ve yeni keşifler
                yapabilirsiniz.&rdquo;
              </p>
              <footer className="text-sm">Habil Cangir</footer>
            </blockquote>
          </div>
        </div>
        <div>
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 px-20">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">
                  {isLogin ? 'Hoşgeldiniz' : 'Hesap Oluştur'}
                </CardTitle>
                <CardDescription>
                  {isLogin
                    ? 'Hesabınıza erişmek için giriş yapın'
                    : 'Platformumuzu kullanmak için kaydolun'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4" method="POST">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Ad Soyad</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Ahmet Yılmaz"
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Adresi</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Şifre</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember">Beni hatırla</Label>
                      </div>
                      <Button variant="link" className="px-0 font-normal">
                        Şifremi unuttum
                      </Button>
                    </div>
                  )}

                  <Button className="w-full " type="submit" disabled={isLoading}>
                    {/* {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />} */}
                    {isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Veya</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? 'Hesap Oluştur' : 'Giriş Yap'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
