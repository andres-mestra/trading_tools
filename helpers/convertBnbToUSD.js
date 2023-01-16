import Web3 from 'web3'
import { useDecimal } from 'hooks/useDecimal'
import { pancakeSwapAbi } from 'helpers/web3/abis'
import {
  pancakeSwapContract,
  BNBTokenAddress,
  USDTokenAddress,
} from 'helpers/web3/address'

async function calcBNBPrice() {
  const web3 = new Web3('https://bsc-dataseed1.binance.org')
  let bnbToSell = web3.utils.toWei('1', 'ether')
  let amountOut
  try {
    let router = await new web3.eth.Contract(
      pancakeSwapAbi,
      pancakeSwapContract
    )
    amountOut = await router.methods
      .getAmountsOut(bnbToSell, [BNBTokenAddress, USDTokenAddress])
      .call()
    amountOut = web3.utils.fromWei(amountOut[1])
  } catch (error) {}
  if (!amountOut) return 0
  return amountOut
}

export const convertBnbToUSD = async (nTokensInBnb) => {
  const { mul } = useDecimal()
  // query pancakeswap to get the price of BNB in USDT
  const bnbPrice = await calcBNBPrice()
  console.log(`CURRENT BNB PRICE: ${bnbPrice}`)
  const amount = mul(nTokensInBnb, bnbPrice)

  return amount
}
