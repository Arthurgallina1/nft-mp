import React, { useState } from 'react'
import Input from './Input'
import Select from './Select'

const ADDRESSES = [{ value: '1' }, { value: '2' }, { value: '3' }]

export default function TransferBox() {
  const [value, setValue] = useState('0')
  const [selectedAddress, setSelectedAddress] = useState('')

  return (
    <div>
      <div className='w-1/2'>
        <Input
          value={value}
          label='Value to transfer'
          onChange={(e) => setValue(e.target.value)}
          placeholder='value'
        />
      </div>
      <div className='w-1/2 mt-6'>
        <Select
          selectedValue={selectedAddress}
          onChange={(e) => {
            setSelectedAddress(e.target.value)
          }}
          options={ADDRESSES}
        />
      </div>
    </div>
  )
}
