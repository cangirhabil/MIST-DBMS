import { create } from 'zustand'
import { toast } from '@/hooks/use-toast'
import { updatePassword } from '@/lib/services/auth.service'
import { userService } from '@/lib/services/user.service'
import { useAuthStore } from '@/store/auth' // Add this import

interface LoadingState {
  name: boolean
  email: boolean
  password: boolean
  initial: boolean
}

interface AccountSettingsStore {
  userProfile: any | null
  isLoading: LoadingState
  setLoading: (type: keyof LoadingState, value: boolean) => void
  setUserProfile: (profile: Record<string, any> | null) => void
  fetchUserProfile: () => Promise<void>
  updateName: (data: { username: string }) => Promise<void>
  updatePassword: (data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => Promise<void>
}

export const useAccountSettingsStore = create<AccountSettingsStore>((set, get) => ({
  userProfile: null,
  isLoading: {
    name: false,
    email: false,
    password: false,
    initial: false,
  },

  setLoading: (type, value) =>
    set((state) => ({
      isLoading: { ...state.isLoading, [type]: value },
    })),

  setUserProfile: (profile: any) =>
    set(() => ({
      userProfile: profile,
    })),

  fetchUserProfile: async () => {
    const { setLoading, setUserProfile } = get()
    const userId = useAuthStore.getState().user?.id

    if (!userId) {
      toast({
        title: 'Hata',
        description: 'Kullanıcı kimliği bulunamadı',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading('initial', true)
      const profile = await userService.getUserProfile(userId)
      setUserProfile(profile)
    } catch (error) {
      toast({
        title: 'Hata',
        description:
          error instanceof Error ? error.message : 'Profil bilgilerini yükleme başarısız oldu',
        variant: 'destructive',
      })
    } finally {
      setLoading('initial', false)
    }
  },

  updateName: async (data) => {
    const { setLoading, setUserProfile } = get()
    const userId = useAuthStore.getState().user?.id

    if (!userId) {
      toast({
        title: 'Hata',
        description: 'Kullanıcı kimliği bulunamadı',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading('name', true)
      const updatedProfile = await userService.updateUserProfile(userId, {
        name: `${data.username}`,
      })

      setUserProfile(updatedProfile)

      toast({
        title: 'Başarılı',
        description: 'İsim ve soyisim başarıyla güncellendi.',
        variant: 'default',
      })
    } catch (error) {
      toast({
        title: 'Hata',
        description: error instanceof Error ? error.message : 'Bir hata oluştu',
        variant: 'destructive',
      })
    } finally {
      setLoading('name', false)
    }
  },

  // updatePassword remains unchanged
  updatePassword: async (data) => {
    const { setLoading } = get()

    try {
      setLoading('password', true)
      const response = await updatePassword(
        data.currentPassword,
        data.newPassword,
        data.confirmPassword,
      )
      toast({
        title: 'Başarılı',
        description: response.message,
        variant: 'default',
      })
    } catch (error) {
      toast({
        title: 'Hata',
        description: error instanceof Error ? error.message : 'Bir hata oluştu',
        variant: 'destructive',
      })
    } finally {
      setLoading('password', false)
    }
  },
}))
