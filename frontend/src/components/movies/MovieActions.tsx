// components/MovieActions.tsx
'use client'

import { Movie } from '@/types/movie'
import { AddToListDialog } from './AddToListDialog'

interface MovieActionsProps {
  movie: Movie
}

export function MovieActions({ movie }: MovieActionsProps) {
  return (
    <div className="mt-6 space-y-4">
      <AddToListDialog movie={movie} />
    </div>
  )
}
