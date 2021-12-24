import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import TransferBox from '../components/TransferBox'
import { useWeb3Context } from '../context/web3context'
import useTKToken from '../hooks/useTKToken'
import { formatBignumberToString } from '../utils/formatters'

const Token: NextPage = () => {
  const [userBalance, setUserBalance] = useState('0')

  const { TKTokenContract } = useTKToken()
  const { loggedAddress } = useWeb3Context()

  useEffect(() => {
    const fetchTKTokenData = async () => {
      console.debug('loggedAddress', loggedAddress)
      const balance = await TKTokenContract.balanceOf(loggedAddress)
      const balanceOfJac = await TKTokenContract.balanceOf(
        '0xbcd4042de499d14e55001ccbb24a551f3b954096',
      )
      setUserBalance(formatBignumberToString(balance))
      console.log(formatBignumberToString(balance))
      console.log(formatBignumberToString(balanceOfJac))
    }
    if (TKTokenContract) {
      fetchTKTokenData()
    }
  }, [TKTokenContract, loggedAddress])

  return (
    <div className='p-8'>
      <h5>Your balance is {userBalance}</h5>
      <h4>0xbcd4042de499d14e55001ccbb24a551f3b954096 balance is {}</h4>

      <div className='mx-2'>
        <TransferBox />
      </div>
    </div>
  )
}

export default Token
