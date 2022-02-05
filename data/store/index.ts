import { configureStore } from '@reduxjs/toolkit'
import storeReducer from './slices'

export const store = configureStore({
  reducer: {
    storeReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// { rootReducer }
export type AppDispatch = typeof store.dispatch
