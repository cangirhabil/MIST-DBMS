'use client'
import React, { useState, useEffect } from 'react'
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
import { userService } from '@/lib/services/user.service'
import { User } from '@/types/user'

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

const UsersTable = ({
  users = [],
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

  if (!users || users.length === 0) {
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
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              Kullanıcı bulunamadı
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
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

interface UsersResponse {
  users: User[]
  total: number
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await userService.getAllUsers()
        // API'den gelen yanıtı doğru şekilde işle
        const data = response as unknown as UsersResponse
        setUsers(data.users)
        setFilteredUsers(data.users)
        setTotal(data.total)
      } catch (err) {
        setError('Kullanıcılar yüklenirken bir hata oluştu')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users)
      return
    }

    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await userService.deleteUser(userId)
      const updatedUsers = users.filter((user) => user.id !== userId)
      setUsers(updatedUsers)
      setFilteredUsers(updatedUsers)
      setTotal((prev) => prev - 1) // Total sayısını güncelle
    } catch (err) {
      setError('Kullanıcı silinirken bir hata oluştu')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="w-full">
          <CardContent className="flex justify-center items-center h-40">Yükleniyor...</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Kullanıcı Yönetimi</CardTitle>
          <CardDescription>
            Sistemde kayıtlı {total} kullanıcıyı görüntüleyin ve yönetin.
          </CardDescription>
          {error && <div className="text-red-500 mt-2">{error}</div>}
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
