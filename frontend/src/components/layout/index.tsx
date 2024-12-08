import type { ReactNode } from 'react'

export function Layout({ children }: { children: ReactNode }) {
  return <div className="flex flex-col mx-auto h-screen">{children}</div>
}
