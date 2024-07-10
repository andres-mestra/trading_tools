export const binanceFutureUrl = 'https://www.binance.com/es/futures'
export const binanceFutureApi = 'https://fapi.binance.com/fapi/v1'
export const binanceSocketURL = 'wss://fstream.binance.com/stream?streams'

export const PERIOD = {
  '5m': '5m',
  '15m': '15m',
  '30m': '30m',
  '1h': '1h',
  '2h': '2h',
  '4h': '4h',
  '6h': '6h',
  '12h': '12h',
  '1d': '1d',
}

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

export async function getCandles(symbol, interval, limit, startTime, endTime) {
  try {
    let path = `${binanceFutureApi}/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`

    if (startTime) path += `&startTime=${startTime}`
    if (endTime) path += `&endTime=${endTime}`

    const resp = await fetch(path)

    const candles = await resp.json()
    return candles
  } catch (error) {
    console.error(error)
    return []
  }
}

const N_CANDLES = 288 // 24 Horas antes del tiempo actual
const HOURS_24 = 24 * 60 * 60 * 1000 // en milisegundos
export async function getVolume(symbol) {
  //Obtener tiempo actual
  const endTime = new Date().getTime()
  //Calcular 24 horas atrás en milisegundos
  const startTime = new Date(endTime - HOURS_24).getTime()

  const candles = await getCandles(`${symbol}usdt`, PERIOD['5m'], N_CANDLES)

  if (!candles.length) return 0

  const volumen = candles.reduce((acc, curr) => {
    const { 2: high, 3: low, 5: vol } = curr
    return acc + ((Number(high) + Number(low)) / 2) * Number(vol)
  }, 0)
  return volumen
}
