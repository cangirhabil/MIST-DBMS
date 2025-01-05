import { MovieList } from '../types/MovieList'
import useAuthStore from '@/store/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined')
}

export const movieListService = {
  async getMovieListsByUserId(): Promise<MovieList[]> {
    const token = useAuthStore.getState().token
    const userId = useAuthStore.getState().user?.id
    if (!token) {
      throw Error('User is not logged in.')
    }

    try {
      const response = await fetch(`${API_URL}/lists/getMovieLists/userId=${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch movie lists')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching movie lists:', error)
      throw error instanceof Error ? error : new Error('Failed to fetch movie lists')
    }
  },

  async updateMovieListTitle(
    listId: string,
    title: string,
    description: string,
  ): Promise<MovieList> {
    const token = useAuthStore.getState().token
    if (!token) {
      throw Error('User is not logged in.')
    }

    try {
      const response = await fetch(`${API_URL}/lists/updateMovieList/${listId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update movie list')
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating movie list:', error)
      throw error instanceof Error ? error : new Error('Failed to update movie list')
    }
  },

  async deleteMovieList(listId: string): Promise<void> {
    const token = useAuthStore.getState().token
    if (!token) {
      throw Error('User is not logged in.')
    }

    try {
      const response = await fetch(`${API_URL}/lists/deleteMovieList/${listId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete movie list')
      }
    } catch (error) {
      console.error('Error deleting movie list:', error)
      throw error instanceof Error ? error : new Error('Failed to delete movie list')
    }
  },

  async addMovieToList(listId: string, movieId: number): Promise<MovieList> {
  console.log(listId, movieId)
    const token = useAuthStore.getState().token
    if (!token) {
      throw Error('User is not logged in.')
    }

    try {
      const response = await fetch(`${API_URL}/lists/addMovieToList/${listId}/${movieId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add movie to list')
      }

      return await response.json()
    } catch (error) {
      console.error('Error adding movie to list:', error)
      throw error instanceof Error ? error : new Error('Failed to add movie to list')
    }
  },

  async removeMovieFromList(listId: string, movieId: number): Promise<MovieList> {
    const token = useAuthStore.getState().token
    if (!token) {
      throw Error('User is not logged in.')
    } 

    try {
      const response = await fetch(`${API_URL}/lists/removeMovieFromList/${listId}/${movieId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove movie from list')
      }

      return await response.json()
    } catch (error) {
      console.error('Error removing movie from list:', error)
      throw error instanceof Error ? error : new Error('Failed to remove movie from list')
    }
  },

  async createMovieList(title: string, description: string): Promise<MovieList> {
    const token = useAuthStore.getState().token
    const userId = useAuthStore.getState().user?.id
    if (!token) {
      throw Error('User is not logged in.')
    }

    try {
      const response = await fetch(`${API_URL}/lists/createMovieList`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, userId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create movie list')
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating movie list:', error)
      throw error instanceof Error ? error : new Error('Failed to create movie list')
    }
  },
}
