import { useCallback, useState } from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Backdrop from '@mui/material/Backdrop'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useDecimal } from 'hooks/useDecimal'

const inputProps = {
  inputMode: 'numeric',
  min: 0,
  step: 'any',
  autoComplete: 'off',
}

export const FormCapital = ({ open, coin, onClose }) => {
  const { div, abs, sub, mul } = useDecimal()
  const [values, setValues] = useState({
    coins: 0,
    loss: 0,
  })

  const onChangeLoss = (value) =>
    setValues((prev) => ({ ...prev, loss: value }))

  const onChangeCoins = (value) =>
    setValues((prev) => ({ ...prev, coins: value }))

  const handleCalcCalpital = (e) => {
    e.preventDefault()
    const { loss } = values
    const { entry, buyBack } = coin
    const coins = abs(div(loss, sub(entry, buyBack)))

    onChangeCoins(coins)
  }

  const handleClose = () => {
    setValues({ coins: 0, loss: 0 })
    onClose()
  }

  const cost = useCallback(() => {
    const { coins } = values
    const { entry } = coin
    return mul(coins, entry)
  }, [values, coin])

  return (
    <Backdrop
      open={open}
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleCalcCalpital}>
          <Stack gap={2}>
            <Typography variant="h5" sx={{ gridRow: '1 / 3' }}>
              Calcular capital: {coin.symbol}{' '}
              <Typography
                color={coin.type === 'long' ? 'success.main' : 'error'}
              >
                {coin.type}
              </Typography>
            </Typography>
            <TextField
              required
              type="number"
              inputProps={{ ...inputProps }}
              size="small"
              label="Perdida (usd)"
              name="coins"
              value={values.loss}
              onChange={(e) => onChangeLoss(e.target.value)}
            />
            <Typography>
              Cantidad de monedas: {values.coins} (${cost()})
            </Typography>
            <Stack
              flexDirection="row"
              justifyContent="space-between"
              width="100%"
            >
              <Button variant="outlined" type="submit">
                Calcular
              </Button>
              <Button variant="outlined" color="error" onClick={handleClose}>
                Cerrar
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Backdrop>
  )
}
