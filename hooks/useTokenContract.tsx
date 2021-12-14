import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { nftAddress, nftMarketAddress } from '../config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import TKMarket from '../artifacts/contracts/TKMarket.sol/TKMarket.json'
import { useWeb3Context } from '../context/web3context'
import { FormattedNFT } from '../data/models/formattedNFT'

export default function useTokenContract() {
  const [nfts, setNfts] = useState<FormattedNFT[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const { signer, provider } = useWeb3Context()

  useEffect(() => {
    const loadMyNFTs = async () => {
      const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
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
          const price = ethers.utils.formatUnits(
            token.price.toString(),
            'ether',
          )
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

  return { nfts, loading }
}
