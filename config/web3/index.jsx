'use client'

import web3 from 'web3'
import { useContext } from 'react'
import { Web3ReactProvider, getWeb3ReactContext } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'

export const networks = {
  //1: 'ETHEREUM NETWORK',
  56: 'BNB SMART CHAIN',
}

export const networksIds = Object.entries(networks).map(([id]) => parseInt(id))

export const connector = new InjectedConnector({
  supportedChainIds: [...networksIds],
})

export const getLibrary = (provider) => {
  const library = new web3(provider)
  return library
}

export const Web3Provider = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>
  )
}

export const useWeb3Context = () => {
  const context = useContext(getWeb3ReactContext())
  return context
}
