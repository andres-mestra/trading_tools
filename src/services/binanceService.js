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
