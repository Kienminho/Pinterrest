import { useEffect, useRef, useState } from 'react'
import FormWrapper from '../../components/FormLayout/FormWrapper'
import InputField from '../../components/Input/InputField'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import logo from '../../components/Nav/PLogo_circle.png'
import { loginUser } from '../../store/apiRequest'
import { Alert, Spin } from 'antd'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { loginSuccess } from '../../store/slices/AuthSlice'
import toast from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const inputRef = useRef()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hideError, setHideError] = useState(false)

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('Google login successful:', tokenResponse)
      handleLoginGoogle(tokenResponse.access_token)
    },
    onFailure: (error) => {
      console.error('Google login failed:', error)
      // Handle login failure (optional: display error message to user)
    }
  })

  useEffect(() => {
    return inputRef?.current?.focus()
  }, [error])

  const [formData, setFormData] = useState({
    Email: '',
    Password: ''
  })

  const handleLogin = async (e) => {
    const newUser = {
      Email: formData.Email,
      Password: formData.Password
    }
    try {
      setLoading(true)
      await loginUser(newUser, dispatch, navigate)
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const handleLoginGoogle = async (accessToken) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/get-info-google`, { token: accessToken })
      if (res.data.statusCode === 200) {
        dispatch(loginSuccess(res.data))
        toast.success('Đăng nhập thành công')
        navigate('/')
      } else {
        toast.error('Đăng nhập thất bại')
      }
      return res.data
    } catch (error) {
      console.error('API request failed:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))

    // Khi người dùng bắt đầu nhập lại thông tin, ẩn thông báo lỗi
    if (hideError) {
      setError('')
      setHideError(false)
    }
  }

  return (
    <>
      {loading && (
        <div className='flex items-center justify-center absolute inset-0 z-50 bg-black bg-opacity-70'>
          <Spin size='large' />
        </div>
      )}
      <FormWrapper loading={loading}>
        <div className='flex flex-col items-center font-inter text-white'>
          <div className='logo aspect-square w-12 mb-3 '>
            <img src={logo} className='rounded-full' alt='Pinspired' />
          </div>
          <div className='items-center block justify-center text-center px-4;'>
            <h3 className='text-white tracking-normal leading-tight'>Chào mừng bạn trở lại với Pinspired</h3>
          </div>
          <div className='block items-center justify-center mt-1'>
            <p className='text-center text-zinc-300 font-normal'>Tiếp tục khám phá những ý tưởng</p>
          </div>

          <div className='md:w-[300px] lg:w-[360px] mt-6 flex flex-col gap-3'>
            <div className='relative'>
              <InputField
                ref={inputRef}
                label={'Email'}
                type='email'
                name={'Email'}
                id={'user-email'}
                placeholder='Email'
                handleChange={handleChange}
              />
            </div>
            <div className='relative'>
              <InputField
                label={'Mật khẩu'}
                type='password'
                name={'Password'}
                id={'user-pass'}
                placeholder='Nhập mật khẩu'
                handleChange={handleChange}
              />
            </div>
            {/* Hiển thị thông báo lỗi nếu có */}
            {error && (
              <div className='w-full mt-1'>
                <Alert message={error} type='error' showIcon />
              </div>
            )}
            <div className='flex justify-end'>
              <label className='no-underline font-medium text-base text-blue-500 hover:underline hover:text-blue-600'>
                <NavLink
                  to='/forgot-password'
                  // text-[#818cf8]
                >
                  Quên mật khẩu?
                </NavLink>
              </label>
            </div>

            <div className='flex justify-center mt-3'>
              <button
                className='text-white bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:ring-pink-300 font-medium rounded-3xl text-base p-3 text-decoration-none w-80 text-center mt-2 transition duration-300 ease-in-out'
                onClick={() => {
                  handleLogin()
                  setHideError(true)
                }}
              >
                Đăng nhập
              </button>
            </div>
            <div class='my-2 grid grid-cols-3 items-center text-gray-400'>
              <hr class='border-gray-400' />
              <p class='text-center text-sm text-gray-300'>HOẶC</p>
              <hr class='border-gray-400' />
            </div>
            <div className='flex justify-center'>
              <button
                className='bg-[#e9e9e9] border border-blue-400 py-2.5 mt-2 flex justify-center items-center text-dark_color hover:bg-[#d6d6d6] focus:ring-4 focus:ring-blue-200 font-medium rounded-3xl text-base px-2 text-decoration-none w-80 text-center transition duration-300 ease-in-out'
                onClick={login}
              >
                <svg class='mr-3' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' width='25px'>
                  <path
                    fill='#FFC107'
                    d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
                  />
                  <path
                    fill='#FF3D00'
                    d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
                  />
                  <path
                    fill='#4CAF50'
                    d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
                  />
                  <path
                    fill='#1976D2'
                    d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
                  />
                </svg>
                Tiếp tục truy cập Google
              </button>
            </div>

            <div className='mt-4 w-80 mx-auto text-center'>
              <p className='font-normal text-zinc-300'>
                Bằng cách tiếp tục, bạn đồng ý với{' '}
                <NavLink to='/terms-of-service' className='font-normal text-blue-500 no-underline hover:underline'>
                  <span className='font-bold'>Điều khoản và Chính sách</span>
                </NavLink>{' '}
                của chúng tôi.
              </p>
              <div className='border-b border-gray-400 mt-2'></div>
              <p className='font-normal text-zinc-300 mt-2 '>
                Bạn chưa có tài khoản?{' '}
                <NavLink
                  to='/register'
                  className='font-medium text-blue-500 no-underline hover:underline hover:text-blue-600'
                >
                  Đăng ký ngay
                </NavLink>
              </p>
            </div>
          </div>
        </div>

        {/* Form input section */}
      </FormWrapper>
    </>
  )
}

export default Login
