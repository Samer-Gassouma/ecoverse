'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

export default function SignUpSuccessPage() {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
     
      router.push('/dashboard')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>
  }

  return <div>Setting up your account...</div>
}