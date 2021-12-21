import React from 'react'

type InputImageType = {
  name: string
  onChange: (e: any) => void
}

export default function InputImage({ name, onChange }: InputImageType) {
  return (
    <div className='w-full my-8'>
      <label
        htmlFor={name}
        className='rounded p-4 bg-blue-900 cursor-pointer text-white'
      >
        Upload Image
      </label>
      <input
        type='file'
        name={name}
        id={name}
        className='invisible'
        onChange={onChange}
      />
    </div>
  )
}
