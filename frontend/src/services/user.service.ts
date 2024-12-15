import { User } from '../types/user';
import { useAuthStore } from '../store/auth';
//http://localhost:3003/user/id=cm4onqe4x0000ovr5zsiiciq0
const API_BASE_URL = process.env.API_URL || 'http://localhost:3003';

export const userService = {
   async updateUserProfile(userId: string, updatedData: { name?: string; email?: string }): Promise<User> {
    const token = useAuthStore.getState().token;

    if (!token) {
      throw new Error('User is not logged in.');
    }

    try {
      // Fixed URL format
      const response = await fetch(`${API_BASE_URL}/user/id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error instanceof Error ? error : new Error('Failed to update profile');
    }
  },

  async getUserProfile(userId: string): Promise<User> {
    const token = useAuthStore.getState().token;

    if (!token) {
      throw Error('User is not logged in.');
    }

    try {
      // Fixed URL format
      const response = await fetch(`${API_BASE_URL}/user/id=${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch profile');
    }
  }
};
