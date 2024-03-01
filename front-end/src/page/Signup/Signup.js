import { useEffect, useRef, useState } from 'react'
import FormWrapper from '../../components/FormLayout/FormWrapper'
import InputField from '../../components/Input/InputField'
import { NavLink, useNavigate } from 'react-router-dom'
import { registerUser } from '../../store/apiRequest'
import { useDispatch } from 'react-redux'
import { HiInformationCircle } from 'react-icons/hi'
import logo from '../../components/Nav/PLogo.svg'

const Signup = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const inputRef = useRef()
  // const error = useSelector((state) => state.Auth.error)

  const [error, setError] = useState('')
  const [hideError, setHideError] = useState(false)

  useEffect(() => {
    return inputRef.current.focus()
  }, [error])

  const [formData, setFormData] = useState({
    // username: '',
    Email: '',
    Password: ''
  })

  console.log(formData)

  const formDataObject = {
    // username: formData.username,
    Email: formData.Email,
    Password: formData.Password
  }

  const formDataString = JSON.stringify(formDataObject)

  console.log(formDataString)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))

    // Khi người dùng bắt đầu nhập lại thông tin, ẩn thông báo lỗi
    if (hideError) {
      setError('')
      setHideError(false)
    }
  }

  const handleRegister = async (e) => {
    const newUser = {
      Email: formData.Email,
      Password: formData.Password
    }
    try {
      await registerUser(newUser, dispatch, navigate)
    } catch (error) {
      console.log(error.message)
      // Hiển thị giá trị lỗi lên giao diện hoặc thực hiện các xử lý khác tùy ý
      setError(error.message)
    }
  }

  return (
    <>
      <FormWrapper>
        <div className='flex flex-col items-center'>
          <div className='logo aspect-square w-12 mb-3 '>
            <img src={logo} className='rounded-full' alt='Pinspired' />
          </div>
          <div className='items-center block justify-center text-center px-4;'>
            <h3 className='text-dark_color tracking-normal leading-tight'>Chào mừng bạn đã đến với Pinspired</h3>
          </div>
          <div className='block items-center justify-center mt-1'>
            <p className='text-center text-dark_color font-normal'>Tìm những ý tưởng mới để thử</p>
          </div>

          <div className='w-[360px] mt-4 flex flex-col gap-3'>
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
                label={'Mật khẩu'}
                type='password'
                name={'Password'}
                id={'user-pass'}
                placeholder='Tạo mật khẩu'
                handleChange={handleChange}
              />
            </div>

            {/* Hiển thị thông báo lỗi nếu có */}
            {error ? (
              <div className='w-full mt-1'>
                <p className='text-red-500 font-medium text-sm leading-6 tracking-wide'>{error}</p>
              </div>
            ) : (
              <p class='flex items-center gap-1 mt-2 font-sans text-sm antialiased font-normal leading-normal text-gray-600'>
                <HiInformationCircle size='1.5rem' />
                Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường và 1 số.
              </p>
            )}

            <div className='flex justify-center'>
              <button
                className='text-white bg-purple_btn hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 font-medium rounded-3xl text-base p-3 text-decoration-none w-80 text-center mt-2 transition duration-300 ease-in-out'
                onClick={() => {
                  handleRegister()
                  setHideError(true)
                }}
              >
                Đăng ký ngay
              </button>
            </div>
            <div class='my-2 grid grid-cols-3 items-center text-gray-400'>
              <hr class='border-gray-400' />
              <p class='text-center text-sm text-gray-600'>HOẶC</p>
              <hr class='border-gray-400' />
            </div>
            <div className='flex justify-center'>
              <button class='bg-white border py-2.5 mt-2 flex justify-center items-center text-dark_color hover:bg-[#f1f1f1] focus:ring-4 focus:ring-gray-200 font-medium rounded-3xl text-base px-2 text-decoration-none w-80 text-center transition duration-300 ease-in-out'>
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
              <p className='font-normal text-zinc-600  dark:text-zinc-500'>
                Bằng cách tiếp tục, bạn đồng ý với{' '}
                <a
                  href='youtube.com'
                  className='font-normal dec text--600 dark:text-blue-500 no-underline hover:underline'
                >
                  <span className='font-bold'>Điều khoản và Chính sách</span>
                </a>{' '}
                của chúng tôi.
              </p>
              <div className='border-b border-gray-400 mt-2'></div>
              <p className='font-normal text-zinc-600  dark:text-zinc-500 mt-2 '>
                Bạn đã là thành viên?{' '}
                <NavLink
                  to='/login'
                  className='font-medium text-blue-500 no-underline hover:underline hover:text-blue-600'
                >
                  Đăng nhập
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </FormWrapper>
    </>
  )
}

export default Signup
