import { version } from '../../../package.json'
import { useEffect, useRef, useState } from 'react'
import { Box, Typography, Paper, Stack, Button, Container } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import { FormAddCoin } from '../../components/FormAddCoin'
import { TableCoins } from '../../components/TableCoins'
import { TableCoinsItem } from '../../components/TableCoinsItem'
import { ToggleThemeMode } from '../../components/ToggleThemeMode'

import { useFormCoin } from '../../hooks/useFormCoin'
import { useOrderBook } from '../../hooks/useOrderBook'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { socketURL } from '../../helpers/urls'
import { calcDistance } from '../../helpers/distanceUtils'
import { calcBounces } from '../../helpers/calcBounces'
import { useImportExportJson } from '../../hooks/useImportExportJson'

export function Home() {
  const socketsRef = useRef([])
  const [getEntryPoints] = useOrderBook()
  const [openForm, setOpenForm] = useState(false)
  const [coinsStorage, setCoinsStorage] = useLocalStorage('coins_data', [])
  const [coins, setCoins] = useState([...coinsStorage])
  const [importJson, exportJson, refInputImport] = useImportExportJson()
  const [nCoins, setNCoins] = useState(coins.length)
  const {
    newCoin: currentCoin,
    onSetNewCoin: onSetCurrentCoin,
    isAddCoin,
    onSymbolChange,
    onPointsChanges,
    onResetForm,
    setIsAddCoin,
  } = useFormCoin()

  const onAddCoin = async (newCoin) => {
    const { symbol, longPoints, shortPoints } = newCoin
    const points = await getEntryPoints(symbol)

    setCoins((prevCoins) => {
      let coinsList = structuredClone(prevCoins)
      coinsList = coinsList.filter((coin) => coin.symbol !== newCoin.symbol)
      coinsList = [
        ...coinsList,
        {
          ...newCoin,
          longPoints: {
            ...longPoints,
            ...points.longPoints,
          },
          shortPoints: {
            ...shortPoints,
            ...points.shortPoints,
          },
        },
      ]
      setCoinsStorage(coinsList)
      return coinsList
    })
    setIsAddCoin(false)
  }

  const onPullCoin = (coin) => {
    setCoins((prevCoins) => {
      let coinsList = structuredClone(prevCoins)
      const coinIndex = coinsList.findIndex((c) => c.symbol === coin.symbol)
      if (coinIndex === -1) return prevCoins

      coinsList[coinIndex] = { ...coin }
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

  const onUpdatePoints = async (coin) => {
    const { symbol, longPoints, shortPoints } = coin
    const points = await getEntryPoints(symbol)
    const newCoin = {
      ...coin,
      longPoints: {
        ...longPoints,
        ...points.longPoints,
      },
      shortPoints: {
        ...shortPoints,
        ...points.shortPoints,
      },
    }
    onPullCoin(newCoin)
  }

  const onEditCoin = (coin) => {
    setIsAddCoin(false)
    onSetCurrentCoin(coin)
    setOpenForm(true)
  }

  const handleImportPoints = (event) => {
    importJson(event, (newPoints) => {
      setCoinsStorage(newPoints)
      setCoins(newPoints)
    })
  }

  const handleExportPoints = () => {
    exportJson(coinsStorage)
  }

  const handleAddCoin = () => {
    setIsAddCoin(true)
    setOpenForm(true)
  }

  const handleCloseForm = () => {
    setOpenForm(false)
  }

  const handleSubmitForm = () => {
    isAddCoin ? onAddCoin(currentCoin) : onPullCoin(currentCoin)
    onResetForm()
  }

  const generateSocket = () => {
    return coins.map((data) => {
      const { symbol } = data
      const socket = new WebSocket(`${socketURL}=${symbol}usdt@markPrice@1s`)
      socket.onmessage = function (event) {
        const { data: resp } = JSON.parse(event.data)
        let { p: lastPrice } = resp
        lastPrice = Number(lastPrice)

        setCoins((prevState) => {
          const newState = structuredClone(prevState)
          const coinIndex = newState.findIndex(
            (coin) => coin?.symbol === symbol
          )

          if (coinIndex === -1) {
            socket.close()
            return newState
          }

          const coin = newState[coinIndex]
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

          if ('Notification' in window) {
            if (
              shortPoints.distanceEntry >= 0 &&
              shortPoints.distanceEntry < 0.3
            ) {
              if (shortPoints?.notify === undefined || !shortPoints?.notify) {
                shortPoints.notify = true
                new Notification('Notification', {
                  body: `SHORT ${coin.symbol.toUpperCase()} !!!!`,
                  dir: 'ltr',
                })
              }
            } else if (shortPoints.distanceEntry > 0.5) {
              shortPoints.notify = false
            }

            if (
              longPoints.distanceEntry >= 0 &&
              longPoints.distanceEntry < 0.3
            ) {
              if (longPoints?.notify === undefined || !longPoints?.notify) {
                longPoints.notify = true
                new Notification('Notification', {
                  body: `LONG ${coin.symbol.toUpperCase()} !!!!`,
                  dir: 'ltr',
                })
              }
            } else if (longPoints.distanceEntry > 0.5) {
              longPoints.notify = false
            }
          }

          newState[coinIndex] = { ...coin, lastPrice, shortPoints, longPoints }

          return [...newState]
        })
      }
      return socket
    })
  }

  const handleNotification = () => {
    if (!('Notification' in window))
      return alert('This browser does not support nitifications.')

    Notification.requestPermission().then((result) => {
      console.log(result)
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
      socketsRef.current.forEach(() => (socket) => socket.close())
      socketsRef.current = []
      socketsRef.current = generateSocket()
      setNCoins(coins.length)
    }
  }, [coins])

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box
        component={Paper}
        sx={{
          margin: '0 auto',
          minHeight: '100vh',
          maxWidth: '1400px',
          p: 3,
        }}
      >
        <Stack justifyContent="center" flexWrap="wrap">
          <Stack direction="row" gap={2}>
            <Typography
              variant="h1"
              sx={{ fontSize: '2.5rem', fontWeight: 'bold' }}
            >
              Oraculo
              <Typography variant="caption">v{version}</Typography>
            </Typography>

            <Button variant="contained" size="small" onClick={handleAddCoin}>
              Add Coin
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<CloudDownloadIcon />}
              onClick={handleExportPoints}
            >
              Descargar
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<CloudUploadIcon />}
              onClick={() => {
                refInputImport.current && refInputImport.current.click()
              }}
            >
              <label>Cargar</label>
              <input
                hidden
                id="importPoints"
                type="file"
                accept="application/JSON"
                ref={refInputImport}
                onChange={handleImportPoints}
              />
            </Button>
            <Button variant="outlined" onClick={handleNotification}>
              notificar
            </Button>
            <ToggleThemeMode />
          </Stack>
          <FormAddCoin
            open={openForm}
            isAdd={isAddCoin}
            newCoin={currentCoin}
            onSymbol={onSymbolChange}
            onPoints={onPointsChanges}
            onSubmit={handleSubmitForm}
            onClose={handleCloseForm}
          />
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
                    onUpdate={() => onUpdatePoints(coin)}
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
                    onUpdate={() => onUpdatePoints(coin)}
                  />
                )}
              />
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}
