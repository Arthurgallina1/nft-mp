import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { tkTokenAddress } from '../config'
import { useWeb3Context } from '../context/web3context'
import TKToken from '../artifacts/contracts/TKToken.sol/TKToken.json'

export default function useTKToken() {
  const [TKTokenContract, setTKTokenContract] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const { signer } = useWeb3Context()

  useEffect(() => {
    const loadTKTokenContract = async () => {
      if (signer) {
        const TKTokenContractInstace = new ethers.Contract(
          tkTokenAddress,
          TKToken.abi,
          signer,
        )
        setTKTokenContract(TKTokenContractInstace)
        setLoading(false)
        console.debug(' signer provided')
      } else {
        console.debug('no signer provided')
      }
    }
    loadTKTokenContract()
  }, [signer])

  return { TKTokenContract, loading }
}
