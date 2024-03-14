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
import { BsInfoCircleFill } from 'react-icons/bs'

import logo from './PLogo.svg'
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

  let axiosJWT = createAxios(user, dispatch, logoutSuccess)

  const accessToken_daniel = user?.data?.AccessToken

  const handleButtonClick = (btnName) => {
    const updatedActiveBtn = {}
    Object.keys(activeBtn).forEach((key) => {
      // Duyệt qua tất cả các key trong activeBtn
      // Đặt key tương ứng thành true nếu nó là btnName, ngược lại là false
      updatedActiveBtn[key] = key === btnName
    })
    setActiveBtn(updatedActiveBtn)
  }

  const handleLogout = () => {
    logoutUser(dispatch, navigate, accessToken_daniel, axiosJWT)
    console.log('done handle logout')
  }

  useEffect(() => {}, [activeBtn])

  console.log(activeBtn)
  return (
    <>
      <Navbar
        fluid
        rounded
        className='font-roboto border-b-2 border-gray-50 shadow-md text-dark_color px-4 py-3 sm:px-6 sm:py-[14px]'
      >
        <Navbar.Brand>
          <NavLink to='/' className='flex'>
            <img src={logo} className='h-6 sm:h-9 rounded-full' alt='Flowbite React Logo' />
            <span className='self-center whitespace-nowrap text-xl font-semibold dark:text-white text-indigo-600 ml-1'>
              Pinspired
            </span>
          </NavLink>
        </Navbar.Brand>
        {user ? (
          <div className='flex md:order-2 gap-2'>
            {/* <Tooltip content='Notify'>
            <NavLink to='/notify'>
              <button className='rounded-full btn-circle'>
                <IoNotifications size='1.7rem' color='#666666' className='cursor-pointer' />
              </button>
            </NavLink>
          </Tooltip> */}
            <Tooltip content='Message'>
              <NavLink to='/message'>
                <button className='rounded-full btn-circle mt-[3px]'>
                  <AiFillMessage size='1.8rem' color='#666666' className='cursor-pointer' />
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
                  className='ml-2 rounded-full hover:bg-indigo-300 transition duration-300 hover:rounded-full p-1.5 -mt-1'
                  img={AvatarUser}
                  rounded
                />
              }
            >
              <Dropdown.Header>
                <div className='flex gap-3'>
                  <Avatar alt='User settings' img={AvatarUser} rounded />
                  <div className='flex flex-col gap-0.5'>
                    <span className='truncate font-semibold'>{FullName}</span>
                    <span className='truncate font-medium text-gray-700'>@{UserName}</span>
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
                <NavLink to='/terms-of-service'>Điều khoản dịch vụ</NavLink>
              </Dropdown.Item>
              <Dropdown.Item icon={BsInfoCircleFill}>
                <NavLink to='/privacy-policy'>Quyền riêng tư của bạn</NavLink>
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
              <div className='rounded-3xl text-dark_color px-[18px] py-3 transition duration-300 ease-in-out hover:bg-zinc-300/90 bg-zinc-300/60'>
                Đăng nhập
              </div>
            </NavLink>
            <NavLink to='/register'>
              <div className='rounded-3xl bg-purple_btn hover:bg-indigo-600 px-[20px] py-3 transition duration-300 ease-in-out text-white'>
                Đăng ký
              </div>
            </NavLink>
          </div>
        )}
        <Navbar.Collapse>
          <NavLink to='/'>
            <button
              className={`btn-home px-4 py-3 ${
                activeBtn['home'] ? 'bg-purple_btn hover:bg-purple_btn text-white' : ''
              }`}
              onClick={() => handleButtonClick('home')}
            >
              <span className='text-base'>{user && 'Trang chủ'}</span>
            </button>
          </NavLink>
          {user && (
            <NavLink to='/create'>
              <button
                className={`btn-home px-5 py-3 md:-ml-6 ${
                  activeBtn['create'] ? 'bg-purple_btn hover:bg-purple_btn text-white' : ''
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
