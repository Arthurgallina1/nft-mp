import React, { useContext, createContext, useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import WalletConnect from '@walletconnect/web3-provider'
import supportedChains from '../helpers/chain'

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
    const web3Modal = new Web3Modal({ cacheProvider: false, providerOptions })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const signerAddress = await signer.getAddress()

    provider.on('accountsChanged', async (accounts: string[]) => {
      console.debug('accounts changeds', accounts)
    })

    /* */
    const { chainId } = await provider.getNetwork()

    const chain = supportedChains.filter(
      (chain) => chain.chain_id === chainId,
    )[0]

    if (!chain) {
      throw new Error('Chain not supported')
    }
    /* */

    setProvider(provider)
    setSigner(signer)
    setLoggedAddress(signerAddress)
    subscribeProvider(provider)
  }

  const subscribeProvider = async (provider: any) => {
    console.debug('subscring provider')

    if (!provider.on) {
      console.debug('invalid provider')
      return
    }

    provider.on('close', () => {
      console.debug('provider closed')
    })

    provider.on('accountsChanged', async (accounts: string[]) => {
      console.debug('accounts changeds', accounts)
    })

    provider.on('chainChanged', async (chainId: number) => {
      console.debug('chain changed', chainId)
    })

    provider.on('networkChanged', async (networkId: number) => {
      console.debug('network changed', networkId)
    })
  }

  const loadWeb3 = async () => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const signerAddress = await signer.getAddress()
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
