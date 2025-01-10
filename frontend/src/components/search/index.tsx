// components/MovieSearch.tsx
'use client'

import { movieService } from '@/lib/services/movie.service'
import { useState, useEffect, useCallback } from 'react'
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
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Movie } from '@/types/movie'

const CURRENT_YEAR = new Date().getFullYear()

const GENRES = ['All', 'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance']
const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'year', label: 'Release Year' },
  { value: 'rating', label: 'Rating' },
  { value: 'title', label: 'Title' },
] as const

type SortOption = (typeof SORT_OPTIONS)[number]['value']

export default function MovieSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery] = useDebounce(searchQuery, 300)
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [yearRange, setYearRange] = useState([1900, CURRENT_YEAR])
  const [sortBy, setSortBy] = useState<SortOption>('relevance')

  const searchMovies = useCallback(async () => {
    if (debouncedQuery.length < 2 && selectedGenre === 'all') {
      setMovies([])
      return
    }

    setLoading(true)
    try {
      const searchParams = {
        searchTerm: debouncedQuery,
        genre: selectedGenre !== 'all' ? selectedGenre : undefined,
        startYear: yearRange[0],
        endYear: yearRange[1],
        sortBy,
      }

      const response = await movieService.searchMovies(searchParams)
      setMovies(response.results)
    } catch (error) {
      toast.error('Failed to search movies')
      console.error('Movie search error:', error)
      setMovies([])
    } finally {
      setLoading(false)
    }
  }, [debouncedQuery, selectedGenre, yearRange, sortBy])

  useEffect(() => {
    searchMovies()
  }, [searchMovies])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value)
  }

  const handleSortChange = (value: SortOption) => {
    setSortBy(value)
  }

  const handleYearRangeChange = (value: number[]) => {
    setYearRange(value)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Search Controls */}
        <div className="grid gap-4 md:grid-cols-4">
          <Input
            placeholder="Search movies..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="md:col-span-2"
          />
          <Select value={selectedGenre} onValueChange={handleGenreChange}>
            <SelectTrigger>
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              {GENRES.map((genre) => (
                <SelectItem key={genre.toLowerCase()} value={genre.toLowerCase()}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
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
            max={CURRENT_YEAR}
            step={1}
            value={yearRange}
            onValueChange={handleYearRangeChange}
            className="my-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{yearRange[0]}</span>
            <span>{yearRange[1]}</span>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            {debouncedQuery.length > 0 ? 'No movies found' : 'Start typing to search movies'}
          </div>
        )}
      </div>
    </div>
  )
}
