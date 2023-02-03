import { Link, Stack, TableRow, TableCell, Typography } from '@mui/material'
import { TableCoinsItemActions } from './TableCoinsItemActions'

import { useDecimal } from 'hooks/useDecimal'
import { distanceColor } from 'helpers/distanceUtils'
import { binanceFutureUrl } from 'services/binanceService'

import './style.css'

export function TableCoinsItem({
  coin,
  type,
  isLong,
  onDelete,
  onEdit,
  onUpdate,
  onInvertion,
}) {
  const { div, sub } = useDecimal()

  const { symbol, lastPrice, entry, buyBack, distanceEntry, bounces, target } =
    coin
  const distanceEntryString = distanceEntry.toPrecision(3)

  const ratio = isLong
    ? div(sub(target, entry), sub(entry, buyBack))
    : div(sub(entry, target), sub(buyBack, entry))

  const colorEntry = distanceColor(distanceEntry, type)
  const url = `${binanceFutureUrl}/${symbol}usdt`

  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell scope="row">
        <Stack>
          <Link target="_blank" href={url}>
            <Typography textTransform="uppercase">{symbol}</Typography>
          </Link>
          <Typography
            variant="caption"
            color={ratio > 1.66 && 'secondary.light'}
          >
            {ratio.toPrecision(3)}
          </Typography>
          <Typography
            variant="caption"
            color={coin?.distTarget > 1.8 && 'primary.light'}
          >
            {coin?.distTarget?.toPrecision(3)}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell align="right">{lastPrice.toPrecision(7)}</TableCell>
      <TableCell align="right">
        <Stack>
          <Typography color={colorEntry} fontWeight="bold">
            {distanceEntryString}
          </Typography>
          <Typography variant="caption">{bounces}</Typography>
        </Stack>
      </TableCell>
      <TableCell align="right">{entry}</TableCell>
      <TableCell align="right">{target}</TableCell>
      <TableCell align="right">{buyBack}</TableCell>

      <TableCell align="right">
        <TableCoinsItemActions
          onEdit={onEdit}
          onDelete={onDelete}
          onInvertion={onInvertion}
          onUpdate={onUpdate}
        />
      </TableCell>
    </TableRow>
  )
}
