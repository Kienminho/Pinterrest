import { configureStore } from '@reduxjs/toolkit'
import AuthSlice from './slices/AuthSlice'
import TokenSlice from './slices/TokenSlice'

const store = configureStore({
  reducer: {
    Auth: AuthSlice,
    Token: TokenSlice
  }
})

export default store
