export interface Movie {
  id: number
  title: string
  releaseYear: number
  posterUrl: string
  rating: number
  genres: string[]
  director: string
  duration: number
  overview: string
}

export interface SearchParams {
  query: string
  genre: string
  yearRange: [number, number]
  sortBy: 'rating' | 'year' | 'title' | 'relevance'
}