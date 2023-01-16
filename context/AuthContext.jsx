'use client'

import { createContext, useContext } from 'react'
import { useAuthWallet } from 'hooks/useAuthWallet'

export const AuthContext = createContext()

export const useAuthConext = () => {
  const context = useContext(AuthContext)
  return context
}

export const AuthProvider = ({ children }) => {
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
