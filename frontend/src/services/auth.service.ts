import { AuthResponse, UserRole } from '@/types/auth'
import useAuthStore from '@/store/auth'

const API_URL = 'http://localhost:3000'

export const signupWithEmailAndPassword = async (
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> => {
  const setUser = useAuthStore.getState().setAuth

  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setUser(data.user, data.token)

    return {
      success: true,
      user: data.user,
    }
  } catch (error) {
    console.error('Kayıt hatası:', error)
    return {
      success: false,
      user: null,
      error: 'Hesap oluşturulurken bir hata oluştu.',
    }
  }
}

export const loginWithEmailAndPassword = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const setUser = useAuthStore.getState().setAuth

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    setUser(data.user, data.token)

    return {
      success: true,
      user: data.user,
    }
  } catch (error: any) {
    console.error('Giriş hatası:', error)
    return {
      success: false,
      user: null,
      error: error.message || 'Giriş başarısız. Bilgilerinizi kontrol edin.',
    }
  }
}

export const checkIsAdmin = async (uid: string) => {
  const response = await fetch(`${API_URL}/auth/check-admin/${uid}`)
  const data = await response.json()
  return data.isAdmin
}

export const logOut = async () => {
  const clearUser = useAuthStore.getState().clearAuth
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
    })
    clearUser()
  } catch (error) {
    return error
  }
}

export const updatePassword = async (oldPassword: string, newPassword: string): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/auth/update-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    return 'Şifre başarıyla güncellendi.'
  } catch (error: any) {
    console.error('Şifre güncelleme hatası:', error)
    throw new Error(error.message || 'Şifre güncellenirken bir hata oluştu.')
  }
}
