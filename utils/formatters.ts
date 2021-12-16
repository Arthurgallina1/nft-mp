import { ethers } from 'ethers'

const parsePriceToEther = (price: string) => {
  return ethers.utils.parseUnits(price, 'ether')
}

const formatPriceToEther = (price: string) => {
  return ethers.utils.formatUnits(price, 'ether')
}

const formatBignumberToString = (wei: ethers.BigNumberish) => {
  return ethers.utils.formatEther(wei)
}

export { parsePriceToEther, formatPriceToEther, formatBignumberToString }
