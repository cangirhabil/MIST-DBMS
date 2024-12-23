import { Movie } from '../types/Movie'

const API_BASE_URL = process.env.API_URL || 'http://localhost:3003'

interface SearchMoviesResponse {
  results: Movie[]
  total: number
}

interface SearchParams {
  searchTerm?: string
  genre?: string
  startYear?: number
  endYear?: number
  sortBy?: 'relevance' | 'year' | 'rating' | 'title'
  page?: number
  limit?: number
}

interface MovieResponse {
  id: number
  title: string
  releaseYear: number
  posterUrl: string | null
  rating: number | null
  director: string | null
  duration: number | null
  overview: string | null
  genres: string[]
}

export const movieService = {
  async searchMovies(params: SearchParams): Promise<SearchMoviesResponse> {
    try {
      const queryParams = new URLSearchParams()

      // Add all valid parameters to query string
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString())
        }
      })

      const response = await fetch(`${API_BASE_URL}/movie/search?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to search movies')
      }

      const data = await response.json()

      // Transform the response to match the expected format
      const transformedData: SearchMoviesResponse = {
        results: data.results.map((movie: MovieResponse) => ({
          id: movie.id,
          title: movie.title,
          releaseYear: movie.releaseYear,
          posterUrl: movie.posterUrl,
          rating: movie.rating,
          director: movie.director,
          duration: movie.duration,
          overview: movie.overview,
          genres: movie.genres,
        })),
        total: data.total,
      }

      return transformedData
    } catch (error) {
      console.error('Error searching movies:', error)
      throw error instanceof Error ? error : new Error('Failed to search movies')
    }
  },

  // Add other movie-related service methods here if needed
  // For example:

  async getMovieDetails(id: number): Promise<Movie> {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch movie details')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching movie details:', error)
      throw error instanceof Error ? error : new Error('Failed to fetch movie details')
    }
  },
}
