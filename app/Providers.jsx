'use client'

import { GlobalStyles, ThemeGlobal } from 'theme/ThemeGlobal'
import { AnimatePresence } from 'framer-motion'
import { Web3Provider } from 'config/web3'
import { AuthProvider } from 'context/AuthContext'

export const Providers = ({ children }) => {
  return (
    <Web3Provider>
      <AuthProvider>
        <ThemeGlobal>
          <GlobalStyles />
          <AnimatePresence>{children}</AnimatePresence>
        </ThemeGlobal>
      </AuthProvider>
    </Web3Provider>
  )
}
