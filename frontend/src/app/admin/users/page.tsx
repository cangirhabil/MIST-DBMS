"use client"
import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Trash2 } from 'lucide-react'

// Types
type User = {
  id: string
  name?: string
  email?: string
  password?: string
}

// Search Component
const SearchBar = ({ onSearch }: { onSearch: (value: string) => void }) => {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Kullanıcı ara..."
        className="pl-8"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
}

// Users Table Component
const UsersTable = ({
  users,
  onDeleteUser,
}: {
  users: User[]
  onDeleteUser: (id: string) => void
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const handleDeleteClick = (userId: string) => {
    if (deleteConfirmId === userId) {
      onDeleteUser(userId)
      setDeleteConfirmId(null)
    } else {
      setDeleteConfirmId(userId)
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>İsim</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">İşlemler</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.id}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell className="text-right">
              <Button
                variant={deleteConfirmId === user.id ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => handleDeleteClick(user.id)}
              >
                {deleteConfirmId === user.id ? 'Silmeyi Onayla' : <Trash2 className="h-4 w-4" />}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// Main Users Page Component
const UsersPage = () => {
  // Örnek veri - gerçek uygulamada API'den gelecek
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Ahmet Yılmaz', email: 'ahmet@example.com' },
    { id: '2', name: 'Mehmet Demir', email: 'mehmet@example.com' },
    { id: '3', name: 'Ayşe Kaya', email: 'ayse@example.com' },
  ])

  const [filteredUsers, setFilteredUsers] = useState<User[]>(users)

  const handleSearch = (searchTerm: string) => {
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter((user) => user.id !== userId)
    setUsers(updatedUsers)
    setFilteredUsers(updatedUsers)
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Kullanıcı Yönetimi</CardTitle>
          <CardDescription>Sistemde kayıtlı kullanıcıları görüntüleyin ve yönetin.</CardDescription>
          <div className="mt-4">
            <SearchBar onSearch={handleSearch} />
          </div>
        </CardHeader>
        <CardContent>
          <UsersTable users={filteredUsers} onDeleteUser={handleDeleteUser} />
        </CardContent>
      </Card>
    </div>
  )
}

export default UsersPage
