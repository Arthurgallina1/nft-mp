import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { tkTokenCappedAddress } from '../config'
import { useWeb3Context } from '../context/web3context'
import TKTokenCapped from '../artifacts/contracts/TKTokenCapped.sol/TKTokenCapped.json'

export default function useTTKCKToken() {
  const [TTKCTokenContract, setTTKCTokenContract] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const { signer } = useWeb3Context()

  useEffect(() => {
    const loadTKTokenContract = async () => {
      if (signer) {
        const TTKCTokenContractInstace = new ethers.Contract(
          tkTokenCappedAddress,
          TKTokenCapped.abi,
          signer,
        )
        setTTKCTokenContract(TTKCTokenContractInstace)
        setLoading(false)
      } else {
      }
    }
    loadTKTokenContract()
  }, [signer])

  return { TTKCTokenContract, loading }
}
