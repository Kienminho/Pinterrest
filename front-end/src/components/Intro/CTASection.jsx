import React, { useState } from 'react'
import { FaFacebook, FaGoogle, FaPinterest } from 'react-icons/fa6'
import { AiOutlineClose } from 'react-icons/ai'
import { Link } from 'react-router-dom'

const CTASection = () => {
  const [isSignUp, setIsSignUp] = useState(true)

  const toggleForm = () => {
    setIsSignUp(!isSignUp)
  }

  return (
    <div className='w-full h-[100vh] relative flex justify-center items-center bg-cover bg-center bg-[url("https://wallpapers.com/images/hd/food-4k-m37wpodzrcbv5gvw.jpg")]'>
      {/* First part */}
      <div className='w-1/2 h-full z-10 flex items-center justify-center p-12'>
        <h1 className='w-[420px] text-[70px] text-left text-gray-200 leading-snug font-medium drop-shadow-lg'>
          Đăng ký để nhận thêm ý tưởng
        </h1>
      </div>

      {/* Sign up and Sign in part */}
      <div className='w-1/2 h-full z-10 flex justify-center items-center'>
        <div className='max-w-md max-h-fit bg-white shadow-lg flex flex-col my-4 p-9 rounded-3xl'>
          <div className='flex justify-end'>
            <button
              type='button'
              class='p-2 rounded-full uppercase text-2xl font-bold cursor-pointer hover:bg-gray-200 transition duration-150 ease-out hover:ease-in z-10'
              aria-label='Close'
            >
              <AiOutlineClose />
            </button>
          </div>

          <div className='flex items-center justify-center mt-[-25px] mb-3'>
            <FaPinterest size='2.2rem' color='red' />
          </div>

          <div
            style={{
              color: 'black',
              fontWeight: 'bold',
              alignContent: 'center',
              alignSelf: 'center'
            }}
          >
            <div className='items-center block justify-center text-center px-4;'>
              <h3 className='text-dark_color tracking-normal leading-tight'>Chào mừng bạn đến với Pinterest</h3>
            </div>

            {isSignUp && (
              <div className='block items-center justify-center mt-1'>
                <p className='text-center text-dark_color font-normal'>Tìm những ý tưởng mới để thử</p>
              </div>
            )}
          </div>

          <form className='mx-auto grid grid-cols-1 w-72 mt-4'>
            <div className='mb-2'>
              <label htmlFor='email' className='block text-md font-medium text-gray-700'>
                Email
              </label>
              <input type='email' id='email' className='mt-1 p-2.5 w-full border rounded-xl' placeholder='Email' />
            </div>

            <div className='mb-2'>
              <label htmlFor='password' className='block text-md font-medium text-gray-700'>
                Mật khẩu
              </label>
              <input
                type='password'
                id='password'
                className='mt-1 p-2.5 w-full border rounded-xl'
                placeholder='Tạo mật khẩu'
              />
            </div>
            {!isSignUp && (
              <div className='mb-4'>
                <label>
                  <a
                    class='inline-block align-baseline no-underline font-medium text-sm text-gray-700 hover:text-blue-500 hover:underline'
                    href='forget.com'
                  >
                    Quên mật khẩu?
                  </a>
                </label>
              </div>
            )}

            {isSignUp && (
              <div className='mb-4'>
                <label htmlFor='birthdate' className='block text-md font-medium text-gray-700'>
                  Ngày sinh
                </label>
                <input type='date' id='birthdate' className='mt-1 p-2.5 w-full border rounded-xl' />
              </div>
            )}
          </form>

          <div className='flex justify-center'>
            <a
              href='google.com'
              class='text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 font-medium rounded-3xl text-md px-2 py-1.5 dark:bg-emerald-600 dark:hover:bg-emerald-700 focus:outline-none dark:focus:ring-emerald-800 text-decoration-none w-64 text-center'
            >
              <h6 className='font-normal'>{isSignUp ? 'Đăng ký' : 'Đăng nhập'}</h6>
            </a>
          </div>
          <br></br>
          <div class='flex justify-center text-dark_mode font-bold text-md mt-[-15px] mb-2'>HOẶC</div>
          <div className='flex justify-center'>
            <a
              href='google.com'
              class='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-3xl text-md px-2 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 text-decoration-none w-64 text-center flex justify-around '
            >
              <div className='flex justify-center items-center'>
                <FaFacebook size='1.6rem' />
              </div>

              <p className='font-medium'>Tiếp tục với Facebook</p>
            </a>
          </div>
          <div className='flex justify-center'>
            <a
              href='google.com'
              class='text-white bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:ring-rose-300 font-medium rounded-3xl text-md px-2 py-2 dark:bg-rose-600 dark:hover:bg-rose-700 focus:outline-none dark:focus:ring-rose-800 text-decoration-none w-64 text-center flex justify-around mt-2'
            >
              <div className='flex justify-center items-center'>
                <FaGoogle size='1.4rem' />
              </div>
              <p className='font-medium'>Tiếp tục truy cập Google</p>
            </a>
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
              {isSignUp ? 'Bạn đã là thành viên?' : 'Chưa có tài khoản?'}{' '}
              <button
                onClick={toggleForm}
                class='font-medium dec text--600 dark:text-blue-500 no-underline hover:underline'
              >
                {isSignUp ? 'Đăng nhập' : 'Đăng ký'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div className='w-full h-10 z-10 bg-white font-medium bottom-0 mx-auto flex items-center px-48 justify-evenly absolute'>
        <Link className='text-sm hover:underline'>Điều Khoản Dịch Vụ</Link>
        <Link className='text-sm hover:underline'>Chính Sách Bảo Mật</Link>
        <Link className='text-sm hover:underline'>Trợ Giúp</Link>
        <a href='https://apps.apple.com/us/app/pinterest/id429047995' className='text-sm hover:underline'>
          Ứng Dụng iPhone
        </a>
        <a href='https://play.google.com/store/apps/details?id=com.pinterest' className='text-sm hover:underline'>
          Ứng Dụng Android
        </a>
        <Link className='text-sm hover:underline'>Người Dùng</Link>
        <Link className='text-sm hover:underline'>Bộ Sưu Tập</Link>
        <Link className='text-sm hover:underline'>Hôm Nay</Link>
        <Link className='text-sm hover:underline'>Khám Phá</Link>
      </div>
    </div>
  )
}

export default CTASection
