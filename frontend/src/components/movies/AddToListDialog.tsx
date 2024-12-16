// components/AddToListDialog.tsx
'use client'

import { useState } from 'react'
import { Movie } from '@/types/Movie'
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
  id: number
  name: string
}

export function AddToListDialog({ movie }: AddToListDialogProps) {
  const [selectedList, setSelectedList] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState<number | null>(null)
  const { toast } = useToast()

  // Mock data - gerçek uygulamada API'den gelecek
  const movieLists: MovieList[] = [
    { id: 1, name: 'Favori Filmler' },
    { id: 2, name: 'İzlenecekler' },
    { id: 3, name: 'En İyiler' },
    { id: 4, name: 'Aksiyon Filmleri' },
    { id: 5, name: 'Drama' },
  ]

  const handleAddToList = async (listId: number) => {
    try {
      setIsLoading(listId)

      // Gerçek API çağrısı burada yapılacak
      // await fetch(`/api/lists/${listId}/movies`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ movieId: movie.id }),
      // })

      // Simüle edilmiş gecikme
      await new Promise((resolve) => setTimeout(resolve, 1000))

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
            {movieLists.map((list) => (
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
