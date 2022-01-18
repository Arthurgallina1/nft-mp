import { createSlice } from '@reduxjs/toolkit'

export const storeSlice = createSlice({
  name: 'rootSlice',
  initialState: {
    counter: 0,
  },
  reducers: {
    increment(state) {
      state.counter += 1
    },

    decrement(state) {
      state.counter -= 1
    },
  },
})

export const { increment, decrement } = storeSlice.actions
export default storeSlice.reducer
