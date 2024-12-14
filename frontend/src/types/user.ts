import { MovieList } from "./MovieList"

type User = {
  id?: string
  name?: string
  surname?: string
  email: string
  password: string
  Lists?: MovieList[]
}
