import { AuthResponse, UserRole } from '@/types/auth'
import { auth, db } from '../firebase'
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  UserCredential,
  updatePassword as firebaseUpdatePassword,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import useAuthStore from '@/store/auth'

const setSessionCookie = async (token: string) => {
  await fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, action: 'set' }),
  })
}

const deleteSessionCookie = async () => {
  await fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: 'delete' }),
  })
}

export const signupWithEmailAndPassword = async (
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> => {
  const setUser = useAuthStore.getState().setUser

  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    )

    const userData: UserRole = {
      email,
      name,
      uid: userCredential.user.uid,
    }

    // Kullanıcı verilerini Firestore'a kaydet
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      ...userData,
      createdAt: new Date().toISOString(),
    })

    // Oturum çerezi oluştur
    const sessionToken = await userCredential.user.getIdToken()
    await setSessionCookie(sessionToken)

    setUser(userData)

    return {
      success: true,
      user: userData,
    }
  } catch (error) {
    console.error('Kayıt hatası:', error)
    return {
      success: false,
      user: null,
      error: 'Hesap oluşturulurken bir hata oluştu.',
    }
  }
}

export const loginWithEmailAndPassword = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const setUser = useAuthStore.getState().setUser

  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password)

    // Kullanıcı rolünü kontrol et
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
    const userData = userDoc.data() as UserRole

    // Oturum çerezi oluştur
    const sessionToken = await userCredential.user.getIdToken()
    await setSessionCookie(sessionToken)

    // Kullanıcı bilgilerini Zustand mağazasına kaydet
    setUser(userData)

    return {
      success: true,
      user: userData,
    }
  } catch (error: any) {
    console.error('Giriş hatası:', error)

    let errorMessage = 'Giriş başarısız. Bilgilerinizi kontrol edin.'

    // Farklı Firebase kimlik doğrulama hataları için özel hata işleme
    switch (error.code) {
      case 'auth/invalid-credential':
        errorMessage = 'Geçersiz e-posta veya şifre.'
        break
      case 'auth/user-not-found':
        errorMessage = 'Bu e-posta adresiyle kullanıcı bulunamadı.'
        break
      case 'auth/wrong-password':
        errorMessage = 'Yanlış şifre.'
        break
      case 'auth/too-many-requests':
        errorMessage =
          'Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin.'
        break
      case 'auth/user-disabled':
        errorMessage = 'Bu hesap devre dışı bırakılmış.'
        break
    }

    return {
      success: false,
      user: null,
      error: errorMessage,
    }
  }
}

export const checkIsAdmin = async (uid: string) => {
  const userDoc = await getDoc(doc(db, 'users', uid))
  const userData = userDoc.data()
  return userData ? userData.role === 'admin' : false
}

export const logOut = async () => {
  const clearUser = useAuthStore.getState().clearUser
  try {
    clearUser()
    await auth.signOut()
    await deleteSessionCookie()
  } catch (error) {
    return error
  }
}

export const updatePassword = async (oldPassword: string, newPassword: string): Promise<string> => {
  try {
    const user = auth.currentUser
    if (!user || !user.email) {
      throw new Error('Kullanıcı giriş yapmamış.')
    }

    // Eski şifre ile kullanıcıyı yeniden kimlik doğrulama
    const credential = EmailAuthProvider.credential(user.email, oldPassword)
    await reauthenticateWithCredential(user, credential)

    // Yeni şifreyi ayarla
    await firebaseUpdatePassword(user, newPassword)
    return 'Şifre başarıyla güncellendi.'
  } catch (error: any) {
    if (error.code === 'auth/wrong-password') {
      throw new Error('Yanlış mevcut şifre girdiniz.')
    }
    if (error.code === 'auth/requires-recent-login') {
      throw new Error('Şifrenizi güncellemek için tekrar giriş yapmanız gerekiyor.')
    }
    if (error.code === 'auth/invalid-credential') {
      throw new Error('Geçersiz kimlik bilgisi')
    }
    console.error('Şifre güncelleme hatası:', error)
    throw new Error('Şifre güncellenirken bir hata oluştu.')
  }
}
