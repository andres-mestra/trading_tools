import { useEffect, useRef, useState } from 'react'
import { Box, Typography, Paper, Stack, Button } from '@mui/material'
import { FormAddCoin } from '../../components/FormAddCoin'
import { TableCoins } from '../../components/TableCoins'

import { useLocalStorage } from '../../hooks/useLocalStorage'
import { socketURL } from '../../helpers/urls'
import { calcDistance } from '../../helpers/distanceUtils'

export function Home() {
  const socketsRef = useRef([])
  const [coinsStorage, setCoinsStorage] = useLocalStorage('coins_data', [])
  const [coins, setCoins] = useState([...coinsStorage])
  const [nCoins, setNCoins] = useState(coins.length)

  const onAddCoin = (newCoin) => {
    setCoins((prevCoins) => {
      const coinsList = [...prevCoins, newCoin]

      setCoinsStorage(coinsList)
      return coinsList
    })
  }

  const onDeleteCoin = (symbol) => {
    console.log('DELETE')
    setCoins((prevCoins) => {
      const coinsList = prevCoins.filter((coin) => coin.symbol !== symbol)
      setCoinsStorage(coinsList)
      return coinsList
    })
  }

  const onSaveStorageData = () => {
    setCoinsStorage(coins)
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
          if (coin) {
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
          }
          return [...newState]
        })
      }
      return socket
    })
  }

  useEffect(() => {
    if (coins.length) {
      socketsRef.current = generateSocket()
    }
    return () => {
      socketsRef.current.forEach((socket) => socket.close())
    }
  }, [])

  useEffect(() => {
    if (coins.length !== nCoins) {
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
        <Stack direction="row" justifyContent="space-around">
          <FormAddCoin onSubmit={onAddCoin} />
          <Button
            variant="contained"
            color="success"
            onClick={onSaveStorageData}
          >
            Save Data
          </Button>
        </Stack>
        <Stack direction="row" gap={2} justifyContent="space-between">
          <Stack gap={2}>
            <Typography variant="h3" color="success.light">
              Long
            </Typography>
            <TableCoins coins={coins} type="long" onDelete={onDeleteCoin} />
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
