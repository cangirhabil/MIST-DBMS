import { User } from '../types/user';
import { useAuthStore } from '../store/auth';

export const updateUserProfile = async (userId: string, updatedData: { name?: string; email?: string }): Promise<User> => {
  const token = useAuthStore.getState().token;

  if (!token) {
    throw new Error('User is not logged in.');
  }

  try {
    const response = await fetch(`${process.env.API_URL}/userProfile/${userId}`, {
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
}

export const getUserProfile = async (userId: string): Promise<User> => {
  const token = useAuthStore.getState().token;

  if (!token) {
     throw Error('User is not logged in.');
  }

  try {
    const response = await fetch(`${process.env.API_URL}/userProfile/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

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
