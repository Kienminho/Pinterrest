import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const callRefreshToken = async (user) => {
  const refreshToken = user?.data.RefreshToken
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/refresh-token`,
      { refreshToken },
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
      let date = new Date()
      const decodedToken = jwtDecode(user?.data.AccessToken)
      if (decodedToken.exp < date.getTime() / 1000) {
        const data = await callRefreshToken(user)
        const refreshUser = {
          ...user.data,
          AccessToken: data.data.AccessToken
        }
        dispatch(stateSucess(refreshUser))
        config.headers['authorization'] = 'Bearer ' + data.data.AccessToken
      }
      return config
    },
    (err) => Promise.reject(err)
  )
  return newInstance
}
