import { useEffect, useRef, useState } from 'react'
import { Box, Typography, Paper, Stack } from '@mui/material'
import { FormAddCoin } from '../../components/FormAddCoin'
import { TableCoins } from '../../components/TableCoins'

import { socketURL } from '../../helpers/urls'
import { calcDistance } from '../../helpers/distanceUtils'

export function Home() {
  const socketsRef = useRef([])
  const [coins, setCoins] = useState([
    {
      symbol: 'btcusdt',
      lastPrice: 1,
      longPoints: {
        entry: 19034,
        distanceEntry: 1,
        buyBack: 18941,
        distanceBuyBack: 1,
      },
      shortPoints: {
        distance: 1,
        entry: 19284,
        distanceEntry: 1,
        buyBack: 19442,
        distanceBuyBack: 1,
      },
    },
    {
      symbol: 'maticusdt',
      lastPrice: 1,
      longPoints: {
        distance: 1,
        entry: 0.8546,
        distanceEntry: 1,
        buyBack: 0.842,
        distanceBuyBack: 1,
      },
      shortPoints: {
        distance: 1,
        entry: 0.8766,
        distanceEntry: 1,
        buyBack: 0.886,
        distanceBuyBack: 1,
      },
    },
  ])
  const [nCoins, setNCoins] = useState(coins.length)

  const onAddCoin = (newCoin) => {
    setCoins((prevCoins) => [...prevCoins, newCoin])
  }

  const generateSocket = () => {
    return coins.map((data, index) => {
      const { symbol } = data
      const socket = new WebSocket(`${socketURL}=${symbol}@markPrice@1s`)
      socket.onmessage = function (event) {
        const { data: resp } = JSON.parse(event.data)
        let { p: lastPrice } = resp
        lastPrice = Number(lastPrice)

        setCoins((preState) => {
          const newState = [...preState]
          const coin = newState[index]
          const { shortPoints, longPoints } = coin

          //LONG
          longPoints.distanceEntry = calcDistance(
            lastPrice,
            longPoints.entry,
            'long'
          )
          longPoints.distanceBuyBack = calcDistance(
            lastPrice,
            longPoints.buyBack,
            'long'
          )

          //SHORT
          shortPoints.distanceEntry = calcDistance(
            lastPrice,
            shortPoints.entry,
            'short'
          )
          shortPoints.distanceBuyBack = calcDistance(
            lastPrice,
            shortPoints.buyBack,
            'short'
          )

          newState[index] = { ...coin, lastPrice, shortPoints, longPoints }
          return [...newState]
        })
      }
      return socket
    })
  }

  useEffect(() => {
    let coinsSockets = []
    if (coins.length) {
      console.log('Primero')
      socketsRef.current = generateSocket()
    }
    return () => {
      socketsRef.current.forEach((socket) => socket.close())
    }
  }, [])

  useEffect(() => {
    if (coins.length !== nCoins) {
      console.log('Cambio')
      socketsRef.current.map(() => (socket) => socket.close())
      socketsRef.current = []
      socketsRef.current = generateSocket()
      setNCoins(coins.length)
    }
  }, [coins])

  return (
    <Box
      component={Paper}
      sx={{ margin: '0 auto', height: '100vh', maxWidth: '1400px', p: 3 }}
    >
      <Stack justifyContent="center">
        <Typography variant="h2">Oraculo</Typography>
        <FormAddCoin onSubmit={onAddCoin} />
        <Stack direction="row" gap={2} justifyContent="space-between">
          <Stack gap={2}>
            <Typography variant="h3" color="success.light">
              Long
            </Typography>
            <TableCoins coins={coins} type="long" />
          </Stack>
          <Stack gap={2}>
            <Typography variant="h3" color="error.light">
              Short
            </Typography>
            <TableCoins coins={coins} type="short" />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}
