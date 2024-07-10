import { Providers } from './Providers'
import { NavBar } from 'components/NavBar'
import { MarketWidget } from 'components/MarketWidget'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Providers>
          <NavBar />
          {children}
          {/* <MarketWidget /> */}
        </Providers>
      </body>
    </html>
  )
}
