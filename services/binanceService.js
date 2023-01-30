export const binanceFutureUrl = 'https://www.binance.com/es/futures'
export const binanceFutureApi = 'https://fapi.binance.com/fapi/v1'
export const binanceSocketURL = 'wss://fstream.binance.com/stream?streams'

export async function getCurrentPrice(symbol) {
  const resp = await fetch(
    `${binanceFutureApi}/premiumIndex?symbol=${symbol}usdt`
  )
  const { markPrice } = await resp.json()
  return markPrice
}

export async function getOrderBook(symbol) {
  const resp = await fetch(
    `${binanceFutureApi}/depth?symbol=${symbol.toUpperCase()}USDT&limit=1000&weight=20`
  )
  const book = await resp.json()

  return book
}

export async function getSymbols(hasPair = false) {
  const resp = await fetch(`${binanceFutureApi}/exchangeInfo`)
  const data = await resp.json()
  const symbols = data?.symbols || []
  const newSymbols = []

  symbols.map((s) => {
    const { symbol, contractType, status } = s
    const isUsdt = symbol.includes('USDT')
    const isPerpetual = contractType === 'PERPETUAL'
    const isTrading = status === 'TRADING'
    if (isUsdt && isPerpetual && isTrading) {
      hasPair
        ? newSymbols.push(symbol.toLowerCase())
        : newSymbols.push(symbol.replace('USDT', '').toLowerCase())
    }
  })

  return newSymbols
}

export async function getCandles(symbol, interval, limit) {
  try {
    const resp = await fetch(
      `${binanceFutureApi}/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`
    )
    const candles = await resp.json()
    return candles
  } catch (error) {
    console.error(error)
    return []
  }
}
