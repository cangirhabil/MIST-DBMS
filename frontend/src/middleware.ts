// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/unauthorized'] // login sayfasını da ekleyin

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public path kontrolü
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  // Auth token kontrolü
  const authData = request.cookies.get('auth-storage')?.value
  let isAuthenticated = false
  let token = null

  if (authData) {
    try {
      const parsed = JSON.parse(authData)
      token = parsed.state?.token
      isAuthenticated = parsed.state?.isAuthenticated

      // Token ve authentication durumunu kontrol et
      if (token && isAuthenticated) {
        return NextResponse.next()
      }
    } catch (error) {
      console.error('Token parsing error:', error)
    }
  }

  // Auth yoksa yönlendir
  return NextResponse.redirect(new URL('/unauthorized', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
