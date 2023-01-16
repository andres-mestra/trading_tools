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
    setHasMinOGT,
    vefiryOgtAmount,
  } = useAuthWallet()

  useEffect(() => {
    if (localStorage.getItem('previouslyConnected') !== 'true') {
      if (pathname !== '/') router.push('/')
    } else {
      if (active && pathname !== '/') {
        vefiryOgtAmount().then((hasOGT) => {
          if (!hasOGT) router.push('/')
        })
      }
    }
  }, [active, pathname])

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
