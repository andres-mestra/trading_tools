import { useState } from 'react'

const initialState = {
  symbol: '',
  lastPrice: 1,
  longPoints: {
    entry: 1,
    buyBack: 1,
    bounces: 0,
    distanceEntry: 1,
  },
  shortPoints: {
    entry: 1,
    buyBack: 1,
    bounces: 0,
    distanceEntry: 1,
  },
}

export const useFormCoin = () => {
  const [isAddCoin, setIsAddCoin] = useState(true)
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
        bounces: 0,
      },
    }))
  }

  const onResetForm = () => setNewCoin({ ...initialState })

  return {
    isAddCoin,
    newCoin,
    onSetNewCoin,
    onSymbolChange,
    onPointsChanges,
    onResetForm,
    setIsAddCoin,
  }
}
