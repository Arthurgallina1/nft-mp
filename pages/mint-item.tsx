import { ethers } from 'ethers'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import type { NextPage } from 'next'

import Web3Modal from 'web3modal'
import { create as ipfsHttpClient } from 'ipfs-http-client'

import { nftAddress, nftMarketAddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import TKMarket from '../artifacts/contracts/TKMarket.sol/TKMarket.json'
import {} from 'next/dist/client/router'

const IPFS_URL = 'https://ipfs.infura.io:5001/api/v0/'

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

      const url = `${IPFS_URL}/${added.path}`
      setFileUrl(url)
    } catch (err) {
      console.log(`Error uploading file: ${err}`)
    }
  }

  return <h1>123</h1>
}

export default MintItem
