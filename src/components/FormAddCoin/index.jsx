import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Container, ButtonAdd } from './style'

export function FormAddCoin({ newCoin, onSymbol, onPoints, onSubmit }) {
  const { symbol, longPoints, shortPoints } = newCoin

  return (
    <form onSubmit={onSubmit}>
      <Container>
        <Typography variant="h3" sx={{ gridRow: '1 / 3' }}>
          Add coin
        </Typography>
        <Typography variant="h6">Long points</Typography>
        <Typography variant="h6">Short points</Typography>
        <TextField
          required
          type="number"
          size="small"
          label="Entry"
          name="long.entry"
          inputProps={{ inputMode: 'decimal', pattern: '[0-9]*' }}
          value={longPoints.entry}
          onChange={(event) => onPoints(event, true, 'long')}
        />
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
          label="Symbol"
          name="symbol"
          value={symbol}
          onChange={onSymbol}
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
        <TextField
          required
          size="small"
          type="number"
          label="Buy back"
          name="short.buyBack"
          value={shortPoints.buyBack}
          onChange={(event) => onPoints(event, false, 'short')}
        />
        <ButtonAdd type="submit" variant="contained" sx={{}}>
          Add
        </ButtonAdd>
      </Container>
    </form>
  )
}
