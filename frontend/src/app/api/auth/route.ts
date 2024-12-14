import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { token, action, user } = await request.json()

    if (action === 'login') {
      (await cookies()).set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })

      return NextResponse.json({
        success: true,
        user,
        token,
      })
    }

    if (action === 'logout') {
      (await cookies()).delete('session')
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action',
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Authentication operation failed',
    })
  }
}
