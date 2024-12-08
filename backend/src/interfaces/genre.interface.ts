// src/interfaces/genre.interface.ts
import { Movie } from './movie.interface';
export interface Genre {
  id: number;
  name: string;
  movies?: Movie[];
}
