// components/ViewListDialog.tsx

import { MovieList } from '@/types/MovieList'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search } from 'lucide-react'
import { MovieItem } from './MovieItem'

interface ViewListDialogProps {
  list: MovieList | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onRemoveMovie: (movieId: number) => void
}

export const ViewListDialog = ({
  list,
  isOpen,
  onOpenChange,
  searchQuery,
  onSearchChange,
  onRemoveMovie,
}: ViewListDialogProps) => {

  const filteredMovies = list?.movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleRemoveMovie = (movieId: number) => {
    onRemoveMovie(movieId)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{list?.title}</DialogTitle>
          <DialogDescription>{list?.description}</DialogDescription>
        </DialogHeader>

        <div className="relative my-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-9"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            
            {filteredMovies?.map((movie) => (
              <MovieItem 
                key={`${list?.id}-${movie.id}`}
                movie={movie}
                onRemove={handleRemoveMovie}
                listId={list?.id || ''}              />
            ))}
            {filteredMovies?.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No movies found
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}