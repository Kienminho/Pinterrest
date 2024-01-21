import React from 'react'
import { FaFacebook, FaGoogle, FaPinterest } from 'react-icons/fa6'
import { AiOutlineClose } from 'react-icons/ai'

function MyModal({ onClose }) {
  return (
    <div className='w-screen h-screen z-[999] bg-[#00000060] fixed flex justify-center items-center inset-0 overflow-y-auto'>
      <div className='max-w-lg max-h-fit bg-white shadow-lg flex flex-col my-4 p-9 rounded-3xl'>
        <div className='flex justify-end'>
          <button
            type='button'
            class='p-2 rounded-full uppercase text-2xl font-bold cursor-pointer hover:bg-gray-200 transition duration-150 ease-out hover:ease-in z-10'
            aria-label='Close'
            onClick={onClose}
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
          <div className='block items-center justify-center mt-1 mb-3'>
            <p className='text-center text-dark_color font-normal'>Tìm những ý tưởng mới để thử</p>
          </div>
        </div>

        <form className='mx-auto grid grid-cols-1 w-72'>
          <div className='mb-2'>
            <label htmlFor='email' className='block text-md font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              id='email'
              className='mt-1 p-2.5 w-full border rounded-xl'
              placeholder='Email'
              autoFocus
            />
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

          <div className='mb-4'>
            <label htmlFor='birthdate' className='block text-md font-medium text-gray-700'>
              Ngày sinh
            </label>
            <input type='date' id='birthdate' className='mt-1 p-2.5 w-full border rounded-xl' />
          </div>
        </form>

        <div className='flex justify-center'>
          <a
            href='google.com'
            class='text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 font-medium rounded-3xl text-md px-2 py-2 dark:bg-emerald-600 dark:hover:bg-emerald-700 focus:outline-none dark:focus:ring-emerald-800 text-decoration-none w-64 text-center'
          >
            <h6 className='font-normal'>Tiếp tục</h6>
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
            Bạn đã là thành viên?{' '}
            <a href='youtube.com' class='font-medium dec text--600 dark:text-blue-500 no-underline hover:underline'>
              Đăng nhập
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default MyModal
