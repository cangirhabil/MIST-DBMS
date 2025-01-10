'use client'
import React from 'react'
import { Plus } from 'lucide-react'
import { MovieList } from '@/types/MovieList'
import { Movie } from '@/types/movie'

import { Button } from '@/components/ui/button'
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
import { MovieListCard } from '@/components/my-lists/MovieListCard'
import { ViewListDialog } from '@/components/my-lists/ViewListDialog'
import { movieListService } from '@/lib/services/movieList.service'
import { LoadingScreen } from '@/components/loading'

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
  const [error, setError] = React.useState<string | null>(null)

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

  const handleCreateList = async () => {
    if (!newList.title) return

    try {
      const createdList = await movieListService.createMovieList(newList.title, newList.description)
      setLists((prev) => [...prev, createdList])
      setNewList({ title: '', description: '' })
      setIsCreateOpen(false)
    } catch (error) {
      console.error('Failed to create list:', error)
      setError('Failed to create list. Please try again.')
    }
  }

  const handleEditList = async () => {
    if (!editingList) return

    try {
      const updatedList = await movieListService.updateMovieListTitle(
        editingList.id,
        editingList.title,
        editingList.description,
      )

      setLists((prev) => prev.map((list) => (list.id === editingList.id ? updatedList : list)))

      setIsEditOpen(false)
      setEditingList(null)
    } catch (error) {
      console.error('Failed to update list:', error)
      setError('Failed to update list. Please try again.')
    }
  }

  const handleDeleteList = async () => {
    if (!listToDelete) return

    try {
      await movieListService.deleteMovieList(listToDelete.id)
      setLists((prev) => prev.filter((list) => list.id !== listToDelete.id))
      setIsDeleteDialogOpen(false)
      setListToDelete(null)
    } catch (error) {
      console.error('Failed to delete list:', error)
      setError('Failed to delete list. Please try again.')
    }
  }

  React.useEffect(() => {
    const fetchLists = async () => {
      setIsLoading(true)
      try {
        const fetchedLists = await movieListService.getMovieListsByUserId()
        setLists(fetchedLists)
      } catch (error) {
        console.error('Failed to fetch movie lists:', error)
        setError('Failed to fetch movie lists. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLists()
  }, [])

  const handleRemoveMovieFromList = (listId: string, movieId: number) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          const updatedList = {
            ...list,
            movies: list.movies.filter((m) => m.id !== movieId),
            movieCount: list.movieCount - 1,
          }
          setSelectedList(updatedList)
          return updatedList
        }
        return list
      }),
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-24 h-24">
            <LoadingScreen />
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2">
          {error}
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
