import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Backdrop from '@mui/material/Backdrop'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Alert from '@mui/material/Alert'
import { useState } from 'react'
import { useDecimal } from '../../hooks/useDecimal'

const inputProps = {
  inputMode: 'numeric',
  min: 0,
  step: 'any',
  autoComplete: 'off',
}

export function FormAddCoin({
  open,
  isAdd,
  newCoin,
  onChange,
  onSubmit,
  onClose,
}) {
  const [error, setError] = useState(null)
  const { asNumber } = useDecimal()
  const { symbol, type, entry, buyBack, target } = newCoin

  const onValidatePoints = () => {
    const newEntry = asNumber(entry)
    const newBuyBack = asNumber(buyBack)

    if (type === 'long' && newEntry < newBuyBack) {
      setError('La entrada es menor a la recompra.')
      return false
    } else if (type === 'short' && newEntry > newBuyBack) {
      setError('La entrada es mayor a la recompra.')
      return false
    }

    setError(null)
    return true
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const isValid = onValidatePoints()
    if (isValid) {
      onClose()
      onSubmit()
    }
  }

  return (
    <Backdrop
      open={open}
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack gap={2}>
            <Typography variant="h4" sx={{ gridRow: '1 / 3' }}>
              Add coin
            </Typography>
            {error && <Alert severity="warning">{error}</Alert>}
            <FormControl required>
              <FormLabel id="type">Operation</FormLabel>
              <RadioGroup row name="type" value={type} onChange={onChange}>
                <FormControlLabel
                  value="long"
                  control={<Radio />}
                  label="Long"
                />
                <FormControlLabel
                  value="short"
                  control={<Radio />}
                  label="Short"
                />
              </RadioGroup>
            </FormControl>
            <TextField
              required
              size="small"
              label="Symbol"
              name="symbol"
              value={symbol}
              onChange={onChange}
            />
            {!isAdd && (
              <>
                <Typography variant="h6">Points</Typography>
                <Stack gap={2}>
                  <TextField
                    required
                    type="number"
                    inputProps={{ ...inputProps }}
                    size="small"
                    label="Entry"
                    name="entry"
                    value={entry}
                    onChange={onChange}
                  />
                  <TextField
                    required
                    type="number"
                    inputProps={{ ...inputProps }}
                    size="small"
                    label="Target"
                    name="target"
                    value={target}
                    onChange={onChange}
                  />
                  <TextField
                    required
                    size="small"
                    type="number"
                    inputProps={{ ...inputProps }}
                    label="Buy back"
                    name="buyBack"
                    value={buyBack}
                    onChange={onChange}
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
