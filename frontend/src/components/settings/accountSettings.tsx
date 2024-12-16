'use client'



import { userService } from '@/services/user.service'
import { useAuthStore } from '@/store/auth'

import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/settings/icons'
import { useAccountSettingsStore } from '@/store/accountSettingsForm'
import loadingAnimation from '../../../public/loading-animation.json'
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <div>Yükleniyor...</div>,
})
// Form validation schemas remain the same
const nameSchema = z.object({
  username: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, 'Lütfen mevcut şifrenizi girin'),
    newPassword: z
      .string()
      .min(8, 'Şifre en az 8 karakter olmalıdır')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir',
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirmPassword'],
  })

export default function AccountSettings() {
  const { isLoading, userProfile, fetchUserProfile, updateName, updatePassword } =
    useAccountSettingsStore()
  const userUpdates = useUserUpdates()

  // Modify handleUpdateName function
  const handleUpdateName = async (data: z.infer<typeof nameSchema>) => {
    try {
      await userUpdates.handleUpdateUserProfile({ name: data.username,})
      await updateName(data)
    } catch (error) {
      console.error('Error updating name:', error)
    }
  }

  // Modify handleResetPassword function
  const handleResetPassword = async (data: z.infer<typeof passwordSchema>) => {
    try {
      await userUpdates.handleUpdatePassword(data.currentPassword, data.newPassword)
      await updatePassword(data)
      passwordForm.reset()
    } catch (error) {
      console.error('Error updating password:', error)
    }
  }

  const nameForm = useForm({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      username: '',
    },
  })

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    fetchUserProfile()
  }, [fetchUserProfile])

  useEffect(() => {
    if (userProfile) {
      nameForm.reset({
        username: userProfile.name,
      })
    }
  }, [userProfile, nameForm])

  function useUserUpdates() {
    const userId = useAuthStore.getState().user?.id

    const handleUpdateUserProfile = async (data: { name: string;}) => {
      if (!userId) throw new Error('User ID not found')

      try {
        await userService.updateUserProfile(userId, {
          name: `${data.name}`,
        })
      } catch (error) {
        console.error('Failed to update profile:', error)
        throw error
      }
    }

    const handleUpdatePassword = async (currentPassword: string, newPassword: string) => {
      if (!userId) throw new Error('User ID not found')

      try {
        await userService.updatePassword(userId, currentPassword, newPassword)
      } catch (error) {
        console.error('Failed to update password:', error)
        throw error
      }
    }

    return {
      handleUpdateUserProfile,
      handleUpdatePassword,
    }
  }

  if (isLoading.initial) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="w-50 h-50">
          <Lottie animationData={loadingAnimation} loop={true} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Ayarlar</h1>
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.user className="h-6 w-6" />
            Hesap Ayarları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={nameForm.handleSubmit(handleUpdateName)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Kullanıcı Adı / Soyadı</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 space-y-1">
                  <Input {...nameForm.register('username')} placeholder="Kullanıcı adınızı girin" />
                  {nameForm.formState.errors.username && (
                    <p className="text-sm text-red-500">
                      {nameForm.formState.errors.username.message}
                    </p>
                  )}
                </div>
              </div>
              <Button type="submit" disabled={isLoading.name}>
                {isLoading.name && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                İsim ve Soyisim Güncelle
              </Button>
            </div>
          </form>

          <form onSubmit={passwordForm.handleSubmit(handleResetPassword)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Şifreyi Sıfırla</Label>
              <div className="space-y-2">
                <Input
                  {...passwordForm.register('currentPassword')}
                  type="password"
                  placeholder="Mevcut şifrenizi girin"
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-red-500">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
                <Input
                  {...passwordForm.register('newPassword')}
                  type="password"
                  placeholder="Yeni şifrenizi girin"
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-red-500">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
                <Input
                  {...passwordForm.register('confirmPassword')}
                  type="password"
                  placeholder="Yeni şifrenizi tekrar girin"
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={isLoading.password}>
                {isLoading.password && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Şifreyi Sıfırla
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}



// First, move the useUserUpdates hook outside of the component
function useUserUpdates() {
  const userId = useAuthStore.getState().user?.id

  const handleUpdateUserProfile = async (data: { name: string;}) => {
    if (!userId) throw new Error('User ID not found')

    try {
      await userService.updateUserProfile(userId, {
        name: `${data.name}`,
      })
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    }
  }

  const handleUpdatePassword = async (currentPassword: string, newPassword: string) => {
    if (!userId) throw new Error('User ID not found')

    try {
      await userService.updatePassword(userId, currentPassword, newPassword)
    } catch (error) {
      console.error('Failed to update password:', error)
      throw error
    }
  }

  return {
    handleUpdateUserProfile,
    handleUpdatePassword,
  }
}