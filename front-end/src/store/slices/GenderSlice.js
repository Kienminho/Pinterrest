// redux/slices/genderSlice.js

import { createSlice } from '@reduxjs/toolkit'

const GenderSlice = createSlice({
  name: 'Gender',
  initialState: {
    selectGender: ''
  },
  reducers: {
    setGender: (state, action) => {
      state.selectGender = action.payload
    }
  }
})

export const { setGender } = GenderSlice.actions
export const selectGender = (state) => state.Gender.selectGender
export default GenderSlice.reducer
