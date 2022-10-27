import { useEffect, useRef, useState } from 'react'
import { Box, Typography, Paper, Stack, Button } from '@mui/material'
import { FormAddCoin } from '../../components/FormAddCoin'
import { TableCoins } from '../../components/TableCoins'
import { TableCoinsItem } from '../../components/TableCoinsItem'

import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useFormCoin } from '../../hooks/useFormCoin'
import { socketURL } from '../../helpers/urls'
import { calcDistance } from '../../helpers/distanceUtils'
import { calcBounces } from '../../helpers/calcBounces'

export function Home() {
  const socketsRef = useRef([])
  const [openForm, setOpenForm] = useState(false)
  const [coinsStorage, setCoinsStorage] = useLocalStorage('coins_data', [])
  const [coins, setCoins] = useState([...coinsStorage])
  const [nCoins, setNCoins] = useState(coins.length)
  const {
    newCoin: currentCoin,
    onSetNewCoin: onSetCurrentCoin,
    onSymbolChange,
    onPointsChanges,
    onResetForm,
  } = useFormCoin()

  const onAddCoin = (newCoin) => {
    setCoins((prevCoins) => {
      let coinsList = structuredClone(prevCoins)
      coinsList = coinsList.filter((coin) => coin.symbol !== newCoin.symbol)
      coinsList = [...coinsList, newCoin]
      setCoinsStorage(coinsList)
      return coinsList
    })
  }

  const onDeleteCoin = (symbol) => {
    setCoins((prevCoins) => {
      const coinsList = prevCoins.filter((coin) => coin.symbol !== symbol)
      setCoinsStorage(coinsList)
      return coinsList
    })
  }

  const onEditCoin = (coin) => {
    onSetCurrentCoin(coin)
    setOpenForm(true)
  }

  const handleSubmitForm = () => {
    onAddCoin(currentCoin)
    onResetForm()
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
            longPoints.bounces = calcBounces(
              longPoints.bounces,
              longPoints.distanceEntry
            )

            //SHORT
            shortPoints.distanceEntry = calcDistance(
              lastPrice,
              shortPoints.entry,
              'short'
            )
            shortPoints.bounces = calcBounces(
              shortPoints.bounces,
              shortPoints.distanceEntry
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
        <Stack direction="row" gap={2}>
          <Typography
            variant="h1"
            sx={{ fontSize: '2.5rem', fontWeight: 'bold', marginRight: '2rem' }}
          >
            Oraculo
          </Typography>
          <Button variant="contained" onClick={() => setOpenForm(true)}>
            Add Coin
          </Button>
          <Button variant="contained">Run Order Book</Button>
        </Stack>
        <Stack direction="row" justifyContent="space-around">
          <FormAddCoin
            open={openForm}
            newCoin={currentCoin}
            onSymbol={onSymbolChange}
            onPoints={onPointsChanges}
            onSubmit={handleSubmitForm}
            onClose={() => setOpenForm(false)}
          />
        </Stack>
        <Stack direction="row" gap={2} justifyContent="space-between">
          <Stack gap={2}>
            <Typography variant="h3" color="success.light">
              Long
            </Typography>
            <TableCoins
              coins={coins}
              type="long"
              render={(coin, type, isLong, index) => (
                <TableCoinsItem
                  key={`${coin.symbol}_${index}`}
                  type={type}
                  coin={coin}
                  isLong={isLong}
                  onDelete={onDeleteCoin}
                  onEdit={() => onEditCoin(coin)}
                />
              )}
            />
          </Stack>
          <Stack gap={2}>
            <Typography variant="h3" color="error.light">
              Short
            </Typography>
            <TableCoins
              coins={coins}
              type="short"
              render={(coin, type, isLong, index) => (
                <TableCoinsItem
                  key={`${coin.symbol}_${index}`}
                  type={type}
                  coin={coin}
                  isLong={isLong}
                  onDelete={onDeleteCoin}
                  onEdit={() => onEditCoin(coin)}
                />
              )}
            />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}
