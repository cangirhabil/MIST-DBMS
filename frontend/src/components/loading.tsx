'use client'

import loadingAnimation from '@/../public/loading-animation.json'
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <div>Yükleniyor...</div>,
})

export const LoadingScreen = ({ message = '' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100">
    <div className="text-center space-y-4">
      <div className="w-32 h-32 mx-auto">
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>
      {message && <p className="text-gray-600">{message}</p>}
    </div>
  </div>
)
