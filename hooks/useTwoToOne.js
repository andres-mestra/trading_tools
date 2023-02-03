import { useDecimal } from './useDecimal'
import { useOrderBook } from './useOrderBook'
import { getSymbols } from 'services/binanceService'

const RATIO = 2
const DISTANCE = 1.66

export function useTwoToOne() {
  const { abs, sub, div, mul } = useDecimal()
  const [getEntryPoints] = useOrderBook()

  const handleGetTwoToOne = async (callbackCurrentCoin) => {
    const newSymbols = await getSymbols()

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

        if (ratioLong >= RATION) {
          const distance = mul(
            div(sub(shortPoints.entry, longPoints.entry), longPoints.entry),
            100
          )

          if (distance >= DISTANCE) {
            const { entry, buyBack } = longPoints
            longs.push({
              symbol,
              entry,
              target: shortPoints.entry,
              buyBack,
              distance,
              distTarget: distance,
              ratio: ratioLong,
            })
          }
        }

        if (ratioShort >= RATIO) {
          const distance = mul(
            div(
              abs(sub(longPoints.entry, shortPoints.entry)),
              shortPoints.entry
            ),
            100
          )

          if (distance >= DISTANCE) {
            const { entry, buyBack } = shortPoints
            shorts.push({
              symbol,
              entry,
              target: longPoints.entry,
              buyBack,
              distance,
              distTarget: distance,
              ratio: ratioShort,
            })
          }
        }
      }
    }

    return [longs, shorts]
  }

  return [handleGetTwoToOne]
}
