import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CreateAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import { updateFirstLogin } from '../../store/slices/UserSlice'
import { FaRegArrowAltCircleLeft } from 'react-icons/fa'

const CategoryPicker = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const user = useSelector((state) => state.Auth.login?.currentUser)
  const dispatch = useDispatch()
  let axiosJWT = CreateAxios(user, dispatch, loginSuccess)
  const accessToken_daniel = user?.data?.AccessToken

  // Function để xử lý việc chọn một danh mục
  const handleCategorySelect = (categoryIndex) => {
    if (selectedCategories.includes(categoryIndex)) {
      // Nếu danh mục đã được chọn, loại bỏ nó khỏi danh sách
      setSelectedCategories(selectedCategories.filter((index) => index !== categoryIndex))
    } else {
      // Nếu danh mục chưa được chọn, thêm nó vào danh sách
      setSelectedCategories([...selectedCategories, categoryIndex])
    }
  }

  // Function để cập nhật thông tin người dùng sau khi chọn danh mục
  const updateUserCategory = async () => {
    try {
      // Gửi mảng các chỉ mục của các danh mục đã chọn đến API để cập nhật thông tin người dùng
      const res = await axiosJWT.put(
        `${process.env.REACT_APP_API_URL}/user/update-info`,
        {
          Category: selectedCategories,
          FirstLogin: 'false'
        },
        {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        }
      )
      if (res.data.statusCode === 200) {
        dispatch(updateFirstLogin(false))
        toast.success('Cập nhật chủ đề quan tâm thành công!')
        navigate('/')
      }
    } catch (error) {
      toast.error('Cập nhật chủ đề quan tâm thất bại')
    }
  }

  useEffect(() => {
    try {
      const getCategories = async () => {
        const resData = await axiosJWT.get(
          `${process.env.REACT_APP_API_URL}/category/get-all-categories?pageIndex=1&pageSize=100`,
          {
            headers: { authorization: `Bearer ${accessToken_daniel}` }
          }
        )
        console.log(resData.data.data)
        setCategories(resData.data.data)
      }
      getCategories()
    } catch (error) {
      console.error('Failed to get categories:', error.message)
    }
  }, [])

  const handleGoBack = () => {
    navigate(-1)
  }

  // Lấy đường dẫn hiện tại
  const location = useLocation()
  const isReChooseCategoryPage = location.pathname === '/settings/category'

  return (
    <div className='w-4/5 md:w-3/5 mx-auto text-white font-inter'>
      <h2 className='text-center mt-10 mb-2'>Cá nhân hoá bảng tin nhà của bạn</h2>
      <p className='text-xl mb-10 text-center'>Chọn những mục bạn quan tâm để Pinspired đề xuất bảng tin cho bạn.</p>
      {isReChooseCategoryPage && (
        <div className='absolute go-back top-28 left-8 max-sm:hidden'>
          <button className='left-arrow rounded-full hover:bg-hover_dark p-2 transition' onClick={handleGoBack}>
            <FaRegArrowAltCircleLeft size='2rem' />
          </button>
        </div>
      )}
      <div className='flex flex-wrap gap-4'>
        {categories.map((category, i) => {
          return (
            <button
              key={i}
              // Sử dụng hàm xử lý chọn danh mục khi người dùng nhấp vào nút
              onClick={() => handleCategorySelect(category.Index)}
              // Thêm className 'active' nếu danh mục đã được chọn
              className={selectedCategories.includes(category.Index) ? 'btn-chosen' : 'btn-category'}
            >
              {category.Name}
            </button>
          )
        })}
      </div>
      <div className='flex justify-center gap-4 mt-10'>
        {/* Button để cập nhật thông tin người dùng sau khi chọn danh mục */}
        <button
          className='btn-pink bg-pink-100 hover:bg-pink-200 text-pink-600 border border-pink-200 rounded-full text-base py-3 px-6'
          onClick={updateUserCategory}
        >
          Bỏ qua
        </button>
        <button
          className='btn-pink bg-pink-600 hover:bg-pink-700 rounded-full text-base py-3 px-6'
          onClick={updateUserCategory}
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  )
}

export default CategoryPicker
