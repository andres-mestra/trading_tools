'use client'

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
        *,
        *::after,
        ::before {
          margin: 0;
          padding: 0;
          box-sizing: inherit;
          user-select: none;
        }

        body {
          background: ${theme.palette.background.default};
        }

        a {
          text-decoration: none;
        }

        .brand {
          background: linear-gradient(to right, #007fff, #0059b2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .container_paper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          height: 100vh;
          width: 100%;
        }
      `}
    />
  )
}
