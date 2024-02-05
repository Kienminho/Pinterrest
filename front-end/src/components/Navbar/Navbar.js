import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { PinterestLogo } from '../Icon/PinterestLogo'
import { ProfileImage } from '../ProfileImage/ProfileImage'
import Search from '../Search/Search'
import { FaAngleDown } from 'react-icons/fa'
import { RiUpload2Fill } from 'react-icons/ri'
import { IoNotifications } from 'react-icons/io5'
import { AiFillMessage } from 'react-icons/ai'
import 'tippy.js/dist/tippy.css'
import Tippy from '@tippyjs/react/'
import TippyHeadless from '@tippyjs/react/headless'
import Menu from '../Popper/Menu'
import { useEffect, useState } from 'react'

import Signin from '../Signin/signin'
import Signup from '../../page/Signup/Signup'
import { logoutSuccess } from '../../store/slices/AuthSlice'
import { logoutUser } from '../../store/apiRequest'
import { createAxios } from '../../createInstance'

import { Button, Tooltip } from 'flowbite-react'

const MENU_ITEMS = [
  {
    title: 'Introduce about Pinterest',
    to: '/about'
  },
  {
    title: 'Terms and Privacy',
    to: '/term-of-service'
  }
]

const Navbar = () => {
  const user = useSelector((state) => state.Auth.login?.currentUser)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  let axiosJWT = createAxios(user, dispatch, logoutSuccess)

  const accessToken_daniel = user?.data?.AccessToken
  console.log(accessToken_daniel)

  const handleLogout = () => {
    logoutUser(dispatch, navigate, accessToken_daniel, axiosJWT)
    console.log('done handle logout')
  }
  return (
    <div className='navbar bg-white w-full max-sm:top-auto max-sm:fixed max-sm:bottom-0 px-6 py-4 sticky top-0 z-50'>
      <ForBigScreen handleLogout={handleLogout} user={user} />
    </div>
  )
}

const ForBigScreen = ({ handleLogout, user }) => {
  const userMenu = [
    {
      title: 'View profile',
      to: '/@nhan'
    },
    {
      title: 'Settings',
      to: '/settings'
    },
    ...MENU_ITEMS,
    {
      title: 'Log out',
      to: '/logout',
      seperate: true
    }
  ]
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [showRegisterPopup, setShowRegisterPopup] = useState(false)

  const openLoginPopup = () => {
    setShowLoginPopup(true)
  }

  const closeLoginPopup = () => {
    setShowLoginPopup(false)
  }

  const openRegisterPopup = () => {
    setShowRegisterPopup(true)
  }

  const closeRegisterPopup = () => {
    setShowRegisterPopup(false)
  }

  return (
    <div className='flex justify-between'>
      <div className='flex items-center gap-2'>
        <NavLink to='/' className='flex justify-center items-center'>
          <NavWrapper>
            <PinterestLogo />
          </NavWrapper>
          <span className='text-red-600 text-[20px] font-medium tracking-tighter ml-[-6px]'>Pinterest</span>
        </NavLink>

        <div className='btn-link'>
          <NavLink to='/'>{user ? 'Home' : 'Explore'}</NavLink>
        </div>

        {user && (
          <div className='btn-link'>
            <NavLink to='/create'>Create</NavLink>
          </div>
        )}
      </div>

      {user && (
        <div className='flex items-center justify-center mx-8'>
          {' '}
          <div>
            <Search />
          </div>
        </div>
      )}

      <div className='flex items-center gap-6'>
        {user ? (
          <>
            <Tooltip content='Tooltip content' placement='bottom'>
              <Button>Tooltip bottom</Button>
            </Tooltip>
            <Tippy delay={[0, 200]} content='Upload media' placement='bottom'>
              <button>
                <RiUpload2Fill size='1.5rem' />
              </button>
            </Tippy>
            <Tippy delay={[0, 200]} content='Notify' placement='bottom'>
              <button>
                <IoNotifications size='1.5rem' />
              </button>
            </Tippy>
            <Tippy delay={[0, 200]} content='Message' placement='bottom'>
              <button>
                <AiFillMessage size='1.5rem' />
              </button>
            </Tippy>
            <NavLink to='/logout' onClick={handleLogout}>
              <div className='rounded-3xl bg-red-600 px-5 py-2 text-white hover:bg-[#c5001e]'>Logout</div>
            </NavLink>
            <span> {user.data.UserName} </span>
            <NavLink to='/profile/created'>
              <ProfileAvatar />
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to='/login'>
              <div
                onClick={openLoginPopup}
                className='rounded-3xl bg-red-600 px-6 py-2 mr-[-1rem] font-medium text-white hover:bg-[#c5001e]'
              >
                Login
              </div>
            </NavLink>
            <NavLink to='/register'>
              <div
                onClick={openRegisterPopup}
                className='rounded-3xl px-6 py-2 text-dark_color font-medium hover:bg-zinc-300/90 bg-zinc-300/60'
              >
                Sign up
              </div>
            </NavLink>
          </>
        )}

        <Menu items={user ? userMenu : MENU_ITEMS}>
          {user ? (
            <TippyHeadless>
              <img
                className='w-8 h-8 cursor-pointer object-cover rounded-full'
                src='https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.632798143.1705449600&semt=ais'
                alt='avatar'
              />
            </TippyHeadless>
          ) : (
            <>
              <button>
                <FaAngleDown size='1.5rem' style={{ color: 'gray' }} />
              </button>
            </>
          )}
        </Menu>
      </div>
      {/* {showLoginPopup && <Signin onClose={closeLoginPopup} />}
      {showRegisterPopup && <Signup onClose={closeRegisterPopup} />} */}
    </div>
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

export default Navbar
