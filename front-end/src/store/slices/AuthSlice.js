import { createSlice } from '@reduxjs/toolkit'

const AuthSlice = createSlice({
  name: 'Auth',
  initialState: {
    register: {
      isFetching: false,
      success: false,
      error: false
    },
    login: {
      currentUser: null,
      isFetching: false,
      error: false
    },
    changePass: {
      isFetching: false,
      data: null,
      success: false,
      error: false
    }
  },
  reducers: {
    loginStart: (state) => {
      state.login.isFetching = true
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false
      state.login.currentUser = action.payload
      state.login.error = false
    },
    loginFailed: (state) => {
      state.login.isFetching = false
      state.login.error = true
    },
    logoutStart: (state) => {
      state.login.isFetching = true
    },
    logoutSuccess: (state) => {
      state.login.isFetching = false
      state.login.currentUser = null
      state.login.error = false
    },
    logoutFailed: (state) => {
      state.login.isFetching = false
      state.login.error = true
    },
    registerStart: (state) => {
      state.register.isFetching = true
    },
    registerSuccess: (state) => {
      state.register.isFetching = false
      state.register.error = false
      state.register.success = true
    },
    registerFailed: (state) => {
      state.register.isFetching = false
      state.register.error = true
      state.register.success = false
    },
    changePassStart: (state) => {
      state.changePass.isFetching = true
    },
    changePassSuccess: (state, action) => {
      state.changePass.isFetching = false
      state.changePass.error = false
      state.changePass.data = action.payload ? action.payload.data : null
    },
    changePassFailed: (state) => {
      state.changePass.isFetching = false
      state.changePass.success = false
    }
  }
})

export const {
  loginStart,
  loginSuccess,
  loginFailed,
  registerStart,
  registerSuccess,
  registerFailed,
  logoutStart,
  logoutSuccess,
  logoutFailed,
  changePassStart,
  changePassSuccess,
  changePassFailed
} = AuthSlice.actions

export default AuthSlice.reducer
