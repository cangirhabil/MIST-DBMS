import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-storage')?.value
  const isHomePage = request.nextUrl.pathname === '/'
  const isUnauthorizedPage = request.nextUrl.pathname === '/unauthorized'

  // Eğer token yoksa ve sayfa unauthorized veya ana sayfa değilse, unauthorized sayfasına yönlendir

  if (!token) {
    console.log('Token yok')
  } else {
    console.log('Token var')
  }
  if (!token && !isHomePage && !isUnauthorizedPage) {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/unauthorize',
    /*
    
     * Aşağıdaki yollarla başlayanlar HARİÇ tüm istekleri eşleştirir:
     * - api (API rotaları)
     * - _next/static (statik dosyalar)
     * - _next/image (resim optimizasyon dosyaları)
     * - favicon.ico (favicon dosyası)
     * '/((?!api|_next/static|_next/image|favicon.ico).*)',
     */
  ],
}
