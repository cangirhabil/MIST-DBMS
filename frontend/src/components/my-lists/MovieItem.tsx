// components/MovieItem.tsx

'use client'

import { Movie } from '@/types/Movie'
import { Button } from '@/components/ui/button'
import { Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { movieListService } from '@/services/movieList.service'
import { movieWatchedListService } from '@/services/movieWatchedList.service' // Add this import

interface MovieItemProps {
  movie: Movie
  listId: string
  onRemove: (movieId: number) => void
  watched?: boolean
  onToggleWatched?: (movieId: number) => void
}

import { useToast } from '@/hooks/use-toast'

export const MovieItem = ({
  movie,
  listId,
  onRemove,
  watched = false,
  onToggleWatched,
}: MovieItemProps) => {
  const { toast } = useToast()

  const handleToggleWatched = async () => {
    try {
      if (!watched) {
        // First, get the current watched list
        const watchedMovies = await movieWatchedListService.getWatchedMovies()

        // Check if movie already exists in the watched list
        const movieExists = watchedMovies.some((watchedMovie) => watchedMovie.movieId === movie.id)

        if (movieExists) {
          toast({
            title: 'Already in watched list',
            description: `${movie.title} is already in your watched list.`,
            variant: 'default',
          })
          return
        }

        // If movie doesn't exist, add it to watched list
        await movieWatchedListService.addMovieToWatchedList({
          movieId: movie.id,
          title: movie.title,
          releaseYear: movie.releaseYear,
          posterUrl: movie.posterUrl ?? '',
          rating: movie.rating ?? 0,
          director: movie.director ?? '',
          duration: movie.duration ?? 0,
          overview: movie.overview ?? '',
        })
      } else {
        // Remove from watched list
        await movieWatchedListService.removeMovieFromWatchedList(movie.id)
      }

      if (onToggleWatched) {
        onToggleWatched(movie.id)
      }

      toast({
        title: watched ? 'Marked as unwatched' : 'Marked as watched',
        description: `${movie.title} has been ${
          watched ? 'removed from' : 'added to'
        } your watched list.`,
      })
    } catch (error) {
      // Existing error handling code remains the same
      if (error instanceof Error) {
        let errorMessage = 'An unexpected error occurred'

        if (error.message.includes('Movie already in watched list')) {
          errorMessage = 'This movie is already in your watched list'
        } else if (error.message.includes('Movie not found in database')) {
          errorMessage = 'Movie not found in database'
        } else if (error.message.includes('User not found')) {
          errorMessage = 'User not found'
        } else if (error.message.includes('Movie not found in watched list')) {
          errorMessage = 'Movie is not in your watched list'
        }

        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update watched status',
          variant: 'destructive',
        })
      }
      console.error('Error updating watched status:', error)
    }
  }

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
      <Button
        variant={watched ? 'default' : 'outline'}
        size="icon"
        onClick={handleToggleWatched}
        className="mr-2"
      >
        <Eye className={`h-4 w-4 ${watched ? 'text-green-500' : 'text-muted-foreground'}`} />
      </Button>

      <Button variant="ghost" size="icon" onClick={handleRemoveMovie}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  )
}
