import { GlobalStyles, ThemeGlobal } from 'theme/ThemeGlobal'

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeGlobal>
      <GlobalStyles />
      <Component {...pageProps} />
    </ThemeGlobal>
  )
}
