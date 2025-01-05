import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/', '/auth', '/unauthorized']

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-storage')?.value
  const path = request.nextUrl.pathname

  // Public path kontrolü
  const isPublicPath = publicPaths.includes(path)

  // Eğer token yoksa ve public path değilse, unauthorized sayfasına yönlendir
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // Eğer token varsa ve auth sayfasındaysa, ana sayfaya yönlendir
  if (token && path === '/auth') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/auth',
    '/unauthorized',
    // Aşağıdaki yollarla başlayanlar HARİÇ tüm istekleri eşleştirir
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
