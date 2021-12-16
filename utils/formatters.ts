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

function getFieldErrors(objError: any) {
  const errors: any = {}
  if (objError) {
    objError.forEach((err: any) => {
      return (errors[err.path] = err.message)
    })
  }
  return errors
}

export {
  parsePriceToEther,
  formatPriceToEther,
  formatBignumberToString,
  getFieldErrors,
}
