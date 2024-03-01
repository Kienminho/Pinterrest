import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaSignOutAlt } from 'react-icons/fa'
import { IoNotifications } from 'react-icons/io5'
import { AiFillMessage } from 'react-icons/ai'
import 'tippy.js/dist/tippy.css'

import { logoutSuccess } from '../../store/slices/AuthSlice'
import { logoutUser } from '../../store/apiRequest'
import { createAxios } from '../../createInstance'

import { Tooltip } from 'flowbite-react'
import { Avatar, Dropdown, Navbar } from 'flowbite-react'
import { HiOutlineAdjustments, HiUserCircle } from 'react-icons/hi'
import { MdPrivacyTip } from 'react-icons/md'

import logo from './PLogo.svg'
import './Nav.css'

const NavCopy = () => {
  const user = useSelector((state) => state.Auth.login?.currentUser)
  const { Avatar: AvatarUser, FullName, UserName, Email } = useSelector((state) => state.User)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  let axiosJWT = createAxios(user, dispatch, logoutSuccess)

  const accessToken_daniel = user?.data?.AccessToken

  const handleLogout = () => {
    logoutUser(dispatch, navigate, accessToken_daniel, axiosJWT)
    console.log('done handle logout')
  }
  return (
    <Navbar fluid rounded className='border-b-2 border-gray-50 shadow-md text-dark_color px-4 py-3 sm:px-6 sm:py-5'>
      <Navbar.Brand>
        <NavLink to='/' className='flex'>
          {/* <PinterestLogo alt='Pinterest Logo' /> */}
          <img src={logo} className='h-6 sm:h-9 rounded-full' alt='Flowbite React Logo' />
          <span className='self-center whitespace-nowrap text-xl font-semibold dark:text-white text-indigo-600 ml-1'>
            Pinspired
          </span>
        </NavLink>
      </Navbar.Brand>
      {user ? (
        <div className='flex md:order-2 gap-2'>
          <Tooltip content='Notify'>
            <NavLink to='/notify'>
              <button className='rounded-full btn-circle'>
                <IoNotifications size='1.7rem' color='#666666' className='cursor-pointer' />
              </button>
            </NavLink>
          </Tooltip>
          <Tooltip content='Message'>
            <NavLink to='/message'>
              <button className='rounded-full btn-circle'>
                <AiFillMessage size='1.7rem' color='#666666' className='cursor-pointer' />
              </button>
            </NavLink>
          </Tooltip>
          <Dropdown
            arrowIcon={false}
            inline
            className='px-1 py-2'
            label={<Avatar alt='User settings' className='ml-2' img={AvatarUser} rounded />}
          >
            <Dropdown.Header>
              <div className='flex gap-3'>
                <Avatar alt='User settings' img={AvatarUser} rounded />
                <div className='flex flex-col gap-0.5'>
                  <span className='truncate text-sm font-semibold'>{FullName}</span>
                  <span className='truncate text-sm font-normal text-gray-500'>Username: {UserName}</span>
                  <span className='truncate text-sm font-normal text-gray-500'>{Email}</span>
                </div>
              </div>
            </Dropdown.Header>

            <Dropdown.Item icon={HiUserCircle}>
              <NavLink to='/profile'>Hồ sơ của bạn</NavLink>
            </Dropdown.Item>
            <Dropdown.Item icon={HiOutlineAdjustments}>
              <NavLink to='/settings'>Thông tin tài khoản</NavLink>
            </Dropdown.Item>
            <Dropdown.Item icon={MdPrivacyTip}>
              <NavLink to='/privacy'>Xem điều khoản dịch vụ</NavLink>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout} icon={FaSignOutAlt}>
              Đăng xuất
            </Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>
      ) : (
        <div className='flex md:order-2 gap-2 font-medium'>
          <NavLink to='/login'>
            <div
              // onClick={openLoginPopup}
              className='rounded-3xl text-dark_color px-[18px] py-3 transition duration-300 ease-in-out hover:bg-zinc-300/90 bg-zinc-300/60'
            >
              Đăng nhập
            </div>
          </NavLink>
          <NavLink to='/register'>
            <div
              // onClick={openRegisterPopup}
              className='rounded-3xl bg-purple_btn hover:bg-indigo-600 px-[20px] py-3 transition duration-300 ease-in-out text-white '
            >
              Đăng ký
            </div>
          </NavLink>
        </div>
      )}
      <Navbar.Collapse>
        <NavLink to='/'>
          <button color='gray' className='btn-home px-4 py-3'>
            <span className='text-base'>{user && 'Trang chủ'}</span>
          </button>
        </NavLink>
        {user && (
          <NavLink to='/create'>
            <button color='gray' className='btn-home px-5 py-3 md:-ml-6'>
              <span className='text-base'>Tạo</span>
            </button>
          </NavLink>
        )}
      </Navbar.Collapse>
      {/* Search bar */}
      {user && (
        <div class='w-full md:w-[40%] lg:w-[50%] xl:w-[60%] 2xl:w-[70%]'>
          <label for='default-search' class='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'>
            Tìm kiếm
          </label>
          <div class='relative'>
            <div class='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
              <svg
                class='w-4 h-4 text-gray-500 dark:text-gray-400'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 20 20'
              >
                <path
                  stroke='currentColor'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                />
              </svg>
            </div>
            <input
              type='search'
              id='default-search'
              class='block w-full p-4 ps-10 placeholder:text-sm font-medium text-gray-800 border border-gray-200 rounded-full bg-gray_input hover:bg-[#e1e1e1] focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500'
              placeholder='Tìm kiếm hình ảnh, video..'
              required
            />
            <button
              type='submit'
              class='text-white absolute end-2.5 bottom-2.5 bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-full text-sm px-4 py-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800'
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      )}
    </Navbar>
  )
}

export default NavCopy
