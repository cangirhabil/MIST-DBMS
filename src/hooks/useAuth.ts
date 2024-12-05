// import { useEffect, useState } from 'react'
// import { onAuthStateChanged, User } from 'firebase/auth'
// import { auth } from '@/firebase'
     

// export function useAuth() {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [isAdmin, setIsAdmin] = useState(false)

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       setUser(user)

//       if (user) {
//         const userRole = await checkUserRole(user)
//         setIsAdmin(userRole?.role === 'admin')
//       }

//       setLoading(false)
//     })

//     return () => unsubscribe()
//   }, [])

//   return { user, loading, isAdmin }
// }
