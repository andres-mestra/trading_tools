import { useState } from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

const initialState = {
  symbol: '',
  lastPrice: 1,
  longPoints: {
    entry: 1,
    distanceEntry: 1,
    buyBack: 1,
    distanceBuyBack: 1,
  },
  shortPoints: {
    entry: 1,
    distanceEntry: 1,
    buyBack: 1,
    distanceBuyBack: 1,
  },
}

export function FormAddCoin({ onSubmit }) {
  const [newCoin, setNewCoin] = useState({ ...initialState })

  const onSymbolChange = (event) => {
    const { value } = event.target
    setNewCoin((prevCoin) => ({ ...prevCoin, symbol: value.toLowerCase() }))
  }

  const onPointsChanges = (event, isEntry, type) => {
    const { value } = event.target
    const poinValue = Number(value)
    const keyPoint = type === 'long' ? 'longPoints' : 'shortPoints'
    const keyEntry = isEntry ? 'entry' : 'buyBack'

    setNewCoin((prevCoin) => ({
      ...prevCoin,
      [keyPoint]: {
        ...prevCoin[keyPoint],
        [keyEntry]: poinValue,
      },
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(newCoin)
    setNewCoin({ ...initialState })
  }

  const { symbol, longPoints, shortPoints } = newCoin

  return (
    <form onSubmit={handleSubmit}>
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="center"
      >
        <Stack>
          <Typography variant="subtitle1">Add coin</Typography>
          <Stack gap={2}>
            <TextField
              required
              size="small"
              label="Symbol"
              name="symbol"
              value={symbol}
              onChange={onSymbolChange}
            />
            <Button type="submit" variant="contained">
              Add
            </Button>
          </Stack>
        </Stack>
        <Stack>
          <Typography variant="subtitle2">Long points</Typography>
          <Stack gap={2}>
            <TextField
              required
              size="small"
              type="number"
              label="Entry"
              name="long.entry"
              value={longPoints.entry}
              onChange={(event) => onPointsChanges(event, true, 'long')}
            />
            <TextField
              required
              size="small"
              type="number"
              label="Buy back"
              name="long.buyBack"
              value={longPoints.buyBack}
              onChange={(event) => onPointsChanges(event, false, 'long')}
            />
          </Stack>
        </Stack>
        <Stack>
          <Typography variant="subtitle2">Short points</Typography>
          <Stack gap={2}>
            <TextField
              required
              size="small"
              type="number"
              label="Entry"
              name="short.entry"
              value={shortPoints.entry}
              onChange={(event) => onPointsChanges(event, true, 'short')}
            />
            <TextField
              required
              size="small"
              type="number"
              label="Buy back"
              name="short.buyBack"
              value={shortPoints.buyBack}
              onChange={(event) => onPointsChanges(event, false, 'short')}
            />
          </Stack>
        </Stack>
      </Stack>
    </form>
  )
}
