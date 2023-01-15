import { useState } from 'react'
import { useForm } from './useForm'

const initialState = {
  symbol: '',
  type: 'long',
  entry: 1,
  buyBack: 1,
  bounces: 0,
  target: 1,
  lastPrice: 1,
  distanceEntry: 1,
}

export const useFormCoin = () => {
  const [isAddCoin, setIsAddCoin] = useState(true)
  const [newCoin, onFormCoin, onResetForm, setNewCoin] = useForm({
    ...initialState,
  })

  const onSetNewCoin = (coin) => setNewCoin((prev) => ({ ...prev, ...coin }))

  return {
    isAddCoin,
    newCoin,
    onFormCoin,
    onResetForm,
    setIsAddCoin,
    onSetNewCoin,
  }
}
