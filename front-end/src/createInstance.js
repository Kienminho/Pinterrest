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

export const createAxios = (user, dispatch, stateSucess) => {
  const newInstance = axios.create()

  newInstance.interceptors.request.use(
    async (config) => {
      // check accessToken expired
      const decodedToken = jwtDecode(user?.data.AccessToken)
      if (decodedToken.exp <= decodedToken.iat) {
        const data = await callRefreshToken(user)
        if (data) {
          const refreshUser = {
            ...user.data,
            AccessToken: data.data.AccessToken
          }
          dispatch(stateSucess(refreshUser))
          config.headers['authorization'] = 'Bearer ' + data.data.AccessToken
        } else {
          dispatch(logoutSuccess())
          dispatch(resetState)
          // navigate('/login')
        }
      }
      return config
    },
    (err) => Promise.reject(err)
  )
  return newInstance
}
