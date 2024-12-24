import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { UserProvider } from './providers/userProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MIST',
  description: 'MIST Cinema - Your go-to site for movie ratings and information',
}

export default function RootLayout({ children }: any) {
  return ( 
    <html lang="en" className={inter.className}>
      <body>
        <UserProvider>
          <main>{children}</main>
        </UserProvider>
      </body>
    </html>
  )
}
