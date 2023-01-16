'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthConext } from 'context/AuthContext'

import { SimpleBackdrop } from 'components/SimpleBackdrop'

export function RedirectView({ children }) {
  const { isAuth, loading } = useAuthConext()
  const router = useRouter()

  useEffect(() => {
    if (!isAuth && !loading) {
      router.push('/')
    }
  }, [isAuth, loading])

  if (loading) {
    return (
      <div>
        <SimpleBackdrop />
      </div>
    )
  }

  return <>{children}</>
}
