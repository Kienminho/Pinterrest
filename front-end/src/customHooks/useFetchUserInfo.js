import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateState } from '../store/slices/UserSlice'
import { getUserByEmail } from '../store/apiRequest'
import { CreateAxios } from '../createInstance'
import { loginSuccess } from '../store/slices/AuthSlice'

export const useFetchUserInfo = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.Auth.login?.currentUser)
  const userEmail = user?.data?.Email
  const accessToken_daniel = user?.data?.AccessToken
  let axiosJWT = CreateAxios(user, dispatch, loginSuccess)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserByEmail(userEmail, accessToken_daniel, axiosJWT)
        if (userData.statusCode === 200) {
          // Lọc dữ liệu trước khi dispatch action
          const filteredData = {
            _id: userData.data._id,
            UserName: userData.data.UserName,
            Email: userData.data.Email,
            Gender: userData.data.Gender,
            Role: userData.data.Role,
            Avatar: userData.data.Avatar,
            FullName: userData.data.FullName,
            FirstLogin: userData.data.FirstLogin
          }
          dispatch(updateState(filteredData))
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [dispatch])
}
