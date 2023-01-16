import { memo } from 'react'
import { Backdrop } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

export const SimpleBackdrop = memo(({ children }) => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      {children ? children : <CircularProgress color="inherit" />}
    </Backdrop>
  )
})
