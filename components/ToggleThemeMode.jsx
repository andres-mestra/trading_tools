import { useContext } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useTheme } from '@mui/material/styles'
import { ColorModeContext } from '../theme/ThemeGlobal'

export const ToggleThemeMode = () => {
  const theme = useTheme()
  const colorMode = useContext(ColorModeContext)

  return (
    <Box
      sx={{
        display: 'flex',
        placeItems: 'center',
        color: 'text.primary',
        bgcolor: 'background.default',
        borderRadius: 1,
        padding: 1,
      }}
    >
      <Typography textTransform="capitalize">
        {theme.palette.mode} mode
      </Typography>
      <IconButton
        sx={{ ml: 1 }}
        onClick={colorMode.toggleColorMode}
        color="inherit"
      >
        {theme.palette.mode === 'dark' ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
    </Box>
  )
}
