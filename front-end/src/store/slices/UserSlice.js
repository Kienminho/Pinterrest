// authSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  _id: '',
  FullName: '',
  UserName: '',
  Email: '',
  Avatar: '',
  Gender: '',
  Role: '',
  FirstLogin: ''
}

const filterPayload = (payload, initialState) => {
  return Object.keys(payload).reduce((acc, key) => {
    if (initialState.hasOwnProperty(key)) {
      acc[key] = payload[key]
    }
    return acc
  }, {})
}
const UserSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    updateState: (state, action) => {
      const filteredPayload = filterPayload(action.payload, initialState)
      return { ...state, ...filteredPayload }
    },
    updateFirstLogin: (state, action) => {
      return {
        ...state,
        FirstLogin: action.payload
      }
    },
    updateStateSavedPosts: (state, action) => {
      return {
        ...state,
        savedPosts: action.payload
      }
    },
    updateStatePosts: (state, action) => {
      return {
        ...state,
        posts: action.payload
      }
    },
    deleteStatePost: (state, action) => {
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== action.payload)
      }
    },

    resetState: () => initialState
  }
})

export const { updateState, updateFirstLogin, updateStateSavedPosts, updateStatePosts, deleteStatePost, resetState } =
  UserSlice.actions

export default UserSlice.reducer
