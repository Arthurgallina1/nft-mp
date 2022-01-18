import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Provider } from 'react-redux'

import Navbar from '../components/Navbar'
import { store } from '../data/store'
import Web3ContextProvider from '../context/web3context'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Web3ContextProvider>
        <Navbar />
        <Component {...pageProps} />
        <ToastContainer />
      </Web3ContextProvider>
    </Provider>
  )
}

export default MyApp
