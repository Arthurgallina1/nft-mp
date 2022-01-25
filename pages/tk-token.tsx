import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import TransferBox from '../components/TransferBox'
import { useWeb3Context } from '../context/web3context'
import useTKToken from '../hooks/useTKToken'
import useTTKCKToken from '../hooks/useTTKCToken'
import { formatBignumberToString } from '../utils/formatters'

const Token: NextPage = () => {
  const [userBalance, setUserBalance] = useState('0')
  const [transactioningAccount, setTransactioningAccount] = useState({
    address: '',
    balance: '',
  })

  const { TKTokenContract } = useTKToken()

  const { TTKCTokenContract } = useTTKCKToken()
  const { loggedAddress } = useWeb3Context()

  useEffect(() => {
    const fetchTKTokenData = async () => {
      console.debug('TKTokenContract', TKTokenContract)

      const balance = await TKTokenContract.balanceOf(loggedAddress)
      setUserBalance(formatBignumberToString(balance))
      // const totalSupply = await TKTokenContract.totalSupply()
    }
    if (TKTokenContract) {
      fetchTKTokenData()
      TKTokenContract.on(
        'Transfer',
        (from: string, to: string, amount: any, event: Record<string, any>) => {
          console.debug('events', { from, to, amount, event })
          toast.success(`Transfered ${formatBignumberToString(amount)}`)
        },
      )
    }

    return () => {
      if (TKTokenContract) {
        TKTokenContract.removeAllListeners()
      }
    }
  }, [TKTokenContract, TTKCTokenContract, loggedAddress])

  const onTransferClick = async (address: string, amount: string) => {
    try {
      const listeners = await TKTokenContract.listeners('Transfer')
      console.debug('listeners, ', listeners)
      console.debug('transfer to', address, amount)
      const tx = await TKTokenContract.transfer(address, amount)
      const txEvent = await tx.wait()
      const event = txEvent.events[0]
      const value = event.args[2]
      console.debug('transfer clic', txEvent, event, value)
    } catch (err) {
      console.log('error getting contract', err)
    }
  }

  const issueToken = async (address: string, amount: string) => {
    try {
      const tx = await TTKCTokenContract.issueToken(address, amount)
      await tx.wait()
    } catch (err) {
      console.log('error getting contract', err)
    }
  }

  const onCheckBalanceClick = async (address: string) => {
    try {
      const balance = await TKTokenContract.balanceOf(address)
      setTransactioningAccount({
        address,
        balance: formatBignumberToString(balance),
      })
    } catch (err) {
      console.log('err', err)
    }
  }

  return (
    <div className='p-8'>
      <h5>Your balance is {userBalance}</h5>
      <h5>
        Transactioning acc: {transactioningAccount.address} |{' '}
        {transactioningAccount.balance}
      </h5>

      <div className='mx-2'>
        <TransferBox
          onTransferClick={issueToken}
          onCheckBalanceClick={onCheckBalanceClick}
        />
      </div>
    </div>
  )
}

export default Token
