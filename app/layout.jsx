import { RedirectView } from 'components/RedirectView'
import { Providers } from './Providers'
import { NavBar } from 'components/NavBar'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Providers>
          <NavBar />
          <RedirectView> {children}</RedirectView>
        </Providers>
      </body>
    </html>
  )
}
