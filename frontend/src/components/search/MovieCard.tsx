// components/MovieCard.tsx
import { Movie } from '@/types/Movie'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Clock, Calendar } from 'lucide-react'

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[2/3] relative">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader className="space-y-1">
        <CardTitle className="line-clamp-1">{movie.title}</CardTitle>
        <div className="flex flex-wrap gap-1">
          {movie.genres.map((genre) => (
            <Badge key={genre.toString()} variant="secondary" className="text-xs">
              {genre.toString()}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{movie.releaseYear}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{movie.duration}m</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{movie.rating}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}