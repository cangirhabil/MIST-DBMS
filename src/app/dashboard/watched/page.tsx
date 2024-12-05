'use client'
import React from 'react'
import loadingAnimation from '../../../../public/loading-animation.json'

import dynamic from 'next/dynamic'
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

const Rate: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  React.useEffect(() => {
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
            <Lottie animationData={loadingAnimation} loop={true} />
          </div>
        </div>
      )}
      //add a page here
    </div>
  )
}

export default Rate
