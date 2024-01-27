import axios from 'axios'
import {
  changePassStart,
  changePassSuccess,
  changePassFailed,
  loginFailed,
  loginStart,
  loginSuccess,
  logoutFailed,
  logoutStart,
  logoutSuccess,
  registerFailed,
  registerStart,
  registerSuccess
} from './slices/AuthSlice'

import { getUsersFailed, getUsersStart, getUsersSuccess } from './slices/UserSlice'
import toast, { Toaster } from 'react-hot-toast'

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart())

  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/login`, user)
    dispatch(loginSuccess(res.data))
    toast.success('Đăng nhập thành công')
    navigate('/')
  } catch (error) {
    let errorMessage = 'Lỗi không xác định khi đăng nhập'
    toast.error('Đăng nhập thất bại')

    // Nếu có dữ liệu phản hồi từ server
    if (error.response && error.response.data) {
      const { statusCode, message } = error.response.data
      console.error(`Mã lỗi ${statusCode}: ${message}`)
      errorMessage = `${message}`
    } else {
      // Xử lý các trường hợp lỗi khác tùy theo cần thiết
      console.error('Lỗi không xác định khi đăng nhập:', error.message)
    }

    dispatch(loginFailed())
    throw new Error(errorMessage)
  }
}

export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart())

  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/register`, user)
    dispatch(registerSuccess(res.data))
    toast.success('Đăng ký thành công')
    navigate('/login')
  } catch (error) {
    let errorMessage = 'Lỗi không xác định khi đăng ký'
    toast.error('Đăng ký không thành công')
    if (error.response && error.response.data) {
      const { statusCode, message } = error.response.data
      // Xử lý thông báo lỗi từ phản hồi khi đăng ký thất bại
      console.error(`Mã lỗi ${statusCode}: ${message}`)
      dispatch(registerFailed())
      errorMessage = `${message}`
    } else {
      // Xử lý các trường hợp lỗi khác tùy theo cần thiết
      console.error('Lỗi không xác định khi đăng ký:', error.message)
      dispatch(registerFailed())
    }
    throw new Error(errorMessage)
  }
}

export const logoutUser = async (dispatch, navigate, accessToken, axiosJWT) => {
  dispatch(logoutStart())
  try {
    await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/logout`, {
      headers: { authorization: `Bearer ${accessToken}` }
    })
    dispatch(logoutSuccess())
    toast.success('Đăng xuất thành công')
    navigate('/login')
  } catch (error) {
    dispatch(logoutFailed())
    toast.error('Đăng xuất không thành công')
  }
}

export const changePassword = async (email, newPassword, dispatch, navigate) => {
  console.log('toi dc day roi')
  dispatch(loginStart())

  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/forgot-password`, {
      email,
      newPassword
    })
    dispatch(loginSuccess(res.data))
    console.log(res.data)
    toast.success('Đặt lại mật khẩu thành công')
    navigate('/login')
  } catch (error) {
    let errorMessage = 'Lỗi không xác định khi đặt lại mật khẩu'
    toast.error('Đặt lại mật khẩu thất bại')

    // Nếu có dữ liệu phản hồi từ server
    if (error.response && error.response.data) {
      const { statusCode, message } = error.response.data
      console.error(`Mã lỗi ${statusCode}: ${message}`)
      errorMessage = `${message}`
    } else {
      // Xử lý các trường hợp lỗi khác tùy theo cần thiết
      console.error('Lỗi không xác định khi đặt lại mật khẩu:', error.message)
    }

    dispatch(loginFailed())
    throw new Error(errorMessage)
  }
}

export const getAllUsers = async (accessToken, dispatch) => {
  dispatch(getUsersStart())
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/all`, {
      headers: { authorization: `Bearer ${accessToken}` }
    })
    dispatch(getUsersSuccess(res.data))
  } catch (error) {
    dispatch(getUsersFailed())
  }
}
