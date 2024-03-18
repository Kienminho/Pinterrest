import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { logoutSuccess } from './store/slices/AuthSlice'
import { resetState } from './store/slices/UserSlice'
import { useNavigate } from 'react-router-dom'

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

export const CreateAxios = (user, dispatch, stateSuccess) => {
  const newInstance = axios.create()
  const navigate = useNavigate()

  newInstance.interceptors.request.use(
    async (config) => {
      const decodedToken = jwtDecode(user?.data?.AccessToken)
      const timeNow = Math.floor(Date.now() / 1000)
      if (timeNow < decodedToken.exp) {
        // Handle token refresh failure
        console.log('accessToken chưa hết hạn')
      } else {
        console.log('accessToken hết hạn')
        navigate('/login')
        dispatch(logoutSuccess())
        dispatch(resetState())
      }
      return config
    },
    (err) => Promise.reject(err)
  )

  return newInstance
}
