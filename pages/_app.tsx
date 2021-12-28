import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '../components/Navbar'
import Web3ContextProvider from '../context/web3context'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ContextProvider>
      <Navbar />
      <Component {...pageProps} />
      <ToastContainer />
    </Web3ContextProvider>
  )
}

export default MyApp
