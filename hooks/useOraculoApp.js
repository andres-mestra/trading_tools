import { useEffect, useRef, useState } from 'react'

import { useFormCoin } from 'hooks/useFormCoin'
import { useOrderBook } from 'hooks/useOrderBook'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { calcDistance } from 'helpers/distanceUtils'
import { calcBounces } from 'helpers/calcBounces'
import { useDecimal } from 'hooks/useDecimal'
import { useImportExportJson } from 'hooks/useImportExportJson'
import { useTwoToOne } from 'hooks/useTwoToOne'
import { useNotify } from 'hooks/useNotify'
import { binanceSocketURL, getVolume } from 'services/binanceService'
import { useFormatterCurrency } from './useFormatterCurrency'

export function useOraculoApp(longKeyStorage, shortKeyStorage) {
  const socketsRef = useRef([])
  const [getEntryPoints] = useOrderBook()
  const formatterCurrency = useFormatterCurrency('en-US', 'USD')
  const [loading, setLoading] = useState(null)
  const [openForm, setOpenForm] = useState(false)
  const [shortsStorage, setShortsStorage] = useLocalStorage(shortKeyStorage, [])
  const [longsStorage, setLongsStorage] = useLocalStorage(longKeyStorage, [])
  const [longs, setLongs] = useState([...longsStorage])
  const [shorts, setShorts] = useState([...shortsStorage])
  const { asNumber } = useDecimal()
  const [onGetTwoToOne] = useTwoToOne()
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

  const onLoadingCoin = (symbol) => {
    setLoading(symbol)
  }

  const handleGetTwoToOne = async () => {
    try {
      const points = await onGetTwoToOne(onLoadingCoin)
      let [longs, shorts] = points

      const volumeLongs = await Promise.allSettled(
        longs.map(({ symbol }) => getVolume(symbol))
      )
      longs = longs.map(
        ({ symbol, entry, target, buyBack, distTarget }, index) => ({
          symbol,
          entry,
          target,
          buyBack,
          distTarget,
          type: 'long',
          bounces: 0,
          lastPrice: 1,
          distanceEntry: 1,
          volumen: formatterCurrency(volumeLongs?.[index]?.value || -1),
        })
      )

      const volumeShorts = await Promise.allSettled(
        shorts.map(({ symbol }) => getVolume(symbol))
      )
      shorts = shorts.map(
        ({ symbol, entry, target, buyBack, distTarget }, index) => ({
          symbol,
          entry,
          target,
          buyBack,
          distTarget,
          type: 'short',
          bounces: 0,
          lastPrice: 1,
          distanceEntry: 1,
          volumen: formatterCurrency(volumeShorts?.[index]?.value || -1),
        })
      )

      setSetterPosition('long')(() => [...longs])
      setSetterPosition('short')(() => [...shorts])
      setStoragePosition('long')(() => [...longs])
      setStoragePosition('short')(() => [...shorts])
    } catch (error) {
      console.error('DOS_A_UNO:ERROR ', error)
      onNotify('Error al obtener dos a uno')
    } finally {
      setLoading(null)
      onNotify('Finalizo el análisis dos a uno')
    }
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
      const messageNotify = `${type.toUpperCase()} ${ticket.toUpperCase()} !!!`
      notify = onAlert(notify, distanceEntry, messageNotify)

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
      console.log('GENERAR SOCKT')
      socketsRef.current?.socket?.close()
      socketsRef.current = null
      socketsRef.current = generateSocket()
      setNCoins(length)
    }
  }, [longs, shorts])

  return {
    loading,
    longs,
    shorts,
    openForm,
    isAddCoin,
    currentCoin,
    onSetCurrentCoin,
    refInputImport,
    onFormCoin,
    onEditCoin,
    onDeleteCoin,
    onActiveNotify,
    onUpdatePoints,
    handleAddCoin,
    handleCloseForm,
    handleSubmitForm,
    handleExportPoints,
    handleImportPoints,
    handleGetTwoToOne,
  }
}
