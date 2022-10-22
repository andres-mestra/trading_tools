import {
  Paper,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material'
import { TableHeaderCoins } from './TableHeaderCoins'
import { sortingCoins } from '../helpers/sortingCoins'

export function TableCoins({ type, coins, render }) {
  const isLong = type === 'long'
  const coinsCopy = structuredClone(coins)
  const coinsSort = sortingCoins(coinsCopy, isLong)

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHeaderCoins isLong={isLong} />
        <TableBody>
          {coinsSort.map((coin, index) => render(coin, type, isLong, index))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
