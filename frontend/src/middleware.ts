import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-storage')?.value
  const isHomePage = request.nextUrl.pathname === '/'

  // Eğer token yoksa ve ana sayfa veya auth sayfası değilse, ana sayfaya yönlendir
  if (!token && !isHomePage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
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
