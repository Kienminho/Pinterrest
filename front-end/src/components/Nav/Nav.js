import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { PinterestLogo } from '../Icon/PinterestLogo'
import { ProfileImage } from '../ProfileImage/ProfileImage'
import Search from '../Search/Search'
import { FaAngleDown, FaSignOutAlt } from 'react-icons/fa'
import { RiUpload2Fill } from 'react-icons/ri'
import { IoNotifications } from 'react-icons/io5'
import { AiFillMessage } from 'react-icons/ai'
import 'tippy.js/dist/tippy.css'
import Menu from '../Popper/Menu'
import { useEffect, useState } from 'react'

import Signin from '../Signin/signin'
import Signup from '../../page/Signup/Signup'
import { logoutSuccess } from '../../store/slices/AuthSlice'
import { logoutUser } from '../../store/apiRequest'
import { createAxios } from '../../createInstance'

import { Button, Tooltip } from 'flowbite-react'
import { Avatar, Dropdown, Navbar } from 'flowbite-react'
import { HiOutlineAdjustments, HiUserCircle } from 'react-icons/hi'
import { MdPrivacyTip } from 'react-icons/md'

const Nav = () => {
  const user = useSelector((state) => state.Auth.login?.currentUser)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  let axiosJWT = createAxios(user, dispatch, logoutSuccess)

  const accessToken_daniel = user?.data?.AccessToken

  const handleLogout = () => {
    logoutUser(dispatch, navigate, accessToken_daniel, axiosJWT)
    console.log('done handle logout')
  }
  return (
    <Navbar fluid rounded className='sm:px-6 sm:py-5'>
      <Navbar.Brand>
        <NavLink to='/' className='flex'>
          <PinterestLogo alt='Pinterest Logo' />
          <span className='self-center whitespace-nowrap text-xl font-semibold dark:text-white text-red-600 ml-1 mr-3'>
            Pinterest
          </span>
        </NavLink>
      </Navbar.Brand>

      {user && (
        <div className='flex md:order-2'>
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='User settings' img='https://flowbite.com/docs/images/people/profile-picture-5.jpg' rounded />
            }
          >
            <Dropdown.Header>
              <span className='text-sm'>
                Username: <span className='truncate text-sm font-medium text-blue-600'>{user.data.UserName}</span>
              </span>
            </Dropdown.Header>

            <Dropdown.Item icon={HiUserCircle}>
              <NavLink to='/profile'>Profile</NavLink>
            </Dropdown.Item>
            <Dropdown.Item icon={HiOutlineAdjustments}>
              <NavLink to='/settings'>Setting</NavLink>
            </Dropdown.Item>
            <Dropdown.Item icon={MdPrivacyTip}>
              <NavLink to='/privacy'>Term of service</NavLink>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout} icon={FaSignOutAlt}>
              Sign out
            </Dropdown.Item>
          </Dropdown>
        </div>
      )}
      <NavLink to='/home'>
        <Button color='gray' className='hover:bg-zinc-300/60 border-none'>
          {user ? 'Home' : 'Explore'}
        </Button>
      </NavLink>

      {user && (
        <NavLink to='/create'>
          <Button color='gray' className='hover:bg-zinc-300/60 border-none'>
            Create
          </Button>
        </NavLink>
      )}

      {user && (
        <div className='flex items-center justify-center mx-8'>
          {' '}
          <div>
            <Search />
          </div>
        </div>
      )}

      {user ? (
        <>
          <div className='flex'>
            <Tooltip content='Upload media'>
              <NavLink to='/create'>
                <Button style={{ border: 0 }} color='light'>
                  <RiUpload2Fill size='1.5rem' color='rgb(95, 95, 95)' className='cursor-pointer' />
                </Button>
              </NavLink>
            </Tooltip>
            <Tooltip content='Notify'>
              <NavLink to='/noti'>
                <Button style={{ border: 0 }} color='light'>
                  <IoNotifications size='1.5rem' color='rgb(95, 95, 95)' className='cursor-pointer' />
                </Button>
              </NavLink>
            </Tooltip>
            <Tooltip content='Message'>
              <NavLink to='/message'>
                <Button style={{ border: 0 }} color='light'>
                  <AiFillMessage size='1.5rem' color='rgb(95, 95, 95)' className='cursor-pointer' />
                </Button>
              </NavLink>
            </Tooltip>
          </div>
        </>
      ) : (
        <div className='flex justify-end items-center flex-1 mr-4'>
          <NavLink to='/login'>
            <Button color='failure' pill className='hover:bg-[#c5001e] mr-2 px-3'>
              Đăng nhập
            </Button>
          </NavLink>
          <NavLink to='/register'>
            <Button color='failure' pill className='hover:bg-[#c5001e] mr-2 px-3'>
              Đăng ký
            </Button>
          </NavLink>
        </div>
      )}
    </Navbar>
  )
}

const ProfileAvatar = () => {
  // const { userPic, username } = useSelector((state) => {
  //   return state.User
  // })

  const userPic = true
  let username = 'nhan'

  // src={`/pic_uploads/${userPic}`}
  return (
    <div className='profile_pic p-2.5 aspect-square w-12 hover:bg-[#0000000f] rounded-full flex'>
      {userPic ? (
        <ProfileImage
          className='rounded-full'
          src='https://www.shareicon.net/data/512x512/2016/05/24/770117_people_512x512.png'
          alt={username + 'profile image'}
        />
      ) : (
        <ProfileImage
          className='rounded-full'
          // src={require('../../images/icons/blank_profile.jpg')}
          alt={username + 'blank profile image'}
        />
      )}
    </div>
  )
}

const NavWrapper = ({ className, children }) => {
  return <div className={`w-[3.2rem] rounded-full p-3 hover:bg-[#0000000f] ${className}`}>{children}</div>
}

export default Nav
