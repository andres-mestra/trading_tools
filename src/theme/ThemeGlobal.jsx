import { useMemo, createContext } from 'react'
import { Global, css } from '@emotion/react'
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles'
import { useLocalStorage } from '../hooks/useLocalStorage'

export const ColorModeContext = createContext({ toggleColorMode: () => {} })

export const ThemeGlobal = ({ children }) => {
  const [mode, setMode] = useLocalStorage('color_mode', 'light')

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      },
    }),
    []
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  )

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export function GlobalStyles() {
  const theme = useTheme()

  return (
    <Global
      styles={css`
        body {
          background: ${theme.palette.background.default};
        }
      `}
    />
  )
}
