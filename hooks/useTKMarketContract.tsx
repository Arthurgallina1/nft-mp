import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { nftMarketAddress } from '../config'
import TKMarket from '../artifacts/contracts/TKMarket.sol/TKMarket.json'
import { useWeb3Context } from '../context/web3context'

export default function useTKMarketContract() {
  const [TKMarketContract, setTKMarketContract] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const { signer } = useWeb3Context()

  useEffect(() => {
    const loadMarketContract = async () => {
      const marketContract = new ethers.Contract(
        nftMarketAddress,
        TKMarket.abi,
        signer,
      )
      setTKMarketContract(marketContract)
      setLoading(false)
    }
    loadMarketContract()
  }, [signer])

  return { TKMarketContract, loading }
}
