'use client'

import { GlobalStyles, ThemeGlobal } from 'theme/ThemeGlobal'
import { Web3Provider } from 'config/web3'
import { AuthProvider } from 'context/AuthContext'
import { AnalyticsWrapper } from 'components/AnalyticsWrapper'

export const Providers = ({ children }) => {
  return (
    <Web3Provider>
      <AuthProvider>
        <ThemeGlobal>
          <GlobalStyles />
          {children}
          <AnalyticsWrapper />
        </ThemeGlobal>
      </AuthProvider>
    </Web3Provider>
  )
}
