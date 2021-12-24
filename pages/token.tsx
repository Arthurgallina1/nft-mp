import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import useTKTokenContract from '../hooks/useTKToken'

const Token: NextPage = () => {
  const { TKTokenContract } = useTKTokenContract()

  return (
    <div>
      <h3>token</h3>
    </div>
  )
}

export default Token
