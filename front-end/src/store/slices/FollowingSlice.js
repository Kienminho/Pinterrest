import { createSlice } from '@reduxjs/toolkit'

const FollowingSlice = createSlice({
  name: 'Following',
  initialState: {
    followingList: ['65fbf2a230c32a5bf74c78d3'] // Mảng chứa ID của các post đã được theo dõi
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
