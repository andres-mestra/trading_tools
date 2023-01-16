'use client'

import { useState } from 'react'
import { Drawer, IconButton } from '@mui/material'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined'
import { Navigation } from 'components/Navigation'

export const NavBar = () => {
  const [state, setState] = useState(false)

  const toggleDrawer = (open) => {
    setState(open)
  }

  return (
    <>
      <IconButton
        sx={{ position: 'absolute', right: 5, top: 5 }}
        onClick={() => toggleDrawer(true)}
      >
        <MenuOutlinedIcon sx={{ fontSize: '3.5rem' }} />
      </IconButton>
      <Drawer anchor="right" open={state} onClose={() => toggleDrawer(false)}>
        <Navigation onToggle={toggleDrawer} />
      </Drawer>
    </>
  )
}
