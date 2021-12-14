import React, { useContext, createContext, useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { nftAddress, nftMarketAddress } from '../config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import TKMarket from '../artifacts/contracts/TKMarket.sol/TKMarket.json'
import axios from 'axios'

type Web3ContextProviderType = {
  children: JSX.Element | JSX.Element[]
}

type Web3ContextType = {
  nfts: any[]
}

const Web3Context = createContext<Web3ContextType>({
  nfts: [],
})

export const useWeb3Context = () => useContext(Web3Context)

export default function Web3ContextProvider({
  children,
}: Web3ContextProviderType) {
  const [nfts, setNfts] = useState<any>([])

  useEffect(() => {
    loadMyNFTs()
  }, [])

  const loadMyNFTs = async () => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
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
        const price = ethers.utils.formatUnits(token.price.toString(), 'ether')
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
    console.debug('tokens!', myNFTs)
  }

  return (
    <Web3Context.Provider value={{ nfts }}>{children}</Web3Context.Provider>
  )
}
