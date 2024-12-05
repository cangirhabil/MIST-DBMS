// components/MovieSearch.tsx
'use client'

import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Star, Clock, Calendar } from 'lucide-react'
import type { Movie } from '@/types/movie'

export default function MovieSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery] = useDebounce(searchQuery, 300)
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [yearRange, setYearRange] = useState([1900, new Date().getFullYear()])
  const [sortBy, setSortBy] = useState<string>('relevance')

  useEffect(() => {
    const fetchMovies = async () => {
      if (debouncedQuery.length < 2) {
        setMovies([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/search-movies`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: debouncedQuery,
            genre: selectedGenre,
            yearRange,
            sortBy,
          }),
        })

        const data = await response.json()
        setMovies(data.movies)
      } catch (error) {
        console.error('Error fetching movies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [debouncedQuery, selectedGenre, yearRange, sortBy])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Search Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Film Ara</h1>
          <p className="text-muted-foreground">Binlerce film arasında arama yapın</p>
        </div>

        {/* Search Controls */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Film adı veya anahtar kelime girin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger>
              <SelectValue placeholder="Tür seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Türler</SelectItem>
              <SelectItem value="action">Aksiyon</SelectItem>
              <SelectItem value="drama">Drama</SelectItem>
              <SelectItem value="comedy">Komedi</SelectItem>
              {/* Diğer türler */}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sıralama" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">İlgi Düzeyi</SelectItem>
              <SelectItem value="rating">Puan</SelectItem>
              <SelectItem value="year">Yıl</SelectItem>
              <SelectItem value="title">İsim</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? // Loading skeleton
              Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-[2/3] bg-gray-200 rounded-t-lg" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </CardContent>
                </Card>
              ))
            : movies.map((movie) => (
                <Card key={movie.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-[2/3] relative">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg line-clamp-1">{movie.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {movie.releaseYear}
                      <Star className="w-4 h-4 ml-2" />
                      {movie.rating.toFixed(1)}
                      <Clock className="w-4 h-4 ml-2" />
                      {`${Math.floor(movie.duration / 60)}s ${movie.duration % 60}d`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2">{movie.overview}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {movie.genres.map((genre) => (
                        <span key={genre} className="text-xs px-2 py-1 bg-secondary rounded-full">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {movies.length === 0 && !loading && debouncedQuery.length >= 2 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">Sonuç Bulunamadı</h3>
            <p className="text-muted-foreground">Farklı anahtar kelimelerle tekrar deneyin</p>
          </div>
        )}
      </div>
    </div>
  )
}
