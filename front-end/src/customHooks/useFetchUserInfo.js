import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateState } from '../store/slices/UserSlice'
import { getUserByEmail } from '../store/apiRequest'
import { createAxios } from '../createInstance'
import { loginSuccess } from '../store/slices/AuthSlice'

export const useFetchUserInfo = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.Auth.login?.currentUser)
  const userEmail = user.data.Email
  const accessToken_daniel = user?.data?.AccessToken
  let axiosJWT = createAxios(user, dispatch, loginSuccess)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserByEmail(userEmail, accessToken_daniel, axiosJWT)

        console.log('useFetchUserInfo', userData.data)
        if (userData.data) {
          dispatch(updateState(userData.data))
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [dispatch])
}
