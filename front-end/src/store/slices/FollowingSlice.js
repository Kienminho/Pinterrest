// // redux/slices/authSlice.js
// import { createSlice } from '@reduxjs/toolkit'

// const FollowingSlice = createSlice({
//   name: 'Following',
//   initialState: {
//     isFollowing: false
//   },
//   reducers: {
//     setFollowingStatus: (state, action) => {
//       state.isFollowing = action.payload
//     },
//     resetFollowingStatus: (state) => {
//       state.isFollowing = false // Đặt lại trạng thái về false khi reset
//     }
//   }
// })

// export const { setFollowingStatus, resetFollowingStatus } = FollowingSlice.actions
// export default FollowingSlice.reducer

import { createSlice } from '@reduxjs/toolkit'

const FollowingSlice = createSlice({
  name: 'Following',
  initialState: {
    followingList: [] // Mảng chứa ID của các post đã được theo dõi
  },
  reducers: {
    followUser: (state, action) => {
      // Thêm ID của user đã theo dõi vào mảng followingList
      return {
        ...state,
        followingList: [...state.followingList, action.payload] // Thêm giá trị mới vào mảng followingList
      }
    },
    unfollowUser: (state, action) => {
      // Loại bỏ ID của user đã theo dõi khỏi mảng followingList
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
