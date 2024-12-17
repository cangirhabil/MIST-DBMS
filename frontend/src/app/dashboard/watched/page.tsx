'use client'
import React from 'react'
import loadingAnimation from '../../../../public/loading-animation.json'
import { movieWatchedListService } from '@/services/movieWatchedList.service'
import { toast } from '@/hooks/use-toast'
import Lottie from 'lottie-react'

const Rate: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [watchedMovies, setWatchedMovies] = React.useState<any[]>([])

  const fetchWatchedMovies = async () => {
    try {
      setIsLoading(true)
      const movies = await movieWatchedListService.getWatchedMovies()
      setWatchedMovies(movies)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch watched movies',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteMovie = async (movieId: number) => {
    try {
      setIsLoading(true)
      // Önce veritabanından silme işlemi
      console.log('movieId:', movieId)
      await movieWatchedListService.removeMovieFromWatchedList(movieId)

      // Başarılı olursa UI'dan kaldır
      setWatchedMovies((movies) => movies.filter((movie) => movie.id !== movieId))

      toast({
        title: 'Success',
        description: 'Movie removed from watched list',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove movie',
      })
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchWatchedMovies()
  }, [])

  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-50 h-50">
            <Lottie animationData={loadingAnimation} loop={true} />
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Watched Movies</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {watchedMovies.map((movie) => (
            <div
              key={movie.id}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[2/3] bg-gray-200">
                <img
                  src={movie.posterUrl || 'https://via.placeholder.com/300x450'}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-white font-semibold text-lg">{movie.title}</h3>
                <p className="text-gray-300 text-sm">
                  {movie.releaseYear} • {movie.director}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-yellow-400">★</span>
                    <span className="text-white ml-1">{movie.rating}/5</span>
                  </div>
                  <button
                    onClick={() => handleDeleteMovie(movie.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Rate
