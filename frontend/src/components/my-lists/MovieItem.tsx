// components/MovieItem.tsx
'use client'

import { Movie } from '@/types/Movie'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { movieListService } from '@/services/movieList.service'

interface MovieItemProps {
  movie: Movie
  listId: string
  onRemove: (movieId: number) => void
}

import { useToast } from '@/hooks/use-toast'

export const MovieItem = ({ movie, listId, onRemove }: MovieItemProps) => {
  const { toast } = useToast()

  const handleRemoveMovie = async () => {
    try {
      await movieListService.removeMovieFromList(listId, movie.id)
      onRemove(movie.id)
      toast({
        title: 'Movie removed',
        description: `${movie.title} has been removed from the list.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove movie from list.',
        variant: 'destructive',
      })
      console.error('Error removing movie from list:', error)
    }
  }

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
      <Button variant="ghost" size="icon" onClick={handleRemoveMovie}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  )
}
