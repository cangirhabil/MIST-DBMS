import { movieService } from '@/services/movie.service'
import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { MovieCard } from './MovieCard'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import type { Movie } from '@/types/movie'
import { toast } from 'sonner'

const LoadingSkeleton = () => {
  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <div className="w-full h-48 bg-muted animate-pulse rounded-md" />
      <div className="space-y-2">
        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
        <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
      </div>
    </div>
  );
};

const LoadingGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <LoadingSkeleton key={index} />
      ))}
    </div>
  );
};

const genres = ['All', 'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance']
const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'year', label: 'Release Year' },
  { value: 'rating', label: 'Rating' },
  { value: 'title', label: 'Title' },
]

export default function MovieSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery] = useDebounce(searchQuery, 300)
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [yearRange, setYearRange] = useState([1900, new Date().getFullYear()])
  const [sortBy, setSortBy] = useState<string>('relevance')

  useEffect(() => {
    const searchMovies = async () => {
      if (debouncedQuery.length < 2 && selectedGenre === 'all') return

      setLoading(true)
      try {
        const searchParams = {
          searchTerm: debouncedQuery,
          genre: selectedGenre !== 'all' ? selectedGenre : undefined,
          startYear: yearRange[0],
          endYear: yearRange[1],
          sortBy: sortBy as 'relevance' | 'year' | 'rating' | 'title',
        }

        const response = await movieService.searchMovies(searchParams)
        setMovies(response.results)
      } catch (error) {
        toast.error('Failed to search movies')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    searchMovies()
  }, [debouncedQuery, selectedGenre, yearRange, sortBy])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Search Controls */}
        <div className="grid gap-4 md:grid-cols-4">
          <Input
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:col-span-2"
          />
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger>
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre.toLowerCase()} value={genre.toLowerCase()}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Range Slider */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Year Range</label>
          <Slider
            min={1900}
            max={new Date().getFullYear()}
            step={1}
            value={yearRange}
            onValueChange={setYearRange}
            className="my-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{yearRange[0]}</span>
            <span>{yearRange[1]}</span>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <LoadingGrid />
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {debouncedQuery.length > 0 ? 'No movies found' : 'Start typing to search movies'}
          </div>
        )}
      </div>
    </div>
  )
}