import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

export function FormAddCoin({ newCoin, onSymbol, onPoints, onSubmit }) {
  const { symbol, longPoints, shortPoints } = newCoin

  return (
    <form onSubmit={onSubmit}>
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
              onChange={onSymbol}
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
              onChange={(event) => onPoints(event, true, 'long')}
            />
            <TextField
              required
              size="small"
              type="number"
              label="Buy back"
              name="long.buyBack"
              value={longPoints.buyBack}
              onChange={(event) => onPoints(event, false, 'long')}
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
              onChange={(event) => onPoints(event, true, 'short')}
            />
            <TextField
              required
              size="small"
              type="number"
              label="Buy back"
              name="short.buyBack"
              value={shortPoints.buyBack}
              onChange={(event) => onPoints(event, false, 'short')}
            />
          </Stack>
        </Stack>
      </Stack>
    </form>
  )
}
