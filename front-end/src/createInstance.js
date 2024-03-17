import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { logoutSuccess } from './store/slices/AuthSlice'
import { resetState } from './store/slices/UserSlice'

const callRefreshToken = async (user) => {
  const refreshTokenFromRedux = user?.data.RefreshToken
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/refresh-token`,
      { refreshToken: refreshTokenFromRedux },
      { headers: { 'Content-Type': 'application/json' } }
    )
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const createAxios = (user, dispatch, stateSuccess) => {
  const newInstance = axios.create()

  newInstance.interceptors.request.use(
    async (config) => {
      const decodedToken = jwtDecode(user?.data?.AccessToken)
      if (decodedToken.exp <= Math.floor(Date.now() / 1000)) {
        try {
          const data = await callRefreshToken(user)
          if (data && data.data && data.data.AccessToken) {
            const refreshUser = {
              ...user.data,
              AccessToken: data.data.AccessToken
            }
            dispatch(stateSuccess(refreshUser))
            config.headers['Authorization'] = 'Bearer ' + data.data.AccessToken
          } else {
            // Handle token refresh failure
            dispatch(logoutSuccess())
            dispatch(resetState)
            // Redirect to login or handle as needed
          }
        } catch (error) {
          console.error('Failed to refresh token:', error)
          dispatch(logoutSuccess())
          dispatch(resetState)
          // Redirect to login or handle as needed
        }
      }
      return config
    },
    (err) => Promise.reject(err)
  )

  return newInstance
}
