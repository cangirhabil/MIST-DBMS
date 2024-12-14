import { Genre } from './Genre'

export interface Movie {
  id: number
  title: string
  releaseYear: number
  posterUrl?: string 
  rating?: number 
  director?: string 
  duration?: number 
  overview?: string 
  genres: Genre[]
  createdAt: Date
  updatedAt: Date
}
