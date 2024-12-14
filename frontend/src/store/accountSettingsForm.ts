import { create } from 'zustand'
import { toast } from '@/hooks/use-toast'
import { updatePassword } from '@/services/auth.service'
import { getUserProfile, updateUserProfile } from '@/services/user.service'

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
  updateName: (data: { username: string; surname: string }) => Promise<void>
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

    try {
      setLoading('initial', true)
      const profile = await getUserProfile()
      console.log('profile', profile)
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

    try {
      setLoading('name', true)
      await updateUserProfile({
        username: data.username,
        surname: data.surname,
      })

      // Başarılı API çağrısından sonra yerel durumu güncelle
      setUserProfile({
        username: data.username,
        surname: data.surname,
      })

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

  updatePassword: async (data) => {
    const { setLoading } = get()

    try {
      setLoading('password', true)
      const response = await updatePassword(data.currentPassword, data.newPassword)
      toast({
        title: 'Başarılı',
        description: response,
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
