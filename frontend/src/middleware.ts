import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-storage')?.value
  const isHomePage = request.nextUrl.pathname === '/'
  const isUnauthorizedPage = request.nextUrl.pathname === '/unauthorized'

  // Eğer token yoksa ve sayfa unauthorized veya ana sayfa değilse, unauthorized sayfasına yönlendir
  if (!token && !isHomePage && !isUnauthorizedPage) {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/unauthorized', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
