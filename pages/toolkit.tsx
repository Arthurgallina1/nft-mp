import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../data/store'
import { decrement, increment, incrementAsync } from '../data/store/slices'

export default function Toolkit() {
  const dispatch = useDispatch()
  const store = useSelector((state: RootState) => state.storeReducer)
  const { counter } = store

  return (
    <div className='flex flex-col justify-center'>
      <button
        aria-label='Increment value'
        onClick={() => dispatch(increment())}
      >
        Increment
      </button>
      <span className='text-center'>{counter}</span>
      <button
        aria-label='Decrement value'
        onClick={() => dispatch(decrement())}
      >
        Decrement
      </button>
      <button onClick={() => dispatch(incrementAsync(Number(8) || 0))}>
        Add Async
      </button>
    </div>
  )
}
