import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'

import { useWeb3Context } from '../context/web3context'
import useTKMarketContract from '../hooks/useTKMarketContract'
import useTokenContract from '../hooks/useTokenContract'
import { formatPriceToEther } from '../utils/formatters'
import { FormattedNFT } from '../data/models/formattedNFT'

const Dashboard: NextPage = () => {
  const [nfts, setNfts] = useState<any>([])
  const [soldNFTs, setSoldNFTs] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(true)

  const { TKMarketContract } = useTKMarketContract()
  const { tokenContract } = useTokenContract()
  const { provider, loggedAddress } = useWeb3Context()

  useEffect(() => {
    if (TKMarketContract && tokenContract && provider && loggedAddress) {
      const loadMyNFTs = async () => {
        // get msg.sender to the signer to display owner nfts
        const createdNFTs = await TKMarketContract.fetchItemsCreated()

        const myNFTData = await Promise.all(
          createdNFTs.map(async (token: any) => {
            const tokenUri = await tokenContract.tokenURI(token.tokenId)
            const metaData = await axios.get(tokenUri)
            const price = formatPriceToEther(token.price.toString())
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

      loadMyNFTs()
    }
  }, [TKMarketContract, provider, tokenContract, loggedAddress])

  return (
    <div>
      <main>
        {!loading && !nfts.length && (
          <h1 className='px-20 py-7 text-4x1'>
            You do not have minted any NFT yet
          </h1>
        )}
        <div className='flex flex-col justify-center'>
          <div>
            <h2>Tokens minted</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
              {nfts.map((nft: FormattedNFT) => (
                <div key={nft.tokenId}>
                  <Image
                    src={nft.image}
                    height='300px'
                    width='300px'
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
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='flex flex-col justify-center'>
            <h2>Sold NFTs</h2>
            <div>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
                {soldNFTs.map((nft: FormattedNFT) => (
                  <div key={nft.tokenId}>
                    <Image
                      src={nft.image}
                      height='300px'
                      width='300px'
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
