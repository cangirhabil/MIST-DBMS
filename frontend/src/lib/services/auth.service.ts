import { AuthResponse } from '@/types/auth'
import useAuthStore from '@/store/auth'
import axios, { AxiosError } from 'axios'

// NEXT_PUBLIC_ prefix'i ile environment variable'ı client-side'da kullanılabilir hale getiriyoruz
const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined')
}

const api = axios.create({
  baseURL: API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const signupWithEmailAndPassword = async (
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> => {
  const setUser = useAuthStore.getState().setAuth

  try {
    const { data } = await api.post('/auth/register', {
      email,
      password,
      name,
    })

    setUser(data.user, data.token)

    return {
      success: true,
      user: data.user,
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        user: null,
        error: error.response?.data?.error || 'Kayıt işlemi başarısız oldu',
      }
    }
    return {
      success: false,
      user: null,
      error: 'Beklenmeyen bir hata oluştu',
    }
  }
}


export const loginWithEmailAndPassword = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const setUser = useAuthStore.getState().setAuth

  try {
    const { data } = await api.post('/auth/login', {
      email,
      password,
    })

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
      error: error.response?.data?.message || 'Giriş başarısız. Bilgilerinizi kontrol edin.',
    }
  }
}

export const updatePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; message: string }> => {
  const token = useAuthStore.getState().token

  if (!token) {
    return {
      success: false,
      message: 'User is not logged in.',
    }
  }

  try {
    await api.put(
      `/user/updatePassword/id=${userId}`,
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return {
      success: true,
      message: 'Password updated successfully.',
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update password',
      }
    }
    return {
      success: false,
      message: 'An unexpected error occurred',
    }
  }
}

export const logOut = async (): Promise<void> => {
  const clearAuth = useAuthStore.getState().clearAuth
  try {
    clearAuth()
  } catch (error) {
    console.error('Logout error:', error)
    clearAuth()
  }
}
