import { memo } from 'react'
import { TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useMediaQueryMd } from '../hooks/useMediaQueryMd'

export const TableHeaderCoins = memo(({ isLong = true }) => {
  const matches = useMediaQueryMd()
  const actionsHidden = matches && !isLong

  return (
    <TableHead>
      <TableRow>
        <TableCell>
          <Typography fontWeight="bold">Symbol</Typography>
          <Typography variant="caption">Ratio</Typography>
        </TableCell>
        <TableCell align="right">LastPrice</TableCell>
        <TableCell align="right">Entry</TableCell>
        <TableCell align="right">
          <Typography
            variant="subtitle2"
            color={isLong ? 'success.main' : 'error.main'}
          >
            Dist(%)
          </Typography>
        </TableCell>
        <TableCell align="right">BuyBack</TableCell>
        {!actionsHidden && <TableCell align="right">Acciones</TableCell>}
      </TableRow>
    </TableHead>
  )
})
