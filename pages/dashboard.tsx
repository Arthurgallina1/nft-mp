import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import axios from 'axios'
import Web3Modal from 'web3modal'

import { nftAddress, nftMarketAddress } from '../config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import TKMarket from '../artifacts/contracts/TKMarket.sol/TKMarket.json'

const Dashboard: NextPage = () => {
  const [nfts, setNfts] = useState<any>([])
  const [soldNFTs, setSoldNFTs] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    loadMyNFTs()
  }, [])

  const loadMyNFTs = async () => {
    // get msg.sender to the signer to display owner nfts

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
    const createdNFTs = await marketContract.fetchItemsCreated()

    const myNFTData = await Promise.all(
      createdNFTs.map(async (token: any) => {
        const tokenUri = await tokenContract.tokenURI(token.tokenId)
        const metaData = await axios.get(tokenUri)
        const price = ethers.utils.formatUnits(token.price.toString(), 'ether')
        const formattedToken = {
          price,
          tokenId: token.tokenId.toNumber(),
          seller: token.seller,
          owner: token.owner,
          sold: token.sold,
          image: metaData.data.image,
          name: metaData.data.name,
          description: metaData.data.description,
        }
        return formattedToken
      }),
    )

    const soldItems = myNFTData.filter((nft) => nft.sold)
    setLoading(false)
    setNfts(myNFTData)
    setSoldNFTs(soldItems)
  }

  return (
    <div>
      <main>
        {!loading && !nfts.length && (
          <h1 className='px-20 py-7 text-4x1'>
            You do not have minted any NFT yet
          </h1>
        )}
        <div className='flex flex-col justify-center'>
          <h2>Tokens minted</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
            {nfts.map((nft: any) => (
              <div key={nft.tokenId}>
                <img src={nft.image} />
                <div className='p-4'>
                  <p className='text-3x1 font-semibold'>{nft.name}</p>
                  <p className='text-gray-400'>{nft.description}</p>
                </div>
                <div className='p-4 bg-black'>
                  <p className='text-3x-1 mb-4 font-bold text-white'>
                    {nft.price} ETH
                  </p>
                </div>
              </div>
            ))}
          </div>

          <h2>Sold NFTs</h2>
          <div className='flex justify-center'>
            <div className='px-4'></div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
              {soldNFTs.map((nft: any) => (
                <div key={nft.tokenId}>
                  <img src={nft.image} />
                  <div className='p-4'>
                    <p className='text-3x1 font-semibold'>{nft.name}</p>
                    <p className='text-gray-400'>{nft.description}</p>
                  </div>
                  <div className='p-4 bg-black'>
                    <p className='text-3x-1 mb-4 font-bold text-white'>
                      {nft.price} ETH
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
