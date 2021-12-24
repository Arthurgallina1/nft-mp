import React, { useState } from 'react'
import Button from './Button'
import Input from './Input'
import Select from './Select'

const ADDRESSES = [
  { value: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc' },
  { value: '0x90f79bf6eb2c4f870365e785982e1f101e93b906' },
  { value: '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65' },
]

type TransferBoxType = {
  onTransferClick: (addr: string, amount: string) => void
  onCheckBalanceClick: (addr: string) => void
}

export default function TransferBox({
  onTransferClick,
  onCheckBalanceClick,
}: TransferBoxType) {
  const [value, setValue] = useState('')
  const [selectedAddress, setSelectedAddress] = useState(ADDRESSES[0].value)

  const isTransferEnabled = Number.parseFloat(value) > 0 //value.length > 0 && selectedAddress.length > 0

  return (
    <div className='flex flex-col'>
      <div className='w-1/2 mt-6'>
        <Select
          selectedValue={selectedAddress}
          onChange={(e) => {
            setSelectedAddress(e.target.value)
          }}
          options={ADDRESSES}
        />
      </div>
      <div>
        <Button onClick={() => onCheckBalanceClick(selectedAddress)}>
          Check address balance
        </Button>
      </div>

      <div className='w-1/2'>
        <Input
          value={value}
          label='Value to transfer'
          onChange={(e) => setValue(e.target.value)}
          placeholder='Value'
        />
      </div>

      <div>
        {isTransferEnabled && (
          <Button
            onClick={() => onTransferClick(selectedAddress, value)}
            disabled={!isTransferEnabled}
          >
            Transfer to address
          </Button>
        )}
      </div>
    </div>
  )
}
