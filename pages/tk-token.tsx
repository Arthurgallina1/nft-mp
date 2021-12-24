import { NextPage } from 'next'
import useTKToken from '../hooks/useTKToken'

const Token: NextPage = () => {
  const { TKTokenContract } = useTKToken()

  console.debug('TKTokenContract', TKTokenContract)

  return <h1 className='px-3'>olar</h1>
}

export default Token
