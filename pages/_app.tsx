import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '../components/Navbar'
import Web3ContextProvider from '../context/web3context'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ContextProvider>
      <Navbar />
      <Component {...pageProps} />
    </Web3ContextProvider>
  )
}

export default MyApp
