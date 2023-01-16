import { useContext } from 'react'
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useTheme } from '@mui/material/styles'
import { ColorModeContext } from '../theme/ThemeGlobal'

export const ToggleThemeMode = () => {
  const theme = useTheme()
  const colorMode = useContext(ColorModeContext)

  return (
    <ListItem
      disablePadding
      sx={{
        color: 'text.primary',
        bgcolor: 'background.default',
      }}
      onClick={colorMode.toggleColorMode}
    >
      <ListItemButton>
        <ListItemIcon>
          {theme.palette.mode === 'dark' ? (
            <Brightness7Icon />
          ) : (
            <Brightness4Icon />
          )}
        </ListItemIcon>
        <ListItemText primary={`${theme.palette.mode} mode`} />
      </ListItemButton>
    </ListItem>
  )
}
