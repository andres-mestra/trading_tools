import { useRef } from 'react'
import { useDecimal } from './useDecimal'
import { getCurrentPrice, getOrderBook } from '../services/binanceService'
import { calcRange } from '../helpers/calcRange'

export const useOrderBook = () => {
  const isGetData = useRef(false)
  const { div, sub, mul, plus, asNumber } = useDecimal()

  function getIntervals(orders, limit, sizeInterval, type = 'short') {
    let poin = limit
    let groupIndex = 0
    let group = [[]]

    if (type === 'short') {
      orders.forEach(([price, amount]) => {
        const currentPrice = asNumber(price)
        if (currentPrice <= poin) {
          const currentMount = group[groupIndex][1] || 0
          const newAmount = plus(currentMount, asNumber(amount))

          group[groupIndex] = [poin, newAmount]
        } else {
          poin = plus(poin, sizeInterval)
          groupIndex = groupIndex + 1

          group[groupIndex] = [poin, asNumber(amount)]
        }
      })
      return group.filter((g) => g?.length)
    }

    if (type === 'long') {
      orders.forEach(([price, amount], index) => {
        const currentPrice = asNumber(price)
        if (currentPrice >= poin) {
          const currentMount = group[groupIndex][1] || 0
          const newAmount = plus(currentMount, asNumber(amount))

          group[groupIndex] = [poin, newAmount]
        } else {
          poin = sub(poin, sizeInterval)
          groupIndex = groupIndex + 1
          const newAmount = asNumber(amount)
          group[groupIndex] = [poin, newAmount]
        }
      })
      return group.filter((g) => g?.length)
    }

    return group
  }

  function getLocalLimit(minPrice, currentPrice, sizeInterval) {
    let flapMin = Math.trunc(minPrice)
    let flapMax = plus(flapMin, sizeInterval)

    while (minPrice > flapMax) {
      flapMax = plus(flapMax, sizeInterval)
    }
    flapMin = plus(flapMax, sizeInterval)

    let quiton = 1
    let divisor = sizeInterval
    if (currentPrice >= 100) {
      while (flapMin % divisor !== 0) {
        flapMin = sub(flapMin, quiton)
        if (flapMin % divisor === 0) {
          quiton = 10
        }
      }

      flapMax = plus(flapMin, sizeInterval)
    }

    return [flapMin, flapMax]
  }

  function getEntryPoin(groups) {
    const amounts = groups.slice(0, 15).map(({ 1: amount }) => amount)

    const biggerAmount = Math.max(...amounts)
    const [biggerPrice] = groups.find(([, amount]) => amount === biggerAmount)
    return biggerPrice
  }

  function getSubOrdes(orders, limitPrice, type = 'short') {
    const subOrders = []

    if (type === 'short') {
      for (let index = 0; index < orders.length; index++) {
        const order = orders[index]
        const [price] = order
        if (price <= limitPrice) {
          subOrders.push(order)
        } else {
          break
        }
      }
      return subOrders
    }

    if (type === 'long') {
      for (let index = 0; index < orders.length; index++) {
        const order = orders[index]
        const [price] = order
        if (price >= limitPrice) {
          subOrders.push(order)
        } else {
          break
        }
      }
      return subOrders
    }

    return subOrders
  }

  function getShortPoins(price, shortBook) {
    const sizeIntervalExt = calcRange(price, 'external')
    const sizeIntervalInt = calcRange(sizeIntervalExt, 'internal')
    const minPrice = asNumber(shortBook[0][0])
    const [, firtsLimitExternal] = getLocalLimit(
      minPrice,
      price,
      sizeIntervalExt
    )
    const groupsExternal = getIntervals(
      shortBook,
      firtsLimitExternal,
      sizeIntervalExt
    )
    const buyBackPoint = getEntryPoin(groupsExternal)
    const subShort = getSubOrdes(shortBook, buyBackPoint)
    const [, firtsLimitInternal] = getLocalLimit(
      minPrice,
      price,
      sizeIntervalInt
    )
    const groupsInternal = getIntervals(
      subShort,
      firtsLimitInternal,
      sizeIntervalInt
    )
    const entryShort = getEntryPoin(groupsInternal)

    return [entryShort, buyBackPoint]
  }

  function getLongPoins(price, longBook) {
    // EXTERNAL
    const type = 'long'
    const sizeIntervalExt = calcRange(price, 'external')
    const sizeIntervalInt = calcRange(sizeIntervalExt, 'internal')
    const minPrice = asNumber(longBook[0][0])

    const [firtsLimitExternal] = getLocalLimit(minPrice, price, sizeIntervalExt)
    const groupsExternal = getIntervals(
      longBook,
      firtsLimitExternal,
      sizeIntervalExt,
      type
    )

    const buyBackPoint = getEntryPoin(groupsExternal)

    //INTERNAL
    const subShort = getSubOrdes(longBook, buyBackPoint, type)
    const [firtsLimitInternal] = getLocalLimit(minPrice, price, sizeIntervalInt)
    const groupsInternal = getIntervals(
      subShort,
      firtsLimitInternal,
      sizeIntervalInt,
      type
    )
    const entryLong = getEntryPoin(groupsInternal)

    return [entryLong, buyBackPoint]
  }

  async function getPoints(symbol, type) {
    try {
      if (isGetData.current) return undefined
      isGetData.current = true

      let price = await getCurrentPrice(symbol)
      price = asNumber(price)
      let { asks: short, bids: long } = await getOrderBook(symbol)

      let [entryShort, buyBackShort] = getShortPoins(price, short)
      let [entryLong, buyBackLong] = getLongPoins(price, long)

      if (entryLong === buyBackLong) {
        buyBackLong = div(sub(mul(3, entryLong), entryShort), 2)
      }

      if (entryShort === buyBackShort) {
        buyBackShort = div(sub(mul(3, entryShort), entryLong), 2)
      }

      isGetData.current = false

      if (type === 'long') {
        return {
          entry: entryLong,
          target: entryShort,
          buyBack: buyBackLong,
          buyBackShort,
        }
      }

      if (type === 'short') {
        return {
          entry: entryShort,
          target: entryLong,
          buyBack: buyBackShort,
          buyBackLong,
        }
      }

      if (type === 'all') {
        return {
          longPoints: {
            entry: entryLong,
            buyBack: buyBackLong,
          },
          shortPoints: {
            entry: entryShort,
            buyBack: buyBackShort,
          },
        }
      }
    } catch (error) {
      console.error(error)
      return undefined
    }
  }

  return [getPoints]
}
