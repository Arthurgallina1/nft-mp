import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import CheckBalance from '../components/CheckBalance'
import TransferBox from '../components/TransferBox'
import { useWeb3Context } from '../context/web3context'
import useTKToken from '../hooks/useTKToken'
import { formatBignumberToString } from '../utils/formatters'

const Token: NextPage = () => {
  const [userBalance, setUserBalance] = useState('0')

  const { TKTokenContract } = useTKToken()
  const { loggedAddress, signer } = useWeb3Context()

  useEffect(() => {
    const fetchTKTokenData = async () => {
      console.debug('loggedAddress', loggedAddress)
      const balance = await TKTokenContract.balanceOf(loggedAddress)
      const balanceOfJac = await TKTokenContract.balanceOf(
        '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
      )
      setUserBalance(formatBignumberToString(balance))
      console.log(formatBignumberToString(balance))
      console.log(formatBignumberToString(balanceOfJac))
    }
    if (TKTokenContract) {
      fetchTKTokenData()
    }
  }, [TKTokenContract, loggedAddress])

  const onTransferClick = async (address: string, amount: string) => {
    try {
      console.debug('transfer to', address, amount)
      const tx = await TKTokenContract.transfer(address, amount)
      console.debug('tx', tx)
    } catch (err) {
      console.log('error getting contract', err)
    }
  }

  return (
    <div className='p-8'>
      <h5>Your balance is {userBalance}</h5>
      <h4>0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc balance is {}</h4>

      <div className='mx-2'>
        <TransferBox onTransferClick={onTransferClick} />
        <CheckBalance />
      </div>
    </div>
  )
}

export default Token
