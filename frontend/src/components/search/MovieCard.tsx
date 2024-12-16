'use client'

import { Movie } from '@/types/Movie'
import { Star, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  const router = useRouter()

  const handleClick = () => {
    localStorage.setItem('selectedMovie', JSON.stringify(movie))
    router.push(`/dashboard/movies/${movie.id}`)
  }

  return (
    <div
      className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="aspect-[2/3] relative">
        <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <h3 className="text-white font-semibold text-lg line-clamp-1">{movie.title}</h3>
        <p className="text-gray-300 text-sm">
          {movie.releaseYear} • {movie.genres.join(', ')}
        </p>
        <div className="mt-2 flex items-center gap-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-white ml-1">{movie.rating}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Clock className="h-4 w-4" />
            <span className="ml-1">{movie.duration}m</span>
          </div>
        </div>
      </div>
    </div>
  )
}
