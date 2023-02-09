import { memo } from 'react'
import {
  Stack,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

export const TableHeaderCoins = memo(({ isLong = true }) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>
          <Stack>
            <Typography fontWeight="bold">Ticket</Typography>
            <Typography variant="caption" color="secondary.main">
              Ratio
            </Typography>
            <Typography variant="caption" color="primary.main">
              Dist Tp
            </Typography>
          </Stack>
        </TableCell>
        <TableCell align="right">PrecioActual</TableCell>
        <TableCell align="right">
          <Typography
            variant="subtitle2"
            color={isLong ? 'success.main' : 'error.main'}
          >
            Dist(%)
          </Typography>
        </TableCell>
        <TableCell align="right">Entrada</TableCell>
        <TableCell align="right">TakeProfit</TableCell>
        <TableCell align="right">StopLoss</TableCell>
        <TableCell align="right">Acciones</TableCell>
      </TableRow>
    </TableHead>
  )
})
