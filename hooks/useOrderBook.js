import { useRef } from 'react'
import { useDecimal } from './useDecimal'
import { getCurrentPrice, getOrderBook } from 'services/binanceService'
import { calcRange } from 'helpers/calcRange'

const ETH_SYMBOL = 'eth'
const ETH_RANGE_EXT = 50
const ETH_RANGE_INT = 10

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

  function getPositionsPoints(type, price, orderBook, symbol) {
    // EXTERNAL
    const sizeIntervalExt =
      symbol === ETH_SYMBOL ? ETH_RANGE_EXT : calcRange(price, 'external')
    const sizeIntervalInt =
      symbol === ETH_SYMBOL
        ? ETH_RANGE_INT
        : calcRange(sizeIntervalExt, 'internal')
    const minPrice = asNumber(orderBook[0][0])

    const [firtsLimitExternal] = getLocalLimit(minPrice, price, sizeIntervalExt)
    const groupsExternal = getIntervals(
      orderBook,
      firtsLimitExternal,
      sizeIntervalExt,
      type
    )

    const buyBack = getEntryPoin(groupsExternal)

    //INTERNAL
    const subShort = getSubOrdes(orderBook, buyBack, type)
    const [firtsLimitInternal] = getLocalLimit(minPrice, price, sizeIntervalInt)
    const groupsInternal = getIntervals(
      subShort,
      firtsLimitInternal,
      sizeIntervalInt,
      type
    )
    const entry = getEntryPoin(groupsInternal)

    return [entry, buyBack]
  }

  async function getPoints(symbol, type) {
    try {
      if (isGetData.current) return undefined
      isGetData.current = true

      let price = await getCurrentPrice(symbol)
      price = asNumber(price)
      let { asks: shortOrderBook, bids: longOrderBook } = await getOrderBook(
        symbol
      )

      let [entryShort, buyBackShort] = getPositionsPoints(
        'short',
        price,
        shortOrderBook,
        symbol
      )
      let [entryLong, buyBackLong] = getPositionsPoints(
        'long',
        price,
        longOrderBook,
        symbol
      )

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
