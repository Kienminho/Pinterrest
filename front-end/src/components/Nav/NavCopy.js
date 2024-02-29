import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { PinterestLogo } from '../Icon/PinterestLogo'
import { ProfileImage } from '../ProfileImage/ProfileImage'
import Search from '../Search/Search'
import { FaSignOutAlt } from 'react-icons/fa'
import { RiUpload2Fill } from 'react-icons/ri'
import { IoNotifications } from 'react-icons/io5'
import { AiFillMessage } from 'react-icons/ai'
import 'tippy.js/dist/tippy.css'

import { logoutSuccess } from '../../store/slices/AuthSlice'
import { logoutUser } from '../../store/apiRequest'
import { createAxios } from '../../createInstance'

import { Button, Tooltip } from 'flowbite-react'
import { Avatar, Dropdown, Navbar } from 'flowbite-react'
import { HiOutlineAdjustments, HiUserCircle } from 'react-icons/hi'
import { MdPrivacyTip } from 'react-icons/md'

const NavCopy = () => {
  const user = useSelector((state) => state.Auth.login?.currentUser)
  const { Avatar: AvatarUser, UserName } = useSelector((state) => state.User)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  let axiosJWT = createAxios(user, dispatch, logoutSuccess)

  const accessToken_daniel = user?.data?.AccessToken

  const handleLogout = () => {
    logoutUser(dispatch, navigate, accessToken_daniel, axiosJWT)
    console.log('done handle logout')
  }
  return (
    <Navbar fluid rounded className='bg-gray-800 text-pink-400 sm:px-6 sm:py-5'>
      <Navbar.Brand>
        <NavLink to='/' className='flex'>
          <PinterestLogo alt='Pinterest Logo' />
          <span className='self-center whitespace-nowrap text-xl font-semibold dark:text-white text-rose-600 ml-1 mr-3'>
            Pinterest
          </span>
        </NavLink>
      </Navbar.Brand>
      <div className='flex md:order-2 gap-2'>
        <Tooltip content='Notify'>
          <NavLink to='/notify'>
            <button className='rounded-full btn-circle'>
              <IoNotifications size='1.7rem' color='rgb(95, 95, 95)' className='cursor-pointer' />
            </button>
          </NavLink>
        </Tooltip>
        <Tooltip content='Message'>
          <NavLink to='/message'>
            <button className='rounded-full btn-circle'>
              <AiFillMessage size='1.7rem' color='rgb(95, 95, 95)' className='cursor-pointer' />
            </button>
          </NavLink>
        </Tooltip>
        <Dropdown arrowIcon={false} inline label={<Avatar alt='User settings' img={AvatarUser} rounded />}>
          <Dropdown.Header>
            <span className='text-sm'>
              Username: <span className='truncate text-sm font-medium text-indigo-600'>{UserName}</span>
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
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <NavLink to='/'>
          <button color='gray' className='hover:bg-indigo-500 rounded-full px-3 py-3'>
            <span>{user ? 'Trang chủ' : 'Khám phá'}</span>
          </button>
        </NavLink>
        {user && (
          <NavLink to='/create'>
            <button color='gray' className='hover:bg-indigo-500 rounded-full px-3 py-3 md:-ml-6'>
              Tạo
            </button>
          </NavLink>
        )}
      </Navbar.Collapse>
      {/* Search bar */}
      {user && (
        <form class='sm:w-[30%] md:w-[40%] lg:w-[50%] xl:w-[60%] 2xl:w-[70%] item-centers'>
          <label for='default-search' class='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'>
            Search
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
              class='block w-full p-4 ps-10 text-sm text-white border border-gray-600 rounded-full bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500'
              placeholder='Search Mockups, Logos...'
              required
            />
            <button
              type='submit'
              class='text-white absolute end-2.5 bottom-2.5 bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-full text-sm px-4 py-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800'
            >
              Search
            </button>
          </div>
        </form>
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

export default NavCopy
