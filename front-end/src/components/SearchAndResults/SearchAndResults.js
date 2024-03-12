import { useState, useEffect, useRef } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { createAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'
import { createConversation } from '../../store/apiRequest'
import toast from 'react-hot-toast'

export const SearchAndResults = ({ onConversationCreated, conversations }) => {
  const dispatch = useDispatch()
  const userInitial = useSelector((state) => state.Auth.login?.currentUser)
  let axiosJWT = createAxios(userInitial, dispatch, loginSuccess)
  const accessToken_daniel = userInitial?.data?.AccessToken
  const user = useSelector((state) => state.User)
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef(null)

  const fetchDataUser = async (value) => {
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
      setShowResults(true)
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error)
    }
  }

  const handleChange = (value) => {
    setInput(value)
    fetchDataUser(value)
  }

  const handleCreateConversation = async (senderId, receiverId) => {
    try {
      // Kiểm tra xem đã có cuộc trò chuyện giữa hai người này hay chưa
      const existingConversation = conversations.find(
        (conv) =>
          conv.members.some((member) => member.userId === senderId) &&
          conv.members.some((member) => member.userId === receiverId)
      )

      // Nếu đã có cuộc trò chuyện, mở cuộc trò chuyện đã tồn tại
      if (existingConversation) {
        toast.error('Cuộc trò chuyện đã tồn tại!')
      } else {
        // Nếu chưa có, tạo cuộc trò chuyện mới
        const res = await createConversation(senderId, receiverId, accessToken_daniel, axiosJWT)
        console.log(res)
        if (res.statusCode === 200) {
          toast.success('Tạo cuộc trò truyện thành công')
          setInput('')
          setShowResults(false)
          // Gọi hàm callback khi cuộc trò chuyện được tạo thành công
          if (onConversationCreated) {
            onConversationCreated()
          }
        } else {
          toast.error('Tạo cuộc trò truyện thất bại')
        }
      }
    } catch (error) {
      console.error('Lỗi khi tạo cuộc trò chuyện:', error)
      toast.error('Đã xảy ra lỗi khi tạo cuộc trò chuyện')
    }
  }

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowResults(false)
      setInput('')
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div className='search-and-results-container' ref={searchRef}>
      <div className='input-wrapper w-full h-12 drop-shadow bg-white flex items-center px-4 py-0 rounded-xl border-none'>
        <FaSearch id='search-icon' color='grey' />
        <input
          className='bg-transparent h-full text-base w-full ml-4 border-none focus:outline-none'
          placeholder='Tìm kiếm người dùng...'
          value={input}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      {showResults && (
        <div className='results-list w-full bg-white flex flex-col shadow-[0px_0px_8px_#ddd] max-h-[300px] overflow-y-auto mt-4 rounded-lg'>
          {results.map((result, id) => (
            <div
              key={id}
              className='search-result px-5 py-2.5 hover:bg-[#efefef] flex items-center cursor-pointer gap-2'
              onClick={() => handleCreateConversation(user?._id, result._id)}
            >
              <img src={result.Avatar} className='h-6 w-6 sm:h-9 sm:w-9 rounded-full' alt='avatar' />
              {result.UserName}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
