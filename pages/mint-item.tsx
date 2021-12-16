import React, { useState } from 'react'
import { useRouter } from 'next/router'
import type { NextPage } from 'next'
import { create as ipfsHttpClient } from 'ipfs-http-client'

import { nftAddress } from '../config'
import { useWeb3Context } from '../context/web3context'
import useTokenContract from '../hooks/useTokenContract'
import { parsePriceToEther } from '../utils/formatters'
import useTKMarketContract from '../hooks/useTKMarketContract'
import { mintTokenFormSchema } from '../utils/validations'

const IPFS_URL = 'https://ipfs.infura.io:5001/api/v0'

// Set IPFS up to host NFT data - file storage
const client = ipfsHttpClient({ url: IPFS_URL })

const MintItem: NextPage = () => {
  const router = useRouter()
  const { signer, loggedAddress } = useWeb3Context()
  const { tokenContract } = useTokenContract()
  const { TKMarketContract } = useTKMarketContract()
  const [fileUrl, setFileUrl] = useState('')
  const [formData, setFormData] = useState({
    price: '',
    name: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)

  const onChange = async (e: React.ChangeEvent) => {
    try {
      setLoading(true)
      const target = e.target as HTMLInputElement
      const file: File = (target.files as FileList)[0]
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      })

      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
      console.log('url', url)
    } catch (err) {
      console.log(`Error uploading file: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const createMarket = async () => {
    try {
      const { name, description, price } = formData
      const isFormValid = await mintTokenFormSchema.isValid(formData)

      if (!isFormValid) return

      //upload to IPFS
      const data = JSON.stringify({
        name,
        description,
        image: fileUrl,
      })
      setLoading(true)

      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      //create sale and passes in the url
      createSale(url)
      setLoading(false)
    } catch (err) {
      console.log(`Error uploading file: ${err}`)
      setLoading(false)
    }
  }

  const createSale = async (url: string) => {
    //create token
    const bindedSigner = tokenContract.connect(signer)
    let transaction = await bindedSigner.mintToken(url)
    const tx = await transaction.wait()
    const event = tx.events[0]
    const value = event.args[2]
    const tokenId = value.toNumber()
    const price = parsePriceToEther(formData.price)
    let listingPrice = await TKMarketContract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await TKMarketContract.mintMarketItem(
      nftAddress,
      tokenId,
      price,
      { value: listingPrice },
    )
    await transaction.wait()
    router.push('/')
  }

  return (
    <div className='flex justify-center'>
      <div className='w-1/2 flex flex-col pb-12'>
        <input
          placeholder='Asset Name'
          className='mt-8 border rounded p-4'
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <textarea
          placeholder='Asset Description'
          className='mt-2 border rounded p-4'
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          placeholder='Asset Price in Eth'
          className='mt-2 border rounded p-4'
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
        <input
          type='file'
          name='Asset'
          placeholder='Asset Price in Eth'
          className='mt-2 border rounded p-4'
          onChange={onChange}
        />
        {/* {TODO: add proper loading} */}
        {loading ? 'loading' : 'nao load'}
        {fileUrl && (
          <img src={fileUrl} alt='img' className='rounded mt-4' width='350px' />
        )}
        {loggedAddress ? (
          <button
            className='font-bold mt-4 rounded bg-blue-900 text-white p-4 shadow-lg'
            onClick={createMarket}
            disabled={loading}
          >
            Mint NFT
          </button>
        ) : (
          <div>Please log in to mint tokens</div>
        )}
      </div>
    </div>
  )
}

export default MintItem
