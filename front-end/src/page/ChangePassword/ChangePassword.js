import { useEffect, useRef, useState } from 'react'
import FormWrapper from '../../components/FormLayout/FormWrapper'
import InputField from '../../components/Input/InputField'
import { FaPinterest } from 'react-icons/fa6'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { changePassword, loginUser } from '../../store/apiRequest'
import { MdEmail } from 'react-icons/md'
import { RiLockPasswordFill } from 'react-icons/ri'

const ChangePassword = () => {
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

  const handleChangePassword = async (e) => {
    const newUser = {
      Email: formData.Email,
      Password: formData.Password
    }
    console.log(newUser.Email)
    console.log(newUser.Password)
    try {
      await changePassword(newUser.Email, newUser.Password, dispatch, navigate)
    } catch (error) {
      console.log(error.message)
      // Hiển thị giá trị lỗi lên giao diện hoặc thực hiện các xử lý khác tùy ý
      setError(error.message)
    }
  }

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
        <h3 className='text-center text-dark_color tracking-normal leading-tight'>Thay đổi mật khẩu</h3>

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
              placeholder='Email đã đăng ký tài khoản'
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
              placeholder='Mật khẩu mới'
              handleChange={handleChange}
            />
          </div>

          {/* Hiển thị thông báo lỗi nếu có */}
          {error && (
            <div className='w-[400px] mt-1'>
              <p class='text-sm text-red-600 dark:text-red-500'>
                <span class='font-medium'>Oops!</span> {error}
              </p>
            </div>
          )}

          <div className='flex justify-center mt-3'>
            <button
              className='text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 font-medium rounded-3xl text-md px-2 py-2 dark:bg-emerald-600 dark:hover:bg-emerald-700 focus:outline-none dark:focus:ring-emerald-800 text-decoration-none w-80 text-center mt-2'
              onClick={handleChangePassword}
            >
              Đặt lại mật khẩu
            </button>
          </div>
        </div>
      </div>

      {/* Form input section */}
    </FormWrapper>
  )
}

export default ChangePassword
