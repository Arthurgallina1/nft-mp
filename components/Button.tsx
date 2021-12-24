import React from 'react'

type ButtonType = {
  children: React.ReactChild
  onClick: () => void
  disabled?: boolean
}

export default function Button({
  onClick,
  disabled = false,
  children,
}: ButtonType) {
  return (
    <button
      className='font-bold mt-4 rounded bg-blue-900 text-white px-4 py-2 shadow-lg disabled:bg-gray-300'
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
