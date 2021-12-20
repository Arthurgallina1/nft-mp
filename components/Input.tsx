import React from 'react'

type InputType = {
  value: string
  placeholder: string
  onChange: (e: any) => void
  error?: string
}

export default function Input({
  value,
  error,
  placeholder,
  onChange,
}: InputType) {
  return (
    <div className='w-full'>
      <input
        placeholder={placeholder}
        className='w-full mt-8 border rounded p-4'
        onChange={onChange}
        value={value}
      />
      {!!error && <span>{error}</span>}
    </div>
  )
}
