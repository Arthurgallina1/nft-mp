import { ethers } from 'ethers'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import type { NextPage } from 'next'

import Web3Modal from 'web3modal'
import { create as ipfsHttpClient } from 'ipfs-http-client'

import { nftAddress, nftMarketAddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import TKMarket from '../artifacts/contracts/TKMarket.sol/TKMarket.json'

const IPFS_URL = 'https://ipfs.infura.io:5001/api/v0'

// Set IPFS up to host NFT data - file storage
const client = ipfsHttpClient({ url: IPFS_URL })

const MintItem: NextPage = () => {
  const router = useRouter()
  const [fileUrl, setFileUrl] = useState('')
  const [formData, setFormData] = useState({
    price: '',
    name: '',
    description: '',
  })

  const onChange = async (e: React.ChangeEvent) => {
    try {
      const target = e.target as HTMLInputElement
      const file: File = (target.files as FileList)[0]
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      })

      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (err) {
      console.log(`Error uploading file: ${err}`)
    }
  }

  const createMarket = async () => {
    try {
      const { name, description, price } = formData

      //to do: add proper validation on form submit
      if (!name || !description || !price || !fileUrl) return

      //upload to IPFS
      const data = JSON.stringify({
        name,
        description,
        image: fileUrl,
      })

      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      //create sale and passes in the url
      createSale(url)
    } catch (err) {
      console.log(`Error uploading file: ${err}`)
    }
  }

  const createSale = async (url: string) => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    //create token
    const contract = new ethers.Contract(nftAddress, NFT.abi, signer)
    let transaction = await contract.mintToken(url)
    const tx = await transaction.wait()
    const event = tx.events[0]
    const value = event.args[2]
    const tokenId = value.toNumber()
    const price = ethers.utils.parseUnits(formData.price, 'ether')

    //list for sale on marketplace

    const marketContract = new ethers.Contract(
      nftMarketAddress,
      TKMarket.abi,
      signer,
    )
    let listingPrice = await marketContract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await marketContract.mintMarketItem(
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
        {fileUrl && (
          <img src={fileUrl} alt='img' className='rounded mt-4' width='350px' />
        )}
        <button
          className='font-bold mt-4 rounded bg-blue-900 text-white p-4 shadow-lg'
          onClick={createMarket}
        >
          Mint NFT
        </button>
      </div>
    </div>
  )
}

export default MintItem
