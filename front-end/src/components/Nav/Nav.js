import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { FaSignOutAlt } from 'react-icons/fa'
import { AiFillMessage } from 'react-icons/ai'
import 'tippy.js/dist/tippy.css'

import { logoutSuccess } from '../../store/slices/AuthSlice'
import { logoutUser } from '../../store/apiRequest'
import { CreateAxios } from '../../createInstance'

import { Tooltip } from 'flowbite-react'
import { Avatar, Dropdown, Navbar } from 'flowbite-react'
import { HiUserCircle } from 'react-icons/hi'
import { MdInfo } from 'react-icons/md'
import { IoClipboard } from 'react-icons/io5'
import { FaPeopleGroup } from 'react-icons/fa6'

import logo from './PLogo_circle.png'
import './Nav.css'
import { useEffect, useState } from 'react'
import { SearchAndResultsImage } from '../SearchAndResultsImage/SearchAndResultsImage'
import { FloatButton } from 'antd'

const Nav = () => {
  const user = useSelector((state) => state.Auth.login?.currentUser)
  const { Avatar: AvatarUser, FullName, UserName } = useSelector((state) => state.User)
  const [activeBtn, setActiveBtn] = useState({ home: false, create: false })

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  let axiosJWT = CreateAxios(user, dispatch, logoutSuccess)

  const accessToken_daniel = user?.data?.AccessToken

  const handleButtonClick = (btnName) => {
    setActiveBtn((prevActiveBtn) => ({
      ...prevActiveBtn,
      home: btnName === 'home',
      create: btnName === 'create'
    }))
  }

  const handleLogout = () => {
    logoutUser(dispatch, navigate, accessToken_daniel, axiosJWT)
    console.log('done handle logout')
  }

  useEffect(() => {
    const { pathname } = location
    setActiveBtn({
      home: pathname === '/',
      create: pathname === '/create'
    })
  }, [location])

  return (
    <>
      <Navbar
        fluid
        rounded
        className='font-inter shadow-lg border-b-2 border-b-gray-700 px-4 py-3 sm:px-6 sm:py-[16px] bg-light_blue text-[#fff] rounded-none'
      >
        <Navbar.Brand>
          <NavLink to='/' className='flex'>
            <img src={logo} className='aspect-square h-7 w-7 sm:h-9 sm:w-9 rounded-full' alt='Pinspired Logo' />
            <span className='self-center whitespace-nowrap text-[22px] font-semibold text-pink-600 ml-2'>
              Pinspired
            </span>
          </NavLink>
        </Navbar.Brand>
        {user ? (
          <div className='flex md:order-2 gap-2'>
            <Tooltip content='Message'>
              <NavLink to='/message'>
                <button className='rounded-full btn-circle hover:bg-hover_dark mt-[3px]'>
                  <AiFillMessage size='1.7rem' color='#ffffff' className='cursor-pointer' />
                </button>
              </NavLink>
            </Tooltip>
            <Dropdown
              arrowIcon={false}
              inline
              className='px-1 py-2'
              label={
                <Avatar
                  alt='User settings'
                  className='ml-2 rounded-full hover:bg-pink-600 transition duration-300 hover:rounded-full p-0.5'
                  img={
                    AvatarUser
                      ? AvatarUser
                      : 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'
                  }
                  rounded
                />
              }
            >
              <Dropdown.Header>
                <div className='flex gap-3'>
                  <Avatar alt='User settings' img={AvatarUser} rounded />
                  <div className='flex flex-col gap-0.5 text-white'>
                    <span className='truncate font-semibold'>{FullName}</span>
                    <span className='truncate font-medium text-[#ffffffb3]'>@{UserName}</span>
                  </div>
                </div>
              </Dropdown.Header>

              <Dropdown.Item icon={HiUserCircle}>
                <NavLink to='/profile' className='truncate font-medium text-[#ffffff]'>
                  Hồ sơ của bạn
                </NavLink>
              </Dropdown.Item>
              <Dropdown.Item icon={MdInfo}>
                <NavLink to='/settings' className='truncate font-medium text-[#ffffff]'>
                  Thông tin tài khoản
                </NavLink>
              </Dropdown.Item>
              <Dropdown.Item icon={IoClipboard}>
                <NavLink to='/terms-of-service' className='truncate font-medium text-[#ffffff]'>
                  Điều khoản dịch vụ
                </NavLink>
              </Dropdown.Item>
              <Dropdown.Item icon={FaPeopleGroup}>
                <NavLink to='/about' className='truncate font-medium text-[#ffffff]'>
                  Giới thiệu Pinspired
                </NavLink>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} icon={FaSignOutAlt}>
                <span className='truncate font-medium text-[#ffffff]'>Đăng xuất</span>
              </Dropdown.Item>
            </Dropdown>
            <Navbar.Toggle />
          </div>
        ) : (
          <div className='flex md:order-2 gap-2 font-medium'>
            <NavLink to='/login'>
              <div className='rounded-full btn-pink bg-pink-100 hover:bg-pink-200 px-[20px] py-3 transition duration-300 ease-in-out text-pink-600 text-base'>
                Đăng nhập
              </div>
            </NavLink>
            <NavLink to='/register'>
              <div className='rounded-full bg-pink-600 hover:bg-pink-700 px-[20px] py-3 transition duration-300 ease-in-out text-white text-base'>
                Đăng ký
              </div>
            </NavLink>
          </div>
        )}
        <Navbar.Collapse>
          <NavLink to='/'>
            <button
              className={`btn-home hover:bg-[#384454] px-4 py-3 ${
                activeBtn['home'] ? 'bg-pink-600 hover:bg-pink-700 text-white' : ''
              }`}
              onClick={() => handleButtonClick('home')}
            >
              <span className='text-base'>{user && 'Trang chủ'}</span>
            </button>
          </NavLink>
          {user && (
            <NavLink to='/create'>
              <button
                className={`btn-home hover:bg-[#384454] px-5 py-3 md:-ml-6 ${
                  activeBtn['create'] ? 'bg-pink-600 hover:bg-pink-700 text-white' : ''
                }`}
                onClick={() => handleButtonClick('create')}
              >
                <span className='text-base'>{user && 'Tạo'}</span>
              </button>
            </NavLink>
          )}
        </Navbar.Collapse>
        {/* Search bar */}
        {user && (
          <div class='w-full md:w-[40%] lg:w-[50%] xl:w-[60%] 2xl:w-[70%] md:mt-0 mt-2'>
            <SearchAndResultsImage />
          </div>
        )}
      </Navbar>
      <FloatButton.BackTop />
    </>
  )
}

export default Nav
