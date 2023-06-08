import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import LinkMui from '@mui/material/Link'
import Link from 'next/link'
import HomeIcon from '@mui/icons-material/Home'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined'
import { ToggleThemeMode } from 'components/ToggleThemeMode'
//import { useAuthConext } from 'context/AuthContext'

const routes = [
  { route: '/', text: 'Home', Icon: HomeIcon },
  { route: '/oraculo', text: 'Oraculo', Icon: ArticleOutlinedIcon },
  { route: '/dos-uno', text: 'Dos a uno', Icon: AssessmentOutlinedIcon },
]

export function Navigation({ onToggle }) {
  // const { active, connect, disconnect } = useAuthConext()

  // const handleAuth = () => {
  //   active ? disconnect() : connect()
  // }

  return (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => onToggle(false)}
      onKeyDown={() => onToggle(false)}
    >
      <List>
        {routes.map(({ route, text, Icon }) => (
          <LinkMui component={Link} key={text} href={route} underline="hover">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          </LinkMui>
        ))}
        <Divider />
        <ToggleThemeMode />
        {/* <ListItem disablePadding>
          <ListItemButton onClick={handleAuth}>
            <ListItemIcon>
              {active ? (
                <ExitToAppOutlinedIcon color="error" />
              ) : (
                <PersonOutlineOutlinedIcon color="primary" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={active ? 'Desconectar wallet' : 'Conectar wallet'}
            />
          </ListItemButton>
        </ListItem> */}
      </List>
    </Box>
  )
}
