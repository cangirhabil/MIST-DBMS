'use client'
import React from 'react'
import loadingAnimation from '../../../../public/loading-animation.json'
import dynamic from 'next/dynamic'
import { Plus, Edit, Trash2, Film, Search } from 'lucide-react'
import { MovieList } from '@/types/MovieList'
import { Movie } from '@/types/movie'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MovieListCard } from '@/components/my-lists/MovieListCard'
import { ViewListDialog } from '@/components/my-lists/ViewListDialog'

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

const MyListsPage: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [lists, setLists] = React.useState<MovieList[]>([])
  const [selectedList, setSelectedList] = React.useState<MovieList | null>(null)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isViewOpen, setIsViewOpen] = React.useState(false)
  const [newList, setNewList] = React.useState({
    title: '',
    description: '',
  })
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [editingList, setEditingList] = React.useState<MovieList | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [listToDelete, setListToDelete] = React.useState<MovieList | null>(null)

  const handleAddMovieToList = (listId: string, movie: Movie) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            movies: [...list.movies, movie],
            movieCount: list.movieCount + 1,
          }
        }
        return list
      }),
    )
  }

  const handleRemoveMovieFromList = (listId: string, movieId: number) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            movies: list.movies.filter((m) => m.id !== movieId),
            movieCount: list.movieCount - 1,
          }
        }
        return list
      }),
    )
  }

  const handleEditList = () => {
    if (!editingList) return

    setLists((prev) => prev.map((list) => (list.id === editingList.id ? { ...editingList } : list)))

    setIsEditOpen(false)
    setEditingList(null)
  }

  const handleCreateList = () => {
    if (!newList.title) return

    const newListItem: MovieList = {
      id: Date.now().toString(),
      title: newList.title,
      description: newList.description,
      movieCount: 0,
      createdAt: new Date().toISOString(),
      movies: [],
    }

    setLists((prev) => [...prev, newListItem])
    setNewList({ title: '', description: '' })
    setIsCreateOpen(false)
  }

  const handleDeleteList = () => {
    if (!listToDelete) return
    setLists((prev) => prev.filter((list) => list.id !== listToDelete.id))
    setIsDeleteDialogOpen(false)
    setListToDelete(null)
  }

  React.useEffect(() => {
    setLists([
      {
        id: '1',
        title: 'Best Sci-Fi Movies',
        description: 'My favorite science fiction movies',
        movieCount: 3,
        createdAt: '2024-03-20',
        movies: [
          {
            id: 1,
            title: 'Inception',
            releaseYear: 2010,
            posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
            rating: 8.8,
            genres: ['Sci-Fi', 'Action'],
            director: 'Christopher Nolan',
            duration: 148,
            overview: 'A thief who steals corporate secrets through dream-sharing technology...',
          },
        ],
      },
      {
        id: '2',
        title: 'Classic Movies',
        description: 'A collection of timeless classic movies',
        movieCount: 2,
        createdAt: '2024-03-21',
        movies: [
          {
            id: 2,
            title: 'The Godfather',
            releaseYear: 1972,
            posterUrl: 'https://image.tmdb.org/t/p/w500/rPdtLWNsZmAtoZl9PK7S2wE3qiS.jpg',
            rating: 9.2,
            genres: ['Crime', 'Drama'],
            director: 'Francis Ford Coppola',
            duration: 175,
            overview:
              'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
          },
          {
            id: 3,
            title: 'Casablanca',
            releaseYear: 1942,
            posterUrl: 'https://image.tmdb.org/t/p/w500/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg',
            rating: 8.5,
            genres: ['Drama', 'Romance'],
            director: 'Michael Curtiz',
            duration: 102,
            overview:
              'A cynical expatriate American cafe owner struggles to decide whether or not to help his former lover and her fugitive husband escape the Nazis in French Morocco.',
          },
        ],
      },
      {
        id: '3',
        title: 'Animated Movies',
        description: 'Top animated movies for all ages',
        movieCount: 2,
        createdAt: '2024-03-22',
        movies: [
          {
            id: 4,
            title: 'Toy Story',
            releaseYear: 1995,
            posterUrl: 'https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg',
            rating: 8.3,
            genres: ['Animation', 'Adventure'],
            director: 'John Lasseter',
            duration: 81,
            overview:
              "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
          },
          {
            id: 5,
            title: 'Spirited Away',
            releaseYear: 2001,
            posterUrl: 'https://image.tmdb.org/t/p/w500/dL11DBPcRhWWnJcFXl9A07MrqTI.jpg',
            rating: 8.6,
            genres: ['Animation', 'Fantasy'],
            director: 'Hayao Miyazaki',
            duration: 125,
            overview:
              "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
          },
        ],
      },
    ])
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-24 h-24">
            <Lottie animationData={loadingAnimation} loop={true} />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Movie Lists</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New List
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New List</DialogTitle>
              <DialogDescription>
                Create a new movie list to organize your favorite films.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">List Name</Label>
                <Input
                  id="title"
                  value={newList.title}
                  onChange={(e) => setNewList((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter list name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newList.description}
                  onChange={(e) => setNewList((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter list description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateList}>Create List</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-6">
        {lists.map((list) => (
          <MovieListCard
            key={list.id}
            list={list}
            onEdit={(list) => {
              setEditingList(list)
              setIsEditOpen(true)
            }}
            onDelete={(list) => {
              setListToDelete(list)
              setIsDeleteDialogOpen(true)
            }}
            onView={(list) => {
              setSelectedList(list)
              setIsViewOpen(true)
            }}
          />
        ))}
      </div>

      {/* Add Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit List</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">List Name</Label>
              <Input
                id="edit-title"
                value={editingList?.title || ''}
                onChange={(e) =>
                  setEditingList((prev) => prev && { ...prev, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editingList?.description || ''}
                onChange={(e) =>
                  setEditingList((prev) => prev && { ...prev, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditList}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete List</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{listToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteList}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View List Dialog */}
      <ViewListDialog
        list={selectedList}
        isOpen={isViewOpen}
        onOpenChange={setIsViewOpen}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRemoveMovie={(movieId) => {
          if (selectedList) {
            handleRemoveMovieFromList(selectedList.id, movieId)
          }
        }}
      />
    </div>
  )
}

export default MyListsPage
