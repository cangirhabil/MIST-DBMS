import { Movie } from './Movie'

export interface MovieList {
  id: string
  title: string
  description: string
  movieCount: number
  createdAt: string
  movies: Movie[]
}
