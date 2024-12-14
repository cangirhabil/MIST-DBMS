import { User } from '../types/user';

export const updateUserProfile = async (updatedData: Record<string, any>): Promise<void> => {
  // Get user token from localStorage or your auth management system
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Kullanıcı giriş yapmamış.');
  }

  try {
    const response = await fetch('/api/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...updatedData,
        updatedAt: new Date().toISOString(),
      })
    });

    if (!response.ok) {
      throw new Error('Profil güncellenirken bir hata oluştu.');
    }
  } catch (error) {
    console.error('Kullanıcı profili güncelleme hatası:', error);
    throw new Error('Profil güncellenirken bir hata oluştu.');
  }
}

export const getUserProfile = async (): Promise<User | null> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Kullanıcı giriş yapmamış.');
  }

  try {
    const response = await fetch('/api/users/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Profil alınırken bir hata oluştu.');
    }

    const userData = await response.json();
    return userData as User;
  } catch (error) {
    console.error('Kullanıcı profili alma hatası:', error);
    throw new Error('Profil alınırken bir hata oluştu.');
  }
}
