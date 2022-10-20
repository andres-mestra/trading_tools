import {
  Paper,
  Table,
  IconButton,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { TableHeaderCoins } from './TableHeaderCoins'
import { sortingCoins } from '../helpers/sortingCoins'
import { distanceColor } from '../helpers/distanceUtils'
import { binanceFuture } from '../helpers/urls'

export function TableCoins({ type, coins }) {
  const isLong = type === 'long'
  const coinsCopy = structuredClone(coins)
  const coinsSort = sortingCoins(coinsCopy, isLong)

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHeaderCoins isLong={isLong} />
        <TableBody>
          {coinsSort.map((coin, index) => {
            const { symbol, lastPrice } = coin
            const poins = isLong ? coin.longPoints : coin.shortPoints
            const { entry, buyBack, distanceEntry, distanceBuyBack } = poins
            const distanceEntryString = distanceEntry.toPrecision(3)
            const distanceBuyBackString = distanceBuyBack.toPrecision(3)

            const dColorEntry = distanceColor(distanceEntry, type)
            const dColorBuyBack = distanceColor(distanceBuyBack, type)
            const url = `${binanceFuture}/${symbol}`

            return (
              <TableRow
                key={`${coin.symbol}_${index}`}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell scope="row">
                  <a target="_blank" href={url}>
                    <Typography textTransform="uppercase">{symbol}</Typography>
                  </a>
                </TableCell>
                <TableCell align="right">{lastPrice.toPrecision(7)}</TableCell>
                <TableCell align="right">{entry}</TableCell>
                <TableCell align="right">
                  <Typography color={dColorEntry}>
                    {distanceEntryString}
                  </Typography>
                </TableCell>
                <TableCell align="right">{buyBack}</TableCell>
                {distanceEntry < 0 ? (
                  <TableCell align="right">
                    <Typography color={dColorBuyBack}>
                      {distanceBuyBackString}
                    </Typography>
                  </TableCell>
                ) : (
                  <TableCell />
                )}
                <TableCell align="right">
                  <IconButton aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
