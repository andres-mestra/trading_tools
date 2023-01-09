import { version } from '../../../package.json'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Typography, Paper, Stack, Button } from '@mui/material'
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
import { deviceDetector } from '../../helpers/deviceDetector'
import { useDecimal } from '../../hooks/useDecimal'
import { useImportExportJson } from '../../hooks/useImportExportJson'
import { useTwoToOne } from '../../hooks/useTwoToOne'

export function Home() {
  const socketsRef = useRef([])
  const [getEntryPoints] = useOrderBook()
  const [openForm, setOpenForm] = useState(false)
  const [shortsStorage, setShortsStorage] = useLocalStorage('shorts_data', [])
  const [longsStorage, setLongsStorage] = useLocalStorage('longs_data', [])
  const [longs, setLongs] = useState([...longsStorage])
  const [shorts, setShorts] = useState([...shortsStorage])
  const { asNumber } = useDecimal()
  const [handleGetTwoToOne] = useTwoToOne()
  const [importJson, exportJson, refInputImport] = useImportExportJson()
  const [nCoins, setNCoins] = useState(longs.length + shorts.length)
  const {
    newCoin: currentCoin,
    onSetNewCoin: onSetCurrentCoin,
    isAddCoin,
    onFormCoin,
    onResetForm,
    setIsAddCoin,
  } = useFormCoin()

  const deviceInfo = useMemo(() => deviceDetector(), [])

  const onAddCoin = async (newCoin) => {
    const { symbol, type } = newCoin
    const points = await getEntryPoints(symbol, type)
    if (points) {
      if (type === 'long') {
        setLongs((prevLongs) => {
          let longsList = structuredClone(prevLongs)
          longsList = longsList.filter((coin) => coin.symbol !== newCoin.symbol)
          longsList = [...longsList, { ...newCoin, ...points }]
          setLongsStorage(longsList)
          return longsList
        })
      }

      if (type === 'short') {
        setShorts((prevShorts) => {
          let shortsList = structuredClone(prevShorts)
          shortsList = shortsList.filter(
            (coin) => coin.symbol !== newCoin.symbol
          )
          shortsList = [...shortsList, { ...newCoin, ...points }]
          setShortsStorage(shortsList)
          return shortsList
        })
      }
    }

    setIsAddCoin(false)
  }

  const onPullCoin = (coin) => {
    if (coin.type === 'long') {
      setLongs((prev) => {
        let longsList = structuredClone(prev)
        const coinIndex = longsList.findIndex((c) => c.symbol === coin.symbol)
        if (coinIndex === -1) return prev
        return longsList
      })
    }

    if (coin.type === 'short') {
      setShorts((prev) => {
        let shortsList = structuredClone(prev)
        const coinIndex = shortsList.findIndex((c) => c.symbol === coin.symbol)
        if (coinIndex === -1) return prev
        return shortsList
      })
    }
  }

  const onDeleteCoin = (coin) => {
    const { symbol, type } = coin
    if (type === 'long') {
      setLongs((prev) => {
        const longsList = prev.filter((c) => c.symbol !== symbol)
        setLongsStorage(longsList)
        return longsList
      })
    }
    if (type === 'short') {
      setShorts((prev) => {
        const shortsList = prev.filter((c) => c.symbol !== symbol)
        setShortsStorage(shortsList)
        return shortsList
      })
    }
  }

  const onUpdatePoints = async (coin) => {
    const { symbol, type } = coin
    const points = await getEntryPoints(symbol, type)
    const newCoin = { ...coin, ...points }
    onPullCoin(newCoin)
  }

  const onEditCoin = (coin) => {
    setIsAddCoin(false)
    onSetCurrentCoin(coin)
    setOpenForm(true)
  }

  const handleImportPoints = (event) => {
    importJson(event, (newPoints) => {
      const { longs, shorts } = newPoints
      setLongs(longs)
      setShorts(shorts)
      setLongsStorage(longs)
      setShortsStorage(shorts)
    })
  }

  const handleExportPoints = () => {
    exportJson({ longs, shorts })
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
    const longsSymbols = longs.map(({ symbol }) => symbol)
    const shortsSymbols = shorts.map(({ symbol }) => symbol)
    const symbols = [...new Set(longsSymbols.concat(shortsSymbols))]

    if (symbols.length) {
      const symbolsParams = symbols
        .map((symbol) => `${symbol}usdt@markPrice@1s`)
        .join('/')
      const socket = new WebSocket(`${socketURL}=${symbolsParams}`)
      socket.onmessage = function (event) {
        const { data: resp } = JSON.parse(event.data)
        let { p: lastPrice, s: ticket } = resp
        ticket = ticket.replace('USDT', '').toLowerCase()
        lastPrice = asNumber(lastPrice)

        setLongs((prevState) => {
          const newState = structuredClone(prevState)
          const coinIndex = newState.findIndex((c) => c.symbol === ticket)

          if (coinIndex === -1) return newState

          const coin = newState[coinIndex]
          let notify = coin?.notify
          let { entry, bounces, type } = coin
          const distanceEntry = calcDistance(lastPrice, entry, type)
          bounces = calcBounces(bounces, distanceEntry)

          if ('Notification' in window && !deviceInfo.isMovil) {
            if (distanceEntry >= 0 && distanceEntry < 0.3) {
              if (notify === undefined) {
                notify = true
                new Notification('Notification', {
                  body: `${type.toUpperCase()} ${ticket.toUpperCase()} !!!!`,
                  dir: 'ltr',
                })
              }
            } else if (distanceEntry > 0.5) {
              notify = false
            }
          }

          newState[coinIndex] = {
            ...coin,
            bounces,
            distanceEntry,
            notify,
            lastPrice,
          }
          return [...newState]
        })

        setShorts((prevState) => {
          const newState = structuredClone(prevState)
          const coinIndex = newState.findIndex((c) => c.symbol === ticket)

          if (coinIndex === -1) return newState

          const coin = newState[coinIndex]
          let notify = coin?.notify
          let { entry, bounces, type } = coin

          const distanceEntry = calcDistance(lastPrice, entry, type)
          bounces = calcBounces(bounces, distanceEntry)

          if ('Notification' in window && !deviceInfo.isMovil) {
            if (distanceEntry >= 0 && distanceEntry < 0.3) {
              if (notify === undefined) {
                notify = true
                new Notification('Notification', {
                  body: `${type.toUpperCase()} ${ticket.toUpperCase()} !!!!`,
                  dir: 'ltr',
                })
              }
            } else if (distanceEntry > 0.5) {
              notify = false
            }
          }

          newState[coinIndex] = {
            ...coin,
            bounces,
            distanceEntry,
            notify,
            lastPrice,
          }
          return [...newState]
        })
      }

      return socket
    }

    return null
  }

  const handleNotification = () => {
    if (!('Notification' in window) && !deviceInfo.isMovil)
      return alert('This browser does not support nitifications.')

    Notification.requestPermission().then((result) => {
      console.log(result)
    })
  }

  useEffect(() => {
    const hasCoins = longs.length || shorts.length
    if (hasCoins) {
      socketsRef.current = generateSocket()
    }
    return () => {
      socketsRef.current?.socket?.close()
    }
  }, [])

  useEffect(() => {
    const length = longs.length + shorts.length
    if (length !== nCoins) {
      socketsRef.current?.socket?.close()
      socketsRef.current = null
      socketsRef.current = generateSocket()
      setNCoins(length)
    }
  }, [longs, shorts])

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
            <Button variant="outlined" onClick={handleGetTwoToOne}>
              Dos / Uno
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
            onChange={onFormCoin}
            onSubmit={handleSubmitForm}
            onClose={handleCloseForm}
          />
          <Stack direction="row" gap={2} justifyContent="space-between">
            <Stack gap={2}>
              <Typography variant="h3" color="success.light">
                Long
              </Typography>
              <TableCoins
                coins={longs}
                type="long"
                render={(coin, type, isLong, index) => (
                  <TableCoinsItem
                    key={`${coin.symbol}_${index}`}
                    type={type}
                    coin={coin}
                    isLong={isLong}
                    onDelete={() => onDeleteCoin(coin)}
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
                coins={shorts}
                type="short"
                render={(coin, type, isLong, index) => (
                  <TableCoinsItem
                    key={`${coin.symbol}_${index}`}
                    type={type}
                    coin={coin}
                    isLong={isLong}
                    onDelete={() => onDeleteCoin(coin)}
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
