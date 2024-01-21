import { Link } from 'react-router-dom'
import { FaAngleDown } from 'react-icons/fa'
import { RiUpload2Fill } from 'react-icons/ri'
import { IoNotifications } from 'react-icons/io5'
import { FaPinterest } from 'react-icons/fa'
import { AiFillMessage } from 'react-icons/ai'
import 'tippy.js/dist/tippy.css'
import Tippy from '@tippyjs/react/'
import TippyHeadless from '@tippyjs/react/headless'
import routesConfig from '../../../../config/routes'
import Menu from '../../../Popper/Menu'
import Search from '../Search'

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

const Header = () => {
  const currentUser = true

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

  return (
    <div className='w-full z-50 fixed flex justify-between items-center px-5 py-4 h-20'>
      {/* left hand side */}
      <div className='flex justify-evenly items-center space-x-4'>
        <Link to={routesConfig.home} className='flex items-center space-x-1'>
          <FaPinterest size='1.5rem' style={{ color: 'red' }} />
          <span className='text-red-600 text-xl font-medium'>Pinterest</span>
        </Link>
        <div className='flex items-center text-base font-medium space-x-4'>
          <Link className='px-3 py-2 rounded-2xl hover:bg-zinc-300/70' href='/today'>
            Today
          </Link>
          <Link className='px-3 py-2 rounded-2xl hover:bg-zinc-300/70' href='/watch'>
            Watch
          </Link>
          <Link className='px-3 py-2 rounded-2xl hover:bg-zinc-300/70' href='/explore'>
            Explore
          </Link>
        </div>
      </div>

      {/* search bar */}
      <Search />

      <div className='flex justify-evenly items-center font-medium space-x-6'>
        {/* right hand side */}
        {currentUser ? (
          <>
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
          </>
        ) : (
          <>
            <Link className='btn-red'>Đăng nhập</Link>
            <Link className='btn-gray rounded-full text-black'>Đăng ký</Link>
          </>
        )}
        <Menu items={currentUser ? userMenu : MENU_ITEMS}>
          {currentUser ? (
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
    </div>
  )
}

export default Header
