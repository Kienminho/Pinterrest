import { createSlice } from '@reduxjs/toolkit'

const FollowingSlice = createSlice({
  name: 'Following',
  initialState: {
    followingList: [] // Mảng chứa ID của các post đã được theo dõi
  },
  reducers: {
    followUser: (state, action) => {
      return {
        ...state,
        followingList: [...state.followingList, action.payload]
      }
    },
    unfollowUser: (state, action) => {
      return {
        ...state,
        followingList: state.followingList.filter((id) => id !== action.payload)
      }
    },
    resetFollowing: (state) => {
      return {
        ...state,
        followingList: []
      }
    }
  }
})

export const { followUser, unfollowUser, resetFollowing } = FollowingSlice.actions

export default FollowingSlice.reducer
