import { useRef } from 'react'
import { calcRange } from '../helpers/calcRange'

export const useOrderBook = () => {
  const isGetData = useRef(false)

  async function getCurrentPrice(symbol) {
    const resp = await fetch(
      `https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${symbol}usdt`
    )
    const { markPrice } = await resp.json()
    return markPrice
  }

  async function orderBook(symbol) {
    const resp = await fetch(
      `https://fapi.binance.com/fapi/v1/depth?symbol=${symbol.toUpperCase()}USDT&limit=1000&weight=20`
    )
    const book = await resp.json()
    return book
  }

  function getIntervals(orders, limit, sizeInterval, type = 'short') {
    let poin = limit
    let groupIndex = 0
    let group = [[]]

    if (type === 'short') {
      orders.forEach(([price, amount]) => {
        if (Number(price) <= poin) {
          const currentMount = group[groupIndex][1] || 0
          group[groupIndex] = [poin, currentMount + Number(amount)]
        } else {
          poin = poin + sizeInterval
          groupIndex = groupIndex + 1
          group[groupIndex] = [poin, Number(amount)]
        }
      })
      return group
    }

    if (type === 'long') {
      orders.forEach(([price, amount], index) => {
        if (Number(price) >= poin) {
          const currentMount = group[groupIndex][1] || 0
          const newAmount = currentMount + Number(amount)

          group[groupIndex] = [poin, newAmount]
        } else {
          poin = poin - sizeInterval
          groupIndex = groupIndex + 1
          const newAmount = Number(amount)
          group[groupIndex] = [poin, newAmount]
        }
      })
      return group
    }

    return group
  }

  function getLocalLimit(minPrice, currentPrice, sizeInterval) {
    let flapMin = Math.trunc(minPrice)
    let flapMax = flapMin + sizeInterval

    while (minPrice > flapMax) {
      flapMax = flapMax + sizeInterval
    }
    flapMin = flapMax - sizeInterval

    let quiton = 1
    let divisor = sizeInterval
    if (currentPrice >= 100) {
      while (flapMin % divisor !== 0) {
        flapMin = flapMin - quiton
        if (flapMin % divisor === 0) {
          quiton = 10
        }
      }

      flapMax = flapMin + sizeInterval
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
    const minPrice = Number(shortBook[0][0])
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
    const minPrice = Number(longBook[0][0])
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

  async function getPoints(symbol) {
    try {
      if (isGetData.current) return undefined
      isGetData.current = true

      let price = await getCurrentPrice(symbol)
      price = parseFloat(price)
      let { asks: short, bids: long } = await orderBook(symbol)

      let [entryShort, buyBackShort] = getShortPoins(price, short)
      let [entryLong, buyBackLong] = getLongPoins(price, long)

      if (entryLong === buyBackLong) {
        buyBackLong = (3 * entryLong - entryShort) / 2
      }

      if (entryShort === buyBackShort) {
        buyBackShort = (3 * entryShort - entryLong) / 2
      }

      isGetData.current = false

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
    } catch (error) {
      console.error(error)
      return undefined
    }
  }

  return [getPoints]
}
