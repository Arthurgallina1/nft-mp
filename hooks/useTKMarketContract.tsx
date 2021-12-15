import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'

import { nftAddress, nftMarketAddress } from '../config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import TKMarket from '../artifacts/contracts/TKMarket.sol/TKMarket.json'
import { useWeb3Context } from '../context/web3context'
import { FormattedNFT } from '../data/models/formattedNFT'

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
