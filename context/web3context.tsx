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
  const [network, setNetwork] = useState<string>('')

  useEffect(() => {
    // loadWeb3()
  }, [])

  useEffect(() => {
    const web3Modal = new Web3Modal({ cacheProvider: true, providerOptions })
    if (web3Modal.cachedProvider) {
      connectWallet()
      console.debug('cached so vai')
    }
  }, [])

  const connectWallet = async () => {
    const web3Modal = new Web3Modal({ cacheProvider: true, providerOptions })
    // if (web3Modal.cachedProvider) {
    //   console.debug('cached provider on')
    // }

    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    console.log('provider', provider)
    const signer = provider.getSigner()
    const signerAddress = await signer.getAddress()

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
    subscribeProvider(connection)
  }

  const subscribeProvider = async (connection: any) => {
    console.debug('subscring connection')

    if (!connection.on) {
      console.debug('invalid connection')
      return
    }

    connection.on('close', () => {
      console.debug('connection closed')
    })

    connection.on('accountsChanged', async (accounts: string[]) => {
      console.debug('accounts changeds', accounts)
      setLoggedAddress(accounts[0])
    })

    connection.on('chainChanged', async (chainId: number) => {
      console.debug('chain changed', chainId)
    })

    connection.on('networkChanged', async (networkId: number) => {
      console.debug('network changed', networkId)

      const network = supportedChains.filter(
        (chain) => chain.network_id == networkId,
      )[0]
      console.debug('network', network)
      // window.location.reload()
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
