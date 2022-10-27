import { memo } from 'react'
import { TableCell, TableHead, TableRow, Typography } from '@mui/material'

export const TableHeaderCoins = memo(({ isLong = true }) => (
  <TableHead>
    <TableRow>
      <TableCell>Symbol / Ratio</TableCell>
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
      <TableCell align="right">Acciones</TableCell>
    </TableRow>
  </TableHead>
))
