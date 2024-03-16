import { useEffect, useRef, useState } from 'react'
import FormWrapper from '../../components/FormLayout/FormWrapper'
import InputField from '../../components/Input/InputField'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { changePassword } from '../../store/apiRequest'
import logo from '../../components/Nav/PLogo.svg'
import { HiInformationCircle } from 'react-icons/hi'
import { Alert, Spin } from 'antd'

const ChangePassword = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const inputRef = useRef()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hideError, setHideError] = useState(false)

  useEffect(() => {
    return inputRef.current.focus()
  }, [error])

  const [formData, setFormData] = useState({
    Email: '',
    Password: ''
  })

  const handleChangePassword = async (e) => {
    const newUser = {
      Email: formData.Email,
      Password: formData.Password
    }
    try {
      setLoading(true)
      await changePassword(newUser.Email, newUser.Password, dispatch, navigate)
      setLoading(false)
    } catch (error) {
      setLoading(false)
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
        <div className='flex flex-col items-center font-roboto'>
          <div className='logo aspect-square w-12 mb-3 '>
            <img src={logo} className='rounded-full' alt='Pinspired' />
          </div>
          <div className='items-center block justify-center text-center px-4;'>
            <h3 className='text-dark_color tracking-normal leading-tight'>Thay đổi mật khẩu Pinspired</h3>
          </div>
          <div className='block items-center justify-center mt-1'>
            <p className='text-center text-dark_color font-normal'>Vui lòng điền thông tin bên dưới</p>
          </div>

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
            {error ? (
              <div className='w-full mt-1'>
                <Alert message={error} type='error' showIcon />{' '}
              </div>
            ) : (
              <p class='flex items-center gap-1 mt-2 font-sans text-sm antialiased font-normal leading-normal text-gray-600'>
                <HiInformationCircle size='1.4rem' />
                Mật khẩu mới không được trùng với mật khẩu cũ.
              </p>
            )}
            <div className='flex justify-center'>
              <button
                className='text-white bg-[#6366f1] hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 font-medium rounded-3xl text-base p-3 text-decoration-none w-80 text-center mt-2 transition duration-300 ease-in-out'
                onClick={() => {
                  handleChangePassword()
                  setHideError(true)
                }}
              >
                Đặt lại mật khẩu
              </button>
            </div>
          </div>
        </div>

        {/* Form input section */}
      </FormWrapper>
    </>
  )
}

export default ChangePassword
