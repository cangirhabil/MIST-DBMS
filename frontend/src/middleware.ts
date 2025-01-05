import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Sadece bu sayfalara erişim izni var
const PUBLIC_PATHS = ['/', '/unauthorized']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Auth token kontrolü
  const authData = request.cookies.get('auth-storage')?.value
  let token = null

  if (authData) {
    try {
      const parsed = JSON.parse(authData)
      token = parsed.state?.token || null
    } catch (error) {
      console.error('Token parsing error:', error)
    }
  }

  // Eğer public path'te değilse ve token yoksa, unauthorized sayfasına yönlendir
  if (!PUBLIC_PATHS.includes(pathname) && !token) {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
