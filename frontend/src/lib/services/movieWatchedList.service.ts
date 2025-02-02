import useAuthStore from '@/store/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined')
}

export const movieWatchedListService = {
  async addMovieToWatchedList(movieData: {
    movieId: number
    title: string
    releaseYear: number
    posterUrl: string
    rating: number
    director: string
    duration: number
    overview: string
  }): Promise<any> {
    const token = useAuthStore.getState().token
    const userId = useAuthStore.getState().user?.id
    if (!token || !userId) {
      throw Error('User is not logged in.')
    }

    try {
      const response = await fetch(`${API_URL}/watched/users/${userId}/watched`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        // throw new Error(errorData.error || 'Failed to add movie to watched list')
      }

      return await response.json()
    } catch (error) {
      console.error('Error adding movie to watched list:', error)
      throw error instanceof Error ? error : new Error('Failed to add movie to watched list')
    }
  },

  async removeMovieFromWatchedList(movieId: number): Promise<void> {
    const token = useAuthStore.getState().token

    if (!token) {
      throw Error('User is not logged in.')
    }

    try {
      const response = await fetch(`${API_URL}/watched/watched/${movieId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove movie from watched list')
      }
    } catch (error) {
      console.error('Error removing movie from watched list:', error)
      throw error instanceof Error ? error : new Error('Failed to remove movie from watched list')
    }
  },

  async getWatchedMovies(): Promise<any[]> {
    const token = useAuthStore.getState().token
    const userId = useAuthStore.getState().user?.id
    if (!token || !userId) {
      throw Error('User is not logged in.')
    }

    try {
      const response = await fetch(`${API_URL}/watched/users/${userId}/watched`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch watched movies')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching watched movies:', error)
      throw error instanceof Error ? error : new Error('Failed to fetch watched movies')
    }
  },
}
