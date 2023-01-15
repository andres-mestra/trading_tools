import { memo } from 'react'
import { TableCell, TableHead, TableRow, Typography } from '@mui/material'

export const TableHeaderCoins = memo(({ isLong = true }) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>
          <Typography fontWeight="bold">Symbol</Typography>
          <Typography variant="caption">Ratio</Typography>
        </TableCell>
        <TableCell align="right">LastPrice</TableCell>
        <TableCell align="right">
          <Typography
            variant="subtitle2"
            color={isLong ? 'success.main' : 'error.main'}
          >
            Dist(%)
          </Typography>
        </TableCell>
        <TableCell align="right">Entry</TableCell>
        <TableCell align="right">Target</TableCell>
        <TableCell align="right">BuyBack</TableCell>
        <TableCell align="right">Acciones</TableCell>
      </TableRow>
    </TableHead>
  )
})
