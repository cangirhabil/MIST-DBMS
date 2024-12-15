'use client'
import React from 'react'
import loadingAnimation from '../../../../public/loading-animation.json'

import dynamic from 'next/dynamic'
import { AuthGuard } from '@/components/auth/AuthGuard'
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

const Rate: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  React.useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 0)
    return () => clearTimeout(timer)
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
          {/* Example data - replace with actual watched movies data */}
          {[1, 2, 3, 4].map((movie) => (
            <div
              key={movie}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => {
                // Add navigation logic here
                // router.push(`/movies/${movie.id}`)
              }}
            >
              <div className="aspect-[2/3] bg-gray-200">
                {/* Replace with actual movie image */}
                <img
                  src="https://via.placeholder.com/300x450"
                  alt="Movie poster"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-white font-semibold text-lg">Movie Title</h3>
                <p className="text-gray-300 text-sm">2023 • Action, Drama</p>
                <div className="mt-2 flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="text-white ml-1">4.5/5</span>
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
