'use client'

import React, { useEffect } from 'react'
import loadingAnimation from '../../../../public/loading-animation.json'
import dynamic from 'next/dynamic'
import AccountSettings from '@/components/settings/accountSettings'
import { LoadingScreen } from '@/components/loading'

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <div>Yükleniyor...</div>,
})

export default function SettingsPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-50 h-50">
            <React.Suspense fallback={<div>Yükleniyor...</div>}>
              <Lottie animationData={loadingAnimation} loop={true} />
            </React.Suspense>
          </div>
        </div>
      )}
      <div className="p-4 sm:p-8">
        <AccountSettings />
      </div>
    </div>
  )
}
