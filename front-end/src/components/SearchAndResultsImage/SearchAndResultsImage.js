import { useState, useEffect, useRef } from 'react'
import { FaSearch, FaTimesCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { CreateAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export const SearchAndResultsImage = () => {
  const dispatch = useDispatch()
  const userInitial = useSelector((state) => state.Auth.login?.currentUser)
  let axiosJWT = CreateAxios(userInitial, dispatch, loginSuccess)
  const accessToken_daniel = userInitial?.data?.AccessToken
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [loading, setLoading] = useState(false)

  const fetchFilteredPost = async (value) => {
    try {
      setLoading(true)
      const res = await axiosJWT.get(
        `${process.env.REACT_APP_API_URL}/post/search?keyword=${value}&pageSize=50&pageIndex=1`,
        {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        }
      )
      if (res.data.statusCode === 200) {
        const resData = res.data.data
        setResults(resData)
        setLoading(false)
        return resData
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error)
    }
  }

  const fetchFilteredPostWithShow = async (value) => {
    try {
      const res = await axiosJWT.get(
        `${process.env.REACT_APP_API_URL}/post/search?keyword=${value}&pageSize=50&pageIndex=1`,
        {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        }
      )
      const resData = res.data.data
      setResults(resData)
      setShowResults(true)
      return resData
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error)
    }
  }

  const handleChange = (value) => {
    setInput(value)
    fetchFilteredPostWithShow(value)
  }

  const handleSearch = async () => {
    if (input.trim() === '') {
      toast.error('Vui lòng nhập từ khoá tìm kiếm')
      return
    }
    const res = await fetchFilteredPost(input)
    navigate('/explore', { state: { searchResults: res, loading: loading } })
    setShowResults(false)
  }

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowResults(false)
      setInput('')
    }
  }

  const handleSelectPost = (postId) => {
    setShowResults(false)
    setInput('')
    navigate(`/pin/${postId}`)
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

  return (
    <div className='search-and-results-container' ref={searchRef}>
      <div className='input-wrapper w-full h-12 bg-[#e9e9e9] hover:bg-[#d8d8d8] transition duration-300 flex items-center px-4 py-0 rounded-full border-none'>
        <FaSearch id='search-icon' color='grey' />
        <input
          ref={inputRef}
          className='bg-transparent h-full text-base w-full ml-4 border-none focus:outline-none placeholder:text-[15px]'
          placeholder='Tìm kiếm bài viết...'
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
        />
        {input && ( // Hiển thị nút xoá input chỉ khi input không trống
          <button className='focus:outline-none hover:bg-zinc-200 rounded-full p-2' onClick={handleClearInput}>
            <FaTimesCircle />
          </button>
        )}
        <button className='ml-2 focus:outline-none hover:bg-zinc-200 rounded-full p-2.5' onClick={handleSearch}>
          <FaSearch />
        </button>
      </div>
      {showResults && (
        <div className='results-list w-full md:w-[38%] lg:w-[48%] xl:w-[58%] 2xl:w-[68%] bg-[#ffffff] flex flex-col shadow-xl max-h-[400px] overflow-y-auto mt-4 rounded-lg absolute top-[14%] md:top-[63px] z-50'>
          {results.map((result, id) => (
            <div
              key={id}
              className='search-result py-3 px-3 hover:bg-[#efefef] flex items-center cursor-pointer gap-2'
              onClick={() => handleSelectPost(result._id)}
            >
              <img src={result.Attachment.Thumbnail} className='h-7 w-7 sm:h-9 sm:w-9 rounded-full' alt='avatar' />
              <div className='flex flex-col'>
                <span className='text-sm font-medium'>{result.Title}</span>
                {/* <span className='text-xs text-gray-500'>{result.Description}</span> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
