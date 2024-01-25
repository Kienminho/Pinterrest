import { useEffect, useRef, useState } from 'react'
import FormWrapper from '../../components/FormLayout/FormWrapper'
import InputField from '../../components/Input/InputField'
import { FaFacebook, FaGoogle, FaPinterest } from 'react-icons/fa6'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../../store/slices/AuthSlice'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Login = () => {
  const navigate = useNavigate()
  const inputRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    return inputRef.current.focus()
  }, [])

  const [formData, setFormData] = useState({
    Email: '',
    Password: ''
  })

  console.log(formData)

  const formDataObject = {
    Email: formData.Email,
    Password: formData.Password
  }

  const formDataString = JSON.stringify(formDataObject)

  console.log(formDataString)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://api-pinterrest.up.railway.app/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // credentials: "include",
        body: formDataString
      })

      const resJson = await response.json()
      console.log(resJson)

      if (response.status === 400) {
        toast.error(resJson.error)
      }

      if (response.status === 200) {
        console.log('login successful', response.status)
        const access_token = resJson.data.AccessToken
        const refresh_token = resJson.data.RefreshToken

        // Lưu trữ access token và refresh token
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)
        const { Id } = resJson.data

        dispatch(login(Id))
        toast.success('login successful')
        navigate('/')
      } else {
        // Handle server error
        console.log('login failed with status:', resJson)
      }
    } catch (error) {
      console.log('login error: ' + error)
      toast.error('login unsuccessful: something went wrong')
    }
  }

  return (
    <FormWrapper>
      <div className='flex flex-col items-center'>
        <div className='logo aspect-square w-9 mb-3 rounded-full'>
          <FaPinterest size='2.2rem' color='red' />
        </div>
        <h3 className='text-center text-dark_color tracking-normal leading-tight'>Welcome to Pinterest</h3>

        <div className='w-[300px] mt-6 flex flex-col gap-3'>
          <InputField
            ref={inputRef}
            label={'Email'}
            type='email'
            name={'Email'}
            id={'user-email'}
            placeholder='Email'
            handleChange={handleChange}
          />

          <InputField
            label={'Password'}
            type='password'
            name={'Password'}
            id={'user-pass'}
            placeholder='Mật khẩu'
            handleChange={handleChange}
          />

          <label>
            <a
              class='no-underline font-medium text-md text-gray-700 hover:text-blue-500 hover:underline'
              href='forget.com'
            >
              Quên mật khẩu?
            </a>
          </label>
          <div className='flex justify-center'>
            <button
              className='text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 font-medium rounded-3xl text-md px-2 py-2 dark:bg-emerald-600 dark:hover:bg-emerald-700 focus:outline-none dark:focus:ring-emerald-800 text-decoration-none w-64 text-center mt-2'
              onClick={handleSubmit}
            >
              Đăng nhập
            </button>
          </div>
          <div class='flex justify-center text-dark_mode font-bold text-md mb-2'>HOẶC</div>
          <div className='flex justify-center'>
            <button
              className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-3xl text-md px-2 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 text-decoration-none w-64 text-center flex justify-around '
              onClick={handleSubmit}
            >
              <div className='flex justify-center items-center'>
                <FaFacebook size='1.6rem' />
              </div>
              <p className='font-medium'>Tiếp tục với Facebook</p>
            </button>
          </div>
          <div className='flex justify-center'>
            <button
              href='google.com'
              class='text-white bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:ring-rose-300 font-medium rounded-3xl text-md px-2 py-2 dark:bg-rose-600 dark:hover:bg-rose-700 focus:outline-none dark:focus:ring-rose-800 text-decoration-none w-64 text-center flex justify-around'
            >
              <div className='flex justify-center items-center'>
                <FaGoogle size='1.4rem' />
              </div>
              <p className='font-medium'>Tiếp tục truy cập Google</p>
            </button>
          </div>

          <div className='mt-4 w-80 mx-auto text-center'>
            <p class='text-zinc-600  dark:text-zinc-500'>
              Bằng cách tiếp tục, bạn đồng ý với{' '}
              <a href='youtube.com' class='font-medium dec text--600 dark:text-blue-500 no-underline hover:underline'>
                Điều khoản dịch vụ và Chính sách quyền riêng tư
              </a>{' '}
              của chúng tôi.
            </p>
            <p class='text-zinc-600  dark:text-zinc-500 mt-2'>
              Bạn chưa có tài khoản?{' '}
              <NavLink to='/register' class='font-medium dec text--600 dark:text-blue-500 no-underline hover:underline'>
                Đăng ký
              </NavLink>
            </p>
          </div>
        </div>
      </div>

      {/* Form input section */}
    </FormWrapper>
  )
}

export default Login
