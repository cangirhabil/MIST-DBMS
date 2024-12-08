// src/interfaces/movie.interface.ts
import { Genre } from './genre.interface';
export interface Movie {
  id: number;
  title: string;
  releaseYear: number;
  posterUrl?: string;
  rating?: number;
  director?: string;
  duration?: number;
  overview?: string;
  genres?: Genre[];
}

