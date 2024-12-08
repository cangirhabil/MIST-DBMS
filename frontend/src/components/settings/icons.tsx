// components/icons.tsx
import {
  Loader2,
  User,
  // Add other icons as needed
} from 'lucide-react'

export const Icons = {
  spinner: Loader2,
  user: User,
  // Add other icon mappings as needed
}

export type Icon = keyof typeof Icons
