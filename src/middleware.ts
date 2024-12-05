import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkIsAdmin } from './services/login.service'

export async function middleware(request: NextRequest) {
  // Admin sayfaları için middleware kontrolü
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = request.cookies.get('session')?.value

    // todo: Admin kontrolü yapılacak server tarafında da

    // const isAdmin = await checkIsAdmin();

    if (!session) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    // Session token'ı kontrol etme işlemleri burada yapılır
    // Bu örnekte basit bir kontrol yapıyoruz
    try {
      return NextResponse.next()
    } catch (error) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }
}

export const config = {
  matcher: '/admin/:path*',
}
