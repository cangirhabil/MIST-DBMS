'use client'
import { createContext, useContext, useState } from 'react'

type UserContextType = {
  user: any
  setUser: (user: any) => void
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null)
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}
