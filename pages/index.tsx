import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'
import axios from 'axios'
import Web3Modal from 'web3modal'

import { nftAddress, nftMarketAddress } from '../config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import TKMarket from '../artifacts/contracts/TKMarket.sol/TKMarket.json'
import { formatPriceToEther, parsePriceToEther } from '../utils/formatters'
import Button from '../components/Button'
import { FormattedNFT } from '../data/models/formattedNFT'
import { useWeb3Context } from '../context/web3context'
import useTokenContract from '../hooks/useTokenContract'
import useTKMarketContract from '../hooks/useTKMarketContract'
import { Log, Filter } from '@ethersproject/abstract-provider'

const Home: NextPage = () => {
  const [nfts, setNfts] = useState<FormattedNFT[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { loggedAddress, provider } = useWeb3Context()
  const { tokenContract } = useTokenContract()
  const { TKMarketContract } = useTKMarketContract()

  const logs = async (): Promise<Log[]> => {
    const filter: Filter = {
      // address: loggedAddress,
    }
    return await provider.getLogs(filter)
  }

  const loadNFTs = useCallback(async () => {
    if (provider) {
      console.debug('hi', await logs())
      const log = await logs()
      const firstLog = log[0] || {}
      console.debug('firstLog.logIndex', firstLog.logIndex)
    }
    // const provider = new ethers.providers.JsonRpcProvider()
    // const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
    // const marketContract = new ethers.Contract(
    //   nftMarketAddress,
    //   TKMarket.abi,
    //   provider,
    // )
    const tokens = await TKMarketContract.fetchMarketTokens()

    const nftData = await Promise.all(
      tokens.map(async (token: any) => {
        const tokenUri = await tokenContract.tokenURI(token.tokenId)
        //get token metadata json
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

    setLoading(false)
    setNfts(nftData)
  }, [tokenContract, TKMarketContract])

  useEffect(() => {
    if (loggedAddress && tokenContract && TKMarketContract) {
      loadNFTs()
    }
  }, [loggedAddress, tokenContract, TKMarketContract, loadNFTs])

  //buy nfts function
  const buyNFT = async (nft: FormattedNFT) => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect() //metamask or other wallet
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner() //when buying you need a signer to contract info
    const contract = new ethers.Contract(nftMarketAddress, TKMarket.abi, signer)

    const price = parsePriceToEther(nft.price.toString())
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
        {!loggedAddress && (
          <h1 className='px-20 py-7 text-4x1'>
            Please login to check our marketplace
          </h1>
        )}
        {!loading && !nfts.length && (
          <h1 className='px-20 py-7 text-4x1'>No NFTs in market</h1>
        )}
        <div className='flex justify-center'>
          <div className='px-4'></div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
            {nfts.map((nft: FormattedNFT) => (
              <div key={nft.tokenId}>
                <Image
                  src={nft.image}
                  width='300px'
                  height='300px'
                  alt={nft.description}
                />
                <div className='p-4'>
                  <p className='text-3x1 font-semibold'>{nft.name}</p>
                  <p className='text-gray-400'>{nft.description}</p>
                </div>
                <div className='p-4 bg-black'>
                  <p className='text-3x-1 mb-4 font-bold text-white'>
                    {nft.price} ETH
                  </p>
                  <Button onClick={() => buyNFT(nft)}>BUY</Button>
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
