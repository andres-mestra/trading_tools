import { useDecimal } from './useDecimal'
import { useOrderBook } from './useOrderBook'

export function useTwoToOne() {
  const { sub, div } = useDecimal()
  const [getEntryPoints] = useOrderBook()

  const handleGetTwoToOne = async () => {
    const resp = await fetch('https://fapi.binance.com/fapi/v1/exchangeInfo')
    const data = await resp.json()
    const { symbols } = data
    const newSymbols = []
    symbols.forEach((s) => {
      const { symbol, contractType, status } = s
      const isUsdt = symbol.includes('USDT')
      const isPerpetual = contractType === 'PERPETUAL'
      const isTrading = status === 'TRADING'
      if (isUsdt && isPerpetual && isTrading)
        newSymbols.push(symbol.replace('USDT', ''))
    })

    const longs = []
    const shorts = []

    for (const symbol of newSymbols) {
      console.log(symbol)
      const points = await getEntryPoints(symbol)
      if (points !== undefined) {
        const { shortPoints, longPoints } = points

        const ratioLong = div(
          sub(shortPoints.entry, longPoints.entry),
          sub(longPoints.entry, longPoints.buyBack)
        )
        const ratioShort = div(
          sub(shortPoints.entry, longPoints.entry),
          sub(shortPoints.buyBack, shortPoints.entry)
        )

        if (ratioLong >= 1.66)
          longs.push({
            symbol,
            ratio: ratioLong,
            tp: shortPoints.entry,
            ...longPoints,
          })
        if (ratioShort >= 1.66)
          shorts.push({
            symbol,
            ratio: ratioShort,
            tp: longPoints.entry,
            ...shortPoints,
          })
      }
    }

    console.log('MONEDAS DOS A UNO, RECOMENDADAS')
    console.log('LONGS')
    console.table(longs)
    console.log('SHORT')
    console.table(shorts)
  }

  return [handleGetTwoToOne]
}
