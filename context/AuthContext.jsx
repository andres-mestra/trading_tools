'use client'

import { createContext, useContext, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthWallet } from 'hooks/useAuthWallet'

export const AuthContext = createContext()

export const useAuthConext = () => {
  const context = useContext(AuthContext)
  return context
}

export const AuthProvider = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname()
  const {
    isAuth,
    error,
    active,
    account,
    loading,
    hasMinOGT,
    networkName,
    connect,
    disconnect,
    vefiryOgtAmount,
  } = useAuthWallet()

  const validateAccess = () => {
    if (localStorage.getItem('previouslyConnected') !== 'true') {
      if (pathname !== '/' && pathname !== '/vip') return router.push('/')
    }

    if (localStorage.getItem('isVIP') === 'true') return

    if (active && pathname !== '/' && pathname !== '/vip') {
      vefiryOgtAmount().then((hasOGT) => {
        if (!hasOGT) router.push('/')
      })
    } else if (error) {
      router.push('/')
    }
  }

  useEffect(() => {
    validateAccess()
  }, [active, pathname, error])

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        error,
        active,
        account,
        loading,
        hasMinOGT,
        networkName,
        connect,
        disconnect,
        vefiryOgtAmount,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
