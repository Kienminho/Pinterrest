import { createSlice } from '@reduxjs/toolkit'

const UserSliceChuabiet = createSlice({
  name: 'User',
  initialState: {
    users: {
      allUsers: null,
      isFetching: false,
      error: false
    }
  },
  reducers: {
    getUsersStart: (state) => {
      state.users.isFetching = true
    },
    getUsersSuccess: (state, action) => {
      state.users.isFetching = false
      state.users.allUsers = action.payload
      state.users.error = false
    },
    getUsersFailed: (state) => {
      state.login.isFetching = false
      state.login.error = true
    }
  }
})

export const { getUsersStart, getUsersSuccess, getUsersFailed } = UserSliceChuabiet.actions

export default UserSliceChuabiet.reducer
