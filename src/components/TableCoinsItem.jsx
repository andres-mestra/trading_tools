import {
  Link,
  Stack,
  Tooltip,
  IconButton,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import RestartAltIcon from '@mui/icons-material/RestartAlt'

import { useDecimal } from '../hooks/useDecimal'
import { useMediaQueryMd } from '../hooks/useMediaQueryMd'
import { distanceColor } from '../helpers/distanceUtils'
import { binanceFuture } from '../helpers/urls'

export function TableCoinsItem({
  coin,
  type,
  isLong,
  onDelete,
  onEdit,
  onUpdate,
}) {
  const matches = useMediaQueryMd()
  const { div, sub } = useDecimal()

  const { symbol, lastPrice, entry, buyBack, distanceEntry, bounces, target } =
    coin
  const distanceEntryString = distanceEntry.toPrecision(3)

  const ratio = isLong
    ? div(sub(target, entry), sub(entry, buyBack))
    : div(sub(entry, target), sub(buyBack, entry))

  const colorEntry = distanceColor(distanceEntry, type)
  const url = `${binanceFuture}/${symbol}usdt`

  const actionsHidden = matches && type === 'short'

  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell scope="row">
        <Stack>
          <Link target="_blank" href={url}>
            <Typography textTransform="uppercase">{symbol}</Typography>
          </Link>
          <Typography variant="caption" color={ratio > 1.66 && '#d500f9'}>
            {ratio.toPrecision(3)}
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
      {!actionsHidden && (
        <TableCell align="right">
          <IconButton color="primary" size="small" onClick={onEdit}>
            <ModeEditIcon />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => onDelete(symbol)}
          >
            <DeleteIcon />
          </IconButton>
          <Tooltip title="Recalcular entrada">
            <IconButton color="inherit" size="small" onClick={onUpdate}>
              <RestartAltIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      )}
    </TableRow>
  )
}
