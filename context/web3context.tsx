import React, { useContext, createContext, useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import WalletConnect from '@walletconnect/web3-provider'

type Web3ContextProviderType = {
  children: JSX.Element | JSX.Element[]
}

type Web3ContextType = {
  signer: any
  provider: any
  loggedAddress: string
  connectWallet: () => void
}

const Web3Context = createContext<Web3ContextType>({
  signer: null,
  provider: null,
  loggedAddress: '',
  connectWallet: () => ({}),
})

export const useWeb3Context = () => useContext(Web3Context)

const providerOptions = {
  walletconnect: {
    package: WalletConnect,
    options: {
      infuraId: '123',
    },
  },
  // torus: {
  //   package: Torus
  // },
  // walletlink: {
  //   package: WalletLink,
  //   options: {
  //     appName: "Web3Modal Example App",
  //     infuraId
  //   }
  // }
}

export default function Web3ContextProvider({
  children,
}: Web3ContextProviderType) {
  const [provider, setProvider] = useState<any>(null)
  const [signer, setSigner] = useState<any>(null)
  const [loggedAddress, setLoggedAddress] = useState('')

  useEffect(() => {
    // loadWeb3()
  }, [])

  const connectWallet = async () => {
    console.debug('calling it')
    const web3Modal = new Web3Modal({ cacheProvider: true, providerOptions })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const signerAddress = await signer.getAddress()
    // const signerBall = await signer.getBalance()
    setProvider(provider)
    setSigner(signer)
    setLoggedAddress(signerAddress)
  }

  const loadWeb3 = async () => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const signerAddress = await signer.getAddress()
    // const signerBall = await signer.getBalance()
    setProvider(provider)
    setSigner(signer)
    setLoggedAddress(signerAddress)
  }

  return (
    <Web3Context.Provider
      value={{ signer, provider, loggedAddress, connectWallet }}
    >
      {children}
    </Web3Context.Provider>
  )
}
