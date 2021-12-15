import React, { useContext, createContext, useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'

type Web3ContextProviderType = {
  children: JSX.Element | JSX.Element[]
}

type Web3ContextType = {
  signer: any
  provider: any
}

const Web3Context = createContext<Web3ContextType>({
  signer: null,
  provider: null,
})

export const useWeb3Context = () => useContext(Web3Context)

export default function Web3ContextProvider({
  children,
}: Web3ContextProviderType) {
  const [provider, setProvider] = useState<any>(null)
  const [signer, setSigner] = useState<any>(null)

  useEffect(() => {
    loadWeb3()
  }, [])

  const loadWeb3 = async () => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    setProvider(provider)
    setSigner(signer)
  }

  return (
    <Web3Context.Provider value={{ signer, provider }}>
      {children}
    </Web3Context.Provider>
  )
}
