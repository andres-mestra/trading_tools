'use client'
import { memo, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useDecimal } from 'hooks/useDecimal'
import { getCandles, getSymbols } from 'services/binanceService'
import { WidgetItem } from './WidgetItem'

import './style.css'

const TIME_INTERVAL = 300000 // 5 minutes

export const MarketWidget = memo(() => {
  const widgetRef = useRef(null)
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

  const move = coins?.length && widgetRef.current

  return (
    <div className="widget_container">
      <div className="widget_line_container">
        {coins?.length ? (
          <motion.ol
            key="widget_marquee"
            className="widget_line"
            ref={widgetRef}
            animate={{
              x: move ? 'calc(100vw - 100%)' : '0%',
            }}
            transition={{
              delay: 2,
              repeat: Infinity,
              ease: [0, 0, 0, 0],
              duration: 3 * coins?.length,
            }}
          >
            {coins.map(({ symbol, change }) => (
              <WidgetItem key={symbol} symbol={symbol} change={change} />
            ))}
          </motion.ol>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  )
})
