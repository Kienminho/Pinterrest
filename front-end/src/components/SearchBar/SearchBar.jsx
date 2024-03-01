import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { createAxios } from '../../createInstance'
import { useDispatch, useSelector } from 'react-redux'
import { loginSuccess } from '../../store/slices/AuthSlice'

export const SearchBar = ({ setResults }) => {
  const user = useSelector((state) => state.Auth.login?.currentUser)
  const dispatch = useDispatch()
  let axiosJWT = createAxios(user, dispatch, loginSuccess)
  const accessToken_daniel = user?.data?.AccessToken
  const [input, setInput] = useState('')

  const fetchDataAxios = async (value) => {
    try {
      const res = await axiosJWT.get(
        `${process.env.REACT_APP_API_URL}/user/search?keyword=${value}&pageSize=50&pageIndex=1`,
        {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        }
      )
      console.log(res.data.data)
      const results = res.data.data
      setResults(results)
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error)
    }
  }

  const handleChange = (value) => {
    setInput(value)
    fetchDataAxios(value)
  }

  return (
    <div className='input-wrapper w-full h-10 shadow-[0px_0px_8px_#ddd] bg-white flex items-center px-4 py-0 rounded-xl border-none'>
      <FaSearch id='search-icon' color='blue' />
      <input
        className='bg-transparent h-full text-lg w-full ml-4 border-none focus:outline-none'
        placeholder='Tìm kiếm người dùng...'
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  )
}
