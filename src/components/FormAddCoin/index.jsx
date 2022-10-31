import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Backdrop from '@mui/material/Backdrop'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

export function FormAddCoin({
  open,
  isAdd,
  newCoin,
  onSymbol,
  onPoints,
  onSubmit,
  onClose,
}) {
  const { symbol, longPoints, shortPoints } = newCoin

  const handleSubmit = (event) => {
    event.preventDefault()
    onClose()
    onSubmit()
  }

  return (
    <Backdrop
      open={open}
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack gap={2}>
            <Typography variant="h3" sx={{ gridRow: '1 / 3' }}>
              Add coin
            </Typography>
            <TextField
              required
              size="small"
              label="Symbol"
              name="symbol"
              value={symbol}
              onChange={onSymbol}
            />
            {!isAdd && (
              <>
                <Typography variant="h6">Long points</Typography>
                <Stack direction="row" gap={2}>
                  <TextField
                    required
                    type="number"
                    size="small"
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
                <Typography variant="h6">Short points</Typography>
                <Stack direction="row" gap={2}>
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
              </>
            )}
            <Button type="submit" variant="contained">
              {isAdd ? 'Add' : 'Edit'}
            </Button>
            <Button color="error" onClick={onClose}>
              Cerrar
            </Button>
          </Stack>
        </form>
      </Paper>
    </Backdrop>
  )
}
