import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDecimal } from 'hooks/useDecimal'
import { useLocalStorage } from './useLocalStorage'
import { connector, networks, useWeb3Context } from 'config/web3'
import { balanceOfABI } from 'helpers/web3/abis'
import { convertBnbToUSD } from 'helpers/convertBnbToUSD'
import { OGTAddress } from 'helpers/web3/address'

const MIN_OGT_AMOUNT_IN_USD = 1

export function useAuthWallet() {
  const [loading, setLoading] = useState(false)
  const [hasMinOGT, setHasMinOGT] = useLocalStorage('hasMinOGT', false)
  const { active, account, chainId, error, activate, deactivate, library } =
    useWeb3Context()
  const { asNumber } = useDecimal()

  const networkName = useMemo(() => {
    return networks[chainId] || ''
  }, [chainId])

  const connect = useCallback(() => {
    setLoading(true)
    activate(connector)
    localStorage.setItem('previouslyConnected', true)
    setLoading(false)
  }, [activate])

  const disconnect = () => {
    setLoading(true)
    deactivate()
    localStorage.removeItem('previouslyConnected')
    setHasMinOGT(false)
    setLoading(false)
  }

  const vefiryOgtAmount = async () => {
    if (active) {
      setLoading(true)
      const contract = new library.eth.Contract(balanceOfABI, OGTAddress)
      const result = await contract.methods.balanceOf(account).call()
      const nTokensInBnb = library.utils.fromWei(result)
      const amount = await convertBnbToUSD(asNumber(nTokensInBnb))
      const hasOGT = amount >= MIN_OGT_AMOUNT_IN_USD
      setHasMinOGT(hasOGT)
      setLoading(false)
      return hasOGT
    } else {
      return false
    }
  }

  useEffect(() => {
    if (localStorage.getItem('previouslyConnected') === 'true') {
      connect()
    }
  }, [connect])

  return {
    connect,
    disconnect,
    vefiryOgtAmount,
    error,
    account,
    active,
    loading,
    networkName,
    hasMinOGT,
    setHasMinOGT,
  }
}
