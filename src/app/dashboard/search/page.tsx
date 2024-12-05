'use client'
import loadingAnimation from '../../../../public/loading-animation.json'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import dynamic from 'next/dynamic'
import MovieSearch from '@/components/search/index'

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

export default function SearchPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-50 h-50">
            <Lottie animationData={loadingAnimation} loop={true} />
          </div>
        </div>
      )}
      <div className="container mx-auto py-8 max-w-6xl">
        <MovieSearch />
      </div>
    </div>
  )
}
