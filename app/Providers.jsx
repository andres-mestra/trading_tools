'use client'

import { GlobalStyles, ThemeGlobal } from 'theme/ThemeGlobal'
import { AnalyticsWrapper } from 'components/AnalyticsWrapper'

export const Providers = ({ children }) => {
  return (
    <ThemeGlobal>
      <GlobalStyles />
      {children}
      <AnalyticsWrapper />
    </ThemeGlobal>
  )
}
