'use client'
import { useEffect, useRef, useState } from 'react'
import { useDecimal } from 'hooks/useDecimal'
import { getCandles, getSymbols } from 'services/binanceService'
import { WidgetItem } from './WidgetItem'

import './style.css'

const TIME_INTERVAL = 180000 // 5 minutes

export const MarketWidget = () => {
  const [coins, setCoins] = useState([])
  const { div, mul, sub } = useDecimal()

  async function getTicketChange(symbol) {
    const candles = await getCandles(symbol, '5m', 6)
    const [pastCandle] = candles.slice(0, 1)
    const [currentCandle] = candles.slice(-1)

    const { 1: pastPrice } = pastCandle
    const { 4: lastPrice } = currentCandle

    const diference = sub(lastPrice, pastPrice)
    const porcentageChange = mul(div(diference, lastPrice), 100).toPrecision(2)

    return { symbol, change: porcentageChange }
  }

  const getTicketsChange = async () => {
    console.log('Actualizando widget')
    const symbols = await getSymbols(true)

    const resp = await Promise.allSettled(
      symbols.map((s) => getTicketChange(s))
    )

    let changes = []
    resp.forEach(({ status, value }) => {
      if (status === 'fulfilled') changes.push(value)
    })

    setCoins(changes)
  }

  useEffect(() => {
    getTicketsChange()

    const interval = setInterval(() => {
      getTicketsChange()
    }, TIME_INTERVAL)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="widget_container">
      <div className="widget_line_container">
        {coins?.length ? (
          <ol key="widget_marquee" className="widget_line">
            {coins.map(({ symbol, change }) => (
              <WidgetItem key={symbol} symbol={symbol} change={change} />
            ))}
          </ol>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  )
}
