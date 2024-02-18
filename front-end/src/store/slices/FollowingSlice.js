// redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit'

const FollowingSlice = createSlice({
  name: 'Following',
  initialState: {
    isFollowing: false
  },
  reducers: {
    setFollowingStatus: (state, action) => {
      state.isFollowing = action.payload
    },
    resetFollowingStatus: (state) => {
      state.isFollowing = false // Đặt lại trạng thái về false khi reset
    }
  }
})

export const { setFollowingStatus, resetFollowingStatus } = FollowingSlice.actions
export default FollowingSlice.reducer
