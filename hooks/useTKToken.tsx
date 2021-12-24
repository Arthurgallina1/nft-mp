import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { tkTokenAddress } from '../config'
import TKToken from '../artifacts/contracts/TKToken.sol/TKToken.json'
import { useWeb3Context } from '../context/web3context'
import { FormattedNFT } from '../data/models/formattedNFT'

export default function useTKTokenContract() {
  const [TKTokenContract, setTKTokenContract] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const { signer } = useWeb3Context()

  useEffect(() => {
    const loadTKTokenContract = async () => {
      const tkToken = new ethers.Contract(tkTokenAddress, TKToken.abi, signer)
      console.debug(tkToken, 'tkToken')
      setTKTokenContract(tkToken)
      setLoading(false)
    }
    loadTKTokenContract()
  }, [signer])

  return { TKTokenContract, loading }
}
