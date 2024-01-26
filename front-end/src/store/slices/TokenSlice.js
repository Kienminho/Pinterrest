import { createSlice } from '@reduxjs/toolkit'

const TokenSlice = createSlice({
  name: 'accesstoken',
  initialState: {
    accessToken: null
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload
    },
    clearAccessToken: (state) => {
      state.accessToken = null
    }
  }
})

export const { setAccessToken, clearAccessToken } = TokenSlice.actions
export const selectAccessToken = (state) => state.Token.accessToken
export default TokenSlice.reducer
