import React from 'react'

type InputType = {
  value: string
  placeholder: string
  onChange: (e: any) => void
  label?: string
  error?: string
  size?: 'small' | 'medium' | 'large'
}

export default function Input({
  value,
  error,
  placeholder,
  label,
  size = 'small',
  onChange,
}: InputType) {
  const sizeStyling = {
    small: 'p-2',
    medium: 'p-4',
    large: 'p-6',
  }

  return (
    <div className='w-full  mt-8'>
      {!!label && <label>{label}</label>}
      <input
        placeholder={placeholder}
        className={`w-full  border border-solid border-gray-300 rounded ${sizeStyling[size]}`}
        onChange={onChange}
        value={value}
      />
      {!!error && <span>{error}</span>}
    </div>
  )
}
