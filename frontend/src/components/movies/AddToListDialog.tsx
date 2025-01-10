// components/AddToListDialog.tsx
'use client'
import { movieListService } from '@/lib/services/movieList.service'
import { useState, useEffect } from 'react'
import { Movie } from '@/types/movie'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface AddToListDialogProps {
  movie: Movie
}

interface MovieList {
  id: string
  name: string
}

export function AddToListDialog({ movie }: AddToListDialogProps) {
  const [selectedList, setSelectedList] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const [lists, setLists] = useState<MovieList[]>([])

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const movieLists = await movieListService.getMovieListsByUserId()

        console.log(movieLists)
        setLists(
          movieLists.map((list) => ({
            id: list.id,
            name: list.title,
          })),
        )
      } catch (error) {
        toast({
          title: 'Hata',
          description: 'Listeler yüklenirken bir hata oluştu.',
          variant: 'destructive',
        })
      }
    }
    fetchLists()
  }, [])

  const handleAddToList = async (listId: string) => {
    try {
      setIsLoading(listId)
      await movieListService.addMovieToList(listId, movie.id)

      setSelectedList(listId)
      toast({
        title: 'Başarıyla eklendi',
        description: `"${movie.title}" filmi listeye eklendi.`,
      })

      setTimeout(() => {
        setIsOpen(false)
        setSelectedList(null)
      }, 1000)
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Film listeye eklenirken bir hata oluştu.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2" size="lg">
          <Plus className="h-4 w-4" /> Listeye Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Listeye Ekle</DialogTitle>
          <DialogDescription>
            "{movie.title}" filmini eklemek istediğiniz listeyi seçin
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] mt-4 pr-4">
          <div className="flex flex-col gap-2">
            {lists.map((list) => (
              <Button
                key={list.id}
                variant="ghost"
                className={cn(
                  'w-full justify-between h-12',
                  selectedList === list.id && 'bg-primary/10',
                  isLoading === list.id && 'opacity-70 cursor-not-allowed',
                )}
                disabled={isLoading !== null}
                onClick={() => handleAddToList(list.id)}
              >
                <span>{list.name}</span>
                {isLoading === list.id ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : selectedList === list.id ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : null}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
