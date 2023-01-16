import { useDecimal } from './useDecimal'
import { useOrderBook } from './useOrderBook'

export function useTwoToOne() {
  const { abs, sub, div, mul } = useDecimal()
  const [getEntryPoints] = useOrderBook()

  const handleGetTwoToOne = async (callbackCurrentCoin) => {
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
      callbackCurrentCoin(symbol)
      const points = await getEntryPoints(symbol, 'all')
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

        if (ratioLong >= 1.66) {
          const distance = mul(
            div(sub(shortPoints.entry, longPoints.entry), longPoints.entry),
            100
          )
          const { entry, buyBack } = longPoints
          longs.push({
            symbol,
            entry,
            target: shortPoints.entry,
            buyBack,
            distance,
            ratio: ratioLong,
          })
        }

        if (ratioShort >= 1.66) {
          const distance = mul(
            div(
              abs(sub(longPoints.entry, shortPoints.entry)),
              shortPoints.entry
            ),
            100
          )

          const { entry, buyBack } = shortPoints
          shorts.push({
            symbol,
            entry,
            target: longPoints.entry,
            buyBack,
            distance,
            ratio: ratioShort,
          })
        }
      }
    }

    return [longs, shorts]
  }

  return [handleGetTwoToOne]
}
