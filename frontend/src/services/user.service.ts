import { User } from '../types/user'
import { useAuthStore } from '../store/auth'
//http://localhost:3003/user/id=cm4onqe4x0000ovr5zsiiciq0
const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined')
}

export const userService = {
  async updateUserProfile(
    userId: string,
    updatedData: { name?: string; email?: string },
  ): Promise<User> {
    const token = useAuthStore.getState().token

    if (!token) {
      throw new Error('User is not logged in.')
    }
 
    try {
      // Fixed URL format
      const response = await fetch(`${API_URL}/user/updateUser/id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error instanceof Error ? error : new Error('Failed to update profile')
    }
  },

  async getUserProfile(userId: string): Promise<User> {
    const token = useAuthStore.getState().token

    if (!token) {
      throw Error('User is not logged in.')
    }

    try {
      // Fixed URL format
      const response = await fetch(`${API_URL}/user/getUser/id=${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch profile')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw error instanceof Error ? error : new Error('Failed to fetch profile')
    }
  },

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const token = useAuthStore.getState().token

    if (!token) {
      throw new Error('User is not logged in.')
    }

    try {
      const response = await fetch(`${API_URL}/user/updatePassword/id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update password')
      }
    } catch (error) {
      console.error('Error updating password:', error)
      throw error instanceof Error ? error : new Error('Failed to update password')
    }
  },
}
