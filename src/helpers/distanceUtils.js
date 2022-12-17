import { useDecimal } from '../hooks/useDecimal'

const wDistance = 0.3
const aDistance = 0.15
const wColor = 'warning.light'
const aLColor = 'success.light'
const aSColor = 'error.light'

export function calcDistance(lastPrice, entry, type) {
  const { sub, div, mul } = useDecimal()
  const numerator =
    type === 'long' ? sub(lastPrice, entry) : sub(entry, lastPrice)
  const distance = mul(div(numerator, entry), 100)
  return distance
}

export function distanceColor(distance, type) {
  const operationColor = type === 'long' ? aLColor : aSColor

  if (distance <= aDistance) return operationColor
  if (distance <= wDistance) return wColor

  return null
}
