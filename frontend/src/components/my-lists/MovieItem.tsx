// components/MovieItem.tsx
'use client'

import { Movie } from '@/types/Movie'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'

interface MovieItemProps {
  movie: Movie
  onRemove: (movieId: number) => void
}

export const MovieItem = ({ movie, onRemove }: MovieItemProps) => {
  return (
    <div className="flex items-center gap-4 py-3">
      <Link href={`/dashboard/movies/${movie.id}`} className="flex items-center gap-4 flex-1">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-16 h-24 object-cover rounded-md"
        />
        <div className="flex-1">
          <h4 className="font-semibold">{movie.title}</h4>
          <p className="text-muted-foreground">{movie.releaseYear}</p>
        </div>
      </Link>
      <Button variant="ghost" size="icon" onClick={() => onRemove(movie.id)}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  )
}
