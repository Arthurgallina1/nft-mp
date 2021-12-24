import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import TransferBox from '../components/TransferBox'
import { useWeb3Context } from '../context/web3context'
import useTKToken from '../hooks/useTKToken'
import { formatBignumberToString } from '../utils/formatters'

const Token: NextPage = () => {
  const [userBalance, setUserBalance] = useState('0')
  const [transactioningAccount, setTransactioningAccount] = useState({
    address: '',
    balance: '',
  })

  const { TKTokenContract } = useTKToken()
  const { loggedAddress } = useWeb3Context()

  useEffect(() => {
    const fetchTKTokenData = async () => {
      console.debug('loggedAddress', loggedAddress)
      const balance = await TKTokenContract.balanceOf(loggedAddress)
      setUserBalance(formatBignumberToString(balance))
      const totalSupply = await TKTokenContract.totalSupply()
      console.debug('totalSupply', formatBignumberToString(totalSupply))
    }
    if (TKTokenContract) {
      fetchTKTokenData()
    }
  }, [TKTokenContract, loggedAddress])

  const onTransferClick = async (address: string, amount: string) => {
    try {
      console.debug('transfer to', address, amount)
      const tx = await TKTokenContract.transfer(address, amount)
      const txEvent = await tx.wait()
      console.debug('tx', tx)
      // todo: add better event handling hooks
      const event = txEvent.events[0]
      const value = event.args[2]
      console.debug(txEvent, event, value)
    } catch (err) {
      console.log('error getting contract', err)
    }
  }

  const onCheckBalanceClick = async (address: string) => {
    try {
      console.debug('check addr balance', address)
      const balance = await TKTokenContract.balanceOf(address)
      console.debug('balance', formatBignumberToString(balance))
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
          onTransferClick={onTransferClick}
          onCheckBalanceClick={onCheckBalanceClick}
        />
      </div>
    </div>
  )
}

export default Token
