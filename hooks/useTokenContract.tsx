import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'

import { nftAddress, nftMarketAddress } from '../config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import TKMarket from '../artifacts/contracts/TKMarket.sol/TKMarket.json'
import { useWeb3Context } from '../context/web3context'
import { FormattedNFT } from '../data/models/formattedNFT'
import { formatPriceToEther } from '../utils/formatters'

export default function useTokenContract() {
  const [tokenContract, setTokenContract] = useState<any>()
  const [nfts, setNfts] = useState<FormattedNFT[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const { signer, provider } = useWeb3Context()

  useEffect(() => {
    const loadMyNFTs = async () => {
      const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
      setTokenContract(tokenContract)
      const marketContract = new ethers.Contract(
        nftMarketAddress,
        TKMarket.abi,
        signer,
      )
      const myNFTs = await marketContract.fetchMyNFTs()
      const myNFTData = await Promise.all(
        myNFTs.map(async (token: any) => {
          const tokenUri = await tokenContract.tokenURI(token.tokenId)
          const metaData = await axios.get(tokenUri)
          const price = formatPriceToEther(token.price.toString())
          const formattedToken = {
            price,
            tokenId: token.tokenId.toNumber(),
            seller: token.seller,
            owner: token.owner,
            image: metaData.data.image,
            name: metaData.data.name,
            description: metaData.data.description,
          }
          return formattedToken
        }),
      )
      setNfts(myNFTData)
      setLoading(false)
    }

    loadMyNFTs()
  }, [signer, provider])

  return { tokenContract, nfts, loading }
}
