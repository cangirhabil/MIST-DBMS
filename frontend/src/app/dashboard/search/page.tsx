'use client'
import { useState } from 'react'
import MovieSearch from '@/components/search/index'
import { LoadingScreen } from '@/components/loading'

export default function SearchPage() {
  const [isLoading] = useState(false)
  return (
    <div>
      {isLoading && <LoadingScreen />}
      <div className="container mx-auto py-8 max-w-6xl">
        <MovieSearch />
      </div>
    </div>
  )
}
