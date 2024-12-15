// app/movies/[id]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { Movie } from '@/types/Movie'
import { Badge } from '@/components/ui/badge'
import { Clock, Star, Calendar, User, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function MoviePage() {
  const params = useParams()
  const router = useRouter()
  const movieId = Number(params.id)

  const movies: Movie[] = [
    {
      id: 1,
      title: 'Inception',
      releaseYear: 2010,
      posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      rating: 8.8,
      genres: ['Sci-Fi', 'Action'],
      director: 'Christopher Nolan',
      duration: 148,
      overview: 'A thief who steals corporate secrets through dream-sharing technology...',
    },
    {
      id: 2,
      title: 'The Matrix',
      releaseYear: 1999,
      posterUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
      rating: 8.7,
      genres: ['Sci-Fi', 'Action'],
      director: 'Lana Wachowski, Lilly Wachowski',
      duration: 136,
      overview:
        'A computer hacker learns from mysterious rebels about the true nature of his reality...',
    },
    {
      id: 3,
      title: 'Interstellar',
      releaseYear: 2014,
      posterUrl: 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
      rating: 8.6,
      genres: ['Sci-Fi', 'Adventure'],
      director: 'Christopher Nolan',
      duration: 169,
      overview:
        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival...",
    },
    {
      id: 4,
      title: 'The Dark Knight',
      releaseYear: 2008,
      posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      rating: 9.0,
      genres: ['Action', 'Crime', 'Drama'],
      director: 'Christopher Nolan',
      duration: 152,
      overview:
        'When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham...',
    },
  ]

  const movie = movies.find((m) => m.id === movieId)

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
          {/* Left Column - Poster */}
          <div className="md:col-span-1">
            <div className="sticky top-8">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300"
              />
            </div>
          </div>

          {/* Right Column - Details */}
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

            {/* Key Information */}
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

            {/* Overview */}
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">{movie.overview}</p>
            </div>

            {/* Technical Details */}
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
