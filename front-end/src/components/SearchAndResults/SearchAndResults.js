import { useState, useEffect, useRef } from 'react'
import { FaSearch, FaTimesCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { CreateAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'
import { createConversation } from '../../store/apiRequest'
import toast from 'react-hot-toast'

export const SearchAndResults = ({ onConversationCreated, conversations, fetchMessages }) => {
  const userReal = useSelector((state) => state.User)
  const dispatch = useDispatch()
  const userInitial = useSelector((state) => state.Auth.login?.currentUser)
  let axiosJWT = CreateAxios(userInitial, dispatch, loginSuccess)
  const accessToken_daniel = userInitial?.data?.AccessToken
  const user = useSelector((state) => state.User)
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef(null)
  const inputRef = useRef(null)
  const timerRef = useRef(null)

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

  const delayedSearch = (value) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      fetchDataUser(value)
    }, 400) // Đợi 0.5 giây trước khi gọi hàm tìm kiếm
  }

  const handleChange = (value) => {
    setInput(value)
    // fetchDataUser(value)
    delayedSearch(value)
  }

  const processedExistingConversations = (existingConversation) => {
    // Sử dụng hàm Array.map() để biến đổi mỗi phần tử trong mảng
    return existingConversation.map(({ _id, members }) => {
      const receiverIndex = members.findIndex((member) => member._id !== userReal._id)
      const receiver = receiverIndex !== -1 ? members[receiverIndex] : null
      return {
        conversationId: _id,
        receiver
      }
    })
  }

  const handleCreateConversation = async (senderId, receiverId) => {
    try {
      // Kiểm tra xem đã có cuộc trò chuyện giữa hai người này hay chưa
      const existingConversation = [
        conversations.find(
          (conv) =>
            conv.members.some((member) => member._id === senderId) &&
            conv.members.some((member) => member._id === receiverId)
        )
      ]

      if (!existingConversation.includes(undefined)) {
        const ketqua = processedExistingConversations(existingConversation)
        await fetchMessages(ketqua[0].conversationId, accessToken_daniel, axiosJWT, ketqua[0].receiver)
        setShowResults(false)
        toast.success('Cuộc trò chuyện đã tồn tại!')
      } else {
        // Nếu chưa có, tạo cuộc trò chuyện mới
        const res = await createConversation(senderId, receiverId, accessToken_daniel, axiosJWT)
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

  const handleClearInput = () => {
    setInput('') // Xoá nội dung của input
    setResults([]) // Xoá kết quả tìm kiếm
    setShowResults(false) // Ẩn kết quả tìm kiếm
    inputRef.current.focus()
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    // Kiểm tra xem danh sách cuộc trò chuyện có thay đổi không
    // console.log('conversations: ', conversations.length)
    // console.log('cloneConversations: ', cloneConversations)
    if (conversations.length > 0) {
      // Lấy thông tin của cuộc trò chuyện mới nhất
      const latestConversation = conversations[conversations.length - 1]
      const lastestVer2 = processedExistingConversations([latestConversation])
      // Gọi hàm fetchMessages để lấy tin nhắn cho cuộc trò chuyện mới tạo
      fetchMessages(lastestVer2[0]?.conversationId, accessToken_daniel, axiosJWT, lastestVer2[0]?.receiver)
    }
  }, [conversations])

  return (
    <div className='search-and-results-container' ref={searchRef}>
      <div className='input-wrapper w-full h-12 drop-shadow bg-[#334155] flex items-center px-4 py-0 rounded-xl text-[#ffffff]'>
        <FaSearch id='search-icon' color='white' size='1.3rem' />
        <input
          className='bg-transparent h-full text-base w-full ml-4 border-none focus:outline-none placeholder:text-[#ffffff]'
          placeholder='Tìm kiếm người dùng...'
          value={input}
          onChange={(e) => handleChange(e.target.value)}
        />
        {input && (
          <button className='focus:outline-none hover:bg-[#626d7b] rounded-full p-2' onClick={handleClearInput}>
            <FaTimesCircle />
          </button>
        )}
      </div>
      {showResults && (
        <div className='results-list w-full bg-[#313e50] flex flex-col shadow-[0_3px_10px_rgb(0,0,0,0.2)] max-h-[300px] overflow-y-auto mt-2 rounded-lg text-white'>
          {results.map((result, id) => (
            <div
              key={id}
              className='search-result px-5 py-2.5 hover:bg-[#3f4c5d] flex items-center cursor-pointer gap-2'
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
