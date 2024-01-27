import { useEffect, useRef, useState } from 'react'
import FormWrapper from '../../components/FormLayout/FormWrapper'
import InputField from '../../components/Input/InputField'
import { FaFacebook, FaGoogle, FaPinterest } from 'react-icons/fa6'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../store/apiRequest'
import { MdEmail } from 'react-icons/md'
import { RiLockPasswordFill } from 'react-icons/ri'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const inputRef = useRef()

  const [error, setError] = useState('')

  useEffect(() => {
    return inputRef.current.focus()
  }, [])

  const [formData, setFormData] = useState({
    Email: '',
    Password: ''
  })

  const formDataObject = {
    Email: formData.Email,
    Password: formData.Password
  }

  const handleLogin = async (e) => {
    const newUser = {
      Email: formData.Email,
      Password: formData.Password
    }
    try {
      await loginUser(newUser, dispatch, navigate)
    } catch (error) {
      console.log(error.message)
      // Hiển thị giá trị lỗi lên giao diện hoặc thực hiện các xử lý khác tùy ý
      setError(error.message)
    }
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

  return (
    <FormWrapper>
      <div className='flex flex-col items-center'>
        <div className='logo aspect-square w-9 mb-3 rounded-full'>
          <FaPinterest size='2.2rem' color='red' />
        </div>
        <h3 className='text-center text-dark_color tracking-normal leading-tight'>Chào mừng bạn đến với Pinterest</h3>

        <div className='w-[360px] mt-6 flex flex-col gap-3'>
          <div className='relative'>
            <div className='absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none'>
              {/* <MdEmail size='1.5rem' color='salmon' /> */}
            </div>
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
            <div className='absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none'>
              {/* <RiLockPasswordFill size='1.5rem' color='salmon' /> */}
            </div>
            <InputField
              label={'Password'}
              type='password'
              name={'Password'}
              id={'user-pass'}
              placeholder='Mật khẩu'
              handleChange={handleChange}
            />
          </div>

          <label>
            <NavLink
              to='/forgot-password'
              className='no-underline font-normal text-sm text-zinc-600 hover:text-blue-500 hover:underline'
            >
              Quên mật khẩu?
            </NavLink>
          </label>

          {/* Hiển thị thông báo lỗi nếu có */}
          {error && (
            <div className='w-[400px] mt-1'>
              <p class='text-sm text-red-600 dark:text-red-500'>
                <span class='font-medium'>Oops!</span> {error}
              </p>
            </div>
          )}

          <div className='flex justify-center'>
            <button
              className='text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 font-medium rounded-3xl text-md px-2 py-2 dark:bg-emerald-600 dark:hover:bg-emerald-700 focus:outline-none dark:focus:ring-emerald-800 text-decoration-none w-80 text-center mt-2'
              onClick={handleLogin}
            >
              Đăng nhập
            </button>
          </div>
          <div class='flex justify-center text-dark_mode font-bold text-md mb-2'>HOẶC</div>
          <div className='flex justify-center'>
            <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-3xl text-md px-2 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 text-decoration-none w-80 text-center flex justify-evenly '>
              <div className='flex justify-center items-center'>
                <FaFacebook size='1.6rem' />
              </div>
              <p className='font-medium'>Tiếp tục với Facebook</p>
            </button>
          </div>
          <div className='flex justify-center'>
            <button class='text-white bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:ring-rose-300 font-medium rounded-3xl text-md px-2 py-2 dark:bg-rose-600 dark:hover:bg-rose-700 focus:outline-none dark:focus:ring-rose-800 text-decoration-none w-80 text-center flex justify-evenly'>
              <div className='flex justify-center items-center'>
                <FaGoogle size='1.4rem' />
              </div>
              <p className='font-medium'>Tiếp tục truy cập Google</p>
            </button>
          </div>

          <div className='mt-4 w-80 mx-auto text-center'>
            <p className='font-normal text-zinc-600  dark:text-zinc-500'>
              Bằng cách tiếp tục, bạn đồng ý với{' '}
              <a
                href='youtube.com'
                className='font-normal dec text--600 dark:text-blue-500 no-underline hover:underline'
              >
                Điều khoản dịch vụ và Chính sách quyền riêng tư
              </a>{' '}
              của chúng tôi.
            </p>
            <p className='font-normal text-zinc-600  dark:text-zinc-500 mt-2'>
              Bạn chưa có tài khoản?{' '}
              <NavLink
                to='/register'
                className='font-medium dec text--600 dark:text-blue-500 no-underline hover:underline'
              >
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
