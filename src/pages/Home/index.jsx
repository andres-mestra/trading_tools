import { version } from '../../../package.json'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Typography, Paper, Stack, Button, Tooltip } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import { FormAddCoin } from '../../components/FormAddCoin'
import { TableCoins } from '../../components/TableCoins'
import { TableCoinsItem } from '../../components/TableCoinsItem'
import { ToggleThemeMode } from '../../components/ToggleThemeMode'

import { useFormCoin } from '../../hooks/useFormCoin'
import { useOrderBook } from '../../hooks/useOrderBook'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { calcDistance } from '../../helpers/distanceUtils'
import { calcBounces } from '../../helpers/calcBounces'
import { useDecimal } from '../../hooks/useDecimal'
import { useImportExportJson } from '../../hooks/useImportExportJson'
import { useTwoToOne } from '../../hooks/useTwoToOne'
import { useNotify } from '../../hooks/useNotify'
import { binanceSocketURL } from '../../services/binanceService'

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
  const { onNotify, onActiveNotify } = useNotify()

  const setSetterPosition = (type) => {
    return type === 'long' ? setLongs : setShorts
  }

  const setStoragePosition = (type) => {
    return type === 'long' ? setLongsStorage : setShortsStorage
  }

  const onAddCoin = async (newCoin) => {
    const { symbol, type } = newCoin
    const points = await getEntryPoints(symbol, type)
    if (points) {
      setSetterPosition(type)((prev) => {
        let positionsList = structuredClone(prev)
        positionsList = positionsList.filter(
          (coin) => coin.symbol !== newCoin.symbol
        )
        positionsList = [...positionsList, { ...newCoin, ...points }]
        setStoragePosition(type)(positionsList)
        return positionsList
      })
    }
    setIsAddCoin(false)
  }

  const onPullCoin = (coin) => {
    setSetterPosition(coin.type)((prev) => {
      let positionsList = structuredClone(prev)
      const coinIndex = positionsList.findIndex((c) => c.symbol === coin.symbol)
      if (coinIndex === -1) return prev
      positionsList[coinIndex] = { ...coin }
      setStoragePosition(coin.type)(positionsList)
      return [...positionsList]
    })
  }

  const onDeleteCoin = (coin) => {
    const { symbol, type } = coin

    setSetterPosition(type)((prev) => {
      const positionsList = prev.filter((c) => c.symbol !== symbol)
      setStoragePosition(type)(positionsList)
      return positionsList
    })
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
    const coin = { ...currentCoin, symbol: currentCoin.symbol.toLowerCase() }
    isAddCoin ? onAddCoin(coin) : onPullCoin(coin)
    onResetForm()
  }

  const onAlert = (notify, distanceEntry, message) => {
    if (distanceEntry >= 0 && distanceEntry < 0.3) {
      if (notify === undefined || notify === false) {
        onNotify(message)
        return true
      }
    } else if (distanceEntry > 0.5) {
      return false
    }

    return notify
  }

  const onUpdateCoinSocket = (ticket, lastPrice, positionType) => {
    setSetterPosition(positionType)((prevState) => {
      const newState = structuredClone(prevState)
      const coinIndex = newState.findIndex((c) => c.symbol === ticket)

      if (coinIndex === -1) return newState

      const coin = newState[coinIndex]
      let { entry, bounces, type } = coin
      const distanceEntry = calcDistance(lastPrice, entry, type)
      bounces = calcBounces(bounces, distanceEntry)

      let notify = coin?.notify
      notify = onAlert(`${type.toUpperCase()} ${ticket.toUpperCase()} !!!`)

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

  const generateSocket = () => {
    const longsSymbols = longs.map(({ symbol }) => symbol)
    const shortsSymbols = shorts.map(({ symbol }) => symbol)
    const symbols = [...new Set(longsSymbols.concat(shortsSymbols))]

    if (symbols.length) {
      const symbolsParams = symbols
        .map((symbol) => `${symbol.toLowerCase()}usdt@markPrice@1s`)
        .join('/')
      const socket = new WebSocket(`${binanceSocketURL}=${symbolsParams}`)

      socket.onmessage = function (event) {
        const { data: resp } = JSON.parse(event.data)
        let { p: lastPrice, s: ticket } = resp
        ticket = ticket.replace('USDT', '').toLowerCase()
        lastPrice = asNumber(lastPrice)

        onUpdateCoinSocket(ticket, lastPrice, 'long')
        onUpdateCoinSocket(ticket, lastPrice, 'short')
      }

      return socket
    }

    return null
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
            <Tooltip title="Ejecutar, luego ver tabla en consola del navegador">
              <Button variant="outlined" onClick={handleGetTwoToOne}>
                Dos / Uno
              </Button>
            </Tooltip>
            <Button variant="outlined" onClick={onActiveNotify}>
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
