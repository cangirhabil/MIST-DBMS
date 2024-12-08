import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { token, action } = await request.json()
    if (action === 'set') {
      ;(await cookies()).set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })
      return NextResponse.json({ success: true })
    } else if (action === 'delete') {
      ;(await cookies()).delete('session')
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Cookie operation failed' })
  }
}
