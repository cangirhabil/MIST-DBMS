// components/MovieActions.tsx
'use client'

import { Movie } from '@/types/Movie'
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
