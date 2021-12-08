import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import axios from 'axios'
import Web3Modal from 'web3modal'

import { nftAddress, nftMarketAddress } from '../config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import TKMarket from '../artifacts/contracts/TKMarket.sol/TKMarket.json'

const Home: NextPage = () => {
  const [nfts, setNfts] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    loadNFTs()
  }, [])

  const loadNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(
      nftMarketAddress,
      TKMarket.abi,
      provider,
    )
    const tokens = await marketContract.fetchMarketTokens()
    console.debug('tokens', tokens)

    const nftData = await Promise.all(
      tokens.map(async (token: any) => {
        const tokenUri = await tokenContract.tokenURI(token.tokenId)
        //get token metadata json
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
    setLoading(false)
    setNfts(nftData)
  }

  //buy nfts function
  const buyNFT = async (nft: any) => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect() //metamask or other wallet
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner() //when buying you need a signer to contract info
    const contract = new ethers.Contract(nftMarketAddress, TKMarket.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(
      nftAddress,
      nft.tokenId,
      { value: price },
    )

    await transaction.wait()
    loadNFTs()
  }

  return (
    <div>
      <main>
        {!loading && !nfts.length && (
          <h1 className='px-20 py-7 text-4x1'>No NFTs in market</h1>
        )}
        <div className='flex justify-center'>
          <div className='px-4'></div>
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
                  <button
                    className='w-full bg-purple-500 text-white font-bold py-3 px-12 rounded'
                    onClick={() => buyNFT(nft)}
                  >
                    BUY
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
