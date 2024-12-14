import { Movie } from "./Movie"

export interface Genre {
  id: number
  name: string
  movies: Movie[]
}
