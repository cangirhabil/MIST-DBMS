import { MovieList } from "./MovieList"

export type User = {
  id: string
  name?: string
  email?: string
  password?: string
  Lists?: MovieList[]
}
