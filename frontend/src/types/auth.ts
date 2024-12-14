export interface UserRole {
  email: string
  name?: string
  surname?: string
  uid: string
}

export interface AuthResponse {
  success: boolean
  user: UserRole | null
  error?: string
}
