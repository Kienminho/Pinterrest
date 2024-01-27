import { useEffect, useRef, useState } from 'react'
import FormWrapper from '../../components/FormLayout/FormWrapper'
import InputField from '../../components/Input/InputField'
import { FaFacebook, FaGoogle, FaPinterest } from 'react-icons/fa6'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { registerUser } from '../../store/apiRequest'
import { useDispatch, useSelector } from 'react-redux'
import toast, { Toaster } from 'react-hot-toast'
import { HiInformationCircle } from 'react-icons/hi'
import { MdOutlineEmail } from 'react-icons/md'
import { MdEmail } from 'react-icons/md'
import { RiLockPasswordFill } from 'react-icons/ri'

const Signup = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const inputRef = useRef()
  // const error = useSelector((state) => state.Auth.error)

  const [error, setError] = useState('')

  useEffect(() => {
    return inputRef.current.focus()
  }, [])

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
          <div className='logo aspect-square w-9 mb-3 rounded-full'>
            <FaPinterest size='2.2rem' color='red' />
          </div>
          <div className='items-center block justify-center text-center px-4;'>
            <h3 className='text-dark_color tracking-normal leading-tight'>Chào mừng bạn đến với Pinterest</h3>
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
                label={'Password'}
                type='password'
                name={'Password'}
                id={'user-pass'}
                placeholder='Tạo mật khẩu'
                handleChange={handleChange}
              />
            </div>
            <p class='flex items-center gap-1 mt-2 font-sans text-sm antialiased font-normal leading-normal text-zinc-600'>
              <HiInformationCircle size='1.5rem' />
              Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường và 1 số.
            </p>

            {/* Hiển thị thông báo lỗi nếu có */}
            {error && (
              <div className='w-[300px] mt-2'>
                <p style={{ color: 'red' }}>{error}</p>
              </div>
            )}

            <div className='flex justify-center'>
              <button
                className='text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 font-medium rounded-3xl text-md px-2 py-2 mt-2 dark:bg-emerald-600 dark:hover:bg-emerald-700 focus:outline-none dark:focus:ring-emerald-800 text-decoration-none w-80 text-center'
                onClick={handleRegister}
              >
                Tiếp tục
              </button>
            </div>
            <div className='flex justify-center text-dark_mode font-bold text-md mb-2'>HOẶC</div>
            <div className='flex justify-center'>
              <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-3xl text-md px-2 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 text-decoration-none w-80 text-center flex justify-evenly '>
                <div className='flex justify-center items-center'>
                  <FaFacebook size='1.6rem' />
                </div>
                <p className='font-medium'>Tiếp tục với Facebook</p>
              </button>
            </div>
            <div className='flex justify-center'>
              <button className='text-white bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:ring-rose-300 font-medium rounded-3xl text-md px-2 py-2 dark:bg-rose-600 dark:hover:bg-rose-700 focus:outline-none dark:focus:ring-rose-800 text-decoration-none w-80 text-center flex justify-evenly'>
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
                Bạn đã là thành viên?{' '}
                <NavLink
                  to='/login'
                  className='font-medium dec text--600 dark:text-blue-500 no-underline hover:underline'
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
