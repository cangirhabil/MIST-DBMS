// components/MovieListCard.tsx
import { MovieList } from '@/types/MovieList'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Edit, Trash2, Film } from 'lucide-react'

interface MovieListCardProps {
  list: MovieList
  onEdit: (list: MovieList) => void
  onDelete: (list: MovieList) => void
  onView: (list: MovieList) => void
}

export const MovieListCard = ({ list, onEdit, onDelete, onView }: MovieListCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{list.title}</CardTitle>
            <CardDescription>{list.description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(list)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(list)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Film className="h-4 w-4" />
          <span>{list.movieCount} Movies</span>
          <span className="mx-2">•</span>
          <span>{new Date(list.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="secondary" onClick={() => onView(list)}>
          View Movies
        </Button>
      </CardFooter>
    </Card>
  )
}
