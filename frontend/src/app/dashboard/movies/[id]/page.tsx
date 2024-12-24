// /dashboard/movies[id]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { Movie } from '@/types/movie'
import { Badge } from '@/components/ui/badge'
import { Clock, Star, Calendar, User, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MovieActions } from '@/components/movies/MovieActions'

export default function MoviePage() {
  const params = useParams()
  const router = useRouter()
  const movieId = Number(params.id)
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const storedMovie = localStorage.getItem('selectedMovie')
        if (storedMovie) {
          const parsedMovie = JSON.parse(storedMovie)
          if (parsedMovie.id === movieId) {
            setMovie(parsedMovie)
            setLoading(false)
            return
          }
        }

        const response = await fetch(`/api/movies/${movieId}`)
        const data = await response.json()
        setMovie(data)
      } catch (error) {
        console.error('Error fetching movie:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [movieId])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Movie not found</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="sticky top-8 space-y-4">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300"
              />
              <MovieActions movie={movie} />
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((genre, index) => (
                  <Badge key={index} variant="secondary">
                    {String(genre)}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{movie.releaseYear}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{movie.duration} min</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{movie.rating}/10</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{movie.director}</span>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">{movie.overview}</p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Movie Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-muted-foreground">Director</h3>
                  <p className="text-lg">{movie.director}</p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Release Year</h3>
                  <p className="text-lg">{movie.releaseYear}</p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Duration</h3>
                  <p className="text-lg">{movie.duration} minutes</p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Rating</h3>
                  <p className="text-lg">{movie.rating}/10</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
