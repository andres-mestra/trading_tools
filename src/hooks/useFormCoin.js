import { useState } from 'react'

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

export const useFormCoin = () => {
  const [newCoin, setNewCoin] = useState({ ...initialState })

  const onSetNewCoin = (coin) => setNewCoin((prev) => ({ ...prev, ...coin }))

  const onSymbolChange = (event) => {
    const { value } = event.target
    setNewCoin((prevCoin) => ({ ...prevCoin, symbol: value.toLowerCase() }))
  }

  const onPointsChanges = (event, isEntry, type) => {
    const { value } = event.target
    const poinValue = parseFloat(value)

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

  const onResetForm = () => setNewCoin({ ...initialState })

  return { newCoin, onSetNewCoin, onSymbolChange, onPointsChanges, onResetForm }
}
