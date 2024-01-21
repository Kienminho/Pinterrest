import { useState } from 'react'
import FormWrapper from '../../components/FormLayout/FormWrapper'
import InputField from '../../components/Input/InputField'
import { FaFacebook, FaGoogle, FaPinterest } from 'react-icons/fa6'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    // e.preventDefault();
    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      if (response.ok || response.status === 200) {
        console.log('Signup successful', response)
        navigate('/login')
      } else {
        // Handle server error
        console.log('Signup failed with status:', response.status)
      }
    } catch (error) {
      console.log('signup error: ' + error)
    }
  }

  return (
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

        <div className='w-[300px] mt-4 flex flex-col gap-3'>
          <InputField label={'Username'} type='text' name={'username'} id={'user-name'} handleChange={handleChange} />

          <InputField label={'Email'} type='email' name={'email'} id={'user-email'} handleChange={handleChange} />

          <InputField
            label={'Password'}
            type='password'
            name={'password'}
            id={'user-pass'}
            handleChange={handleChange}
          />

          <div className='flex justify-center'>
            <button
              className='text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 font-medium rounded-3xl text-md px-2 py-2 mt-2 dark:bg-emerald-600 dark:hover:bg-emerald-700 focus:outline-none dark:focus:ring-emerald-800 text-decoration-none w-64 text-center'
              onClick={handleSubmit}
            >
              Tiếp tục
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
              Bạn đã là thành viên?{' '}
              <Link to='/login' class='font-medium dec text--600 dark:text-blue-500 no-underline hover:underline'>
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Form input section */}
    </FormWrapper>
  )
}

export default Signup
