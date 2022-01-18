import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.counter += action.payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = storeSlice.actions
export default storeSlice.reducer

export const incrementAsync = (amount: number) => (dispatch: any) => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount))
  }, 1000)
}
