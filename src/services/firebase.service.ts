import { auth, db } from '@/firebase'

import { onAuthStateChanged, User } from 'firebase/auth'
import { updateDoc, doc, getDoc, collection, getDocs, setDoc } from 'firebase/firestore'

export const updateUserProfile = async (updatedData: Record<string, any>): Promise<void> => {
  const uid = auth.currentUser?.uid

  if (!uid) {
    throw new Error('Kullanıcı giriş yapmamış.')
  }

  try {
    const userRef = doc(db, 'users', uid)

    // Firestore üzerinde kullanıcı verilerini güncelle
    await updateDoc(userRef, {
      ...updatedData,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Kullanıcı profili güncelleme hatası:', error)
    throw new Error('Profil güncellenirken bir hata oluştu.')
  }
}

export const getUserProfile = async (): Promise<User | null> => {
  if (!auth.currentUser) {
    // Kullanıcının giriş yapmasını bekle
    await new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          unsubscribe()
          resolve()
        }
      })
    })
  }
  const uid = auth.currentUser?.uid

  if (!uid) {
    throw new Error('Kullanıcı giriş yapmamış.')
  }

  try {
    const userRef = doc(db, 'users', uid)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      return userDoc.data() as User
    } else {
      console.warn('Kullanıcı profili bulunamadı.')
      return null
    }
  } catch (error) {
    console.error('Kullanıcı profili alma hatası:', error)
    throw new Error('Profil alınırken bir hata oluştu.')
  }
}
