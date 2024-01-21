import { Link } from 'react-router-dom'
import React from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { FaSearch } from 'react-icons/fa'


const Navbar = () => {
  return (
    <div className='w-full z-50 fixed flex justify-between items-center px-5 py-4 h-20 bg-zinc-100'>
      {/* left hand side */}
      <div className='flex justify-evenly items-center space-x-4'>
        <span className='flex items-center space-x-1'>
          <img src='./pinterest-logo.png' className='w-8 h-8' alt='pinterest' />
          <span className='text-red-600 text-xl font-medium'>Pinterest</span>
        </span>
        <div className='flex items-center text-base font-medium space-x-4'>
          <Link className='rounded-md p-2 hover:bg-zinc-300/70' href='/today'>
            Today
          </Link>
          <Link className='rounded-md p-2 hover:bg-zinc-300/70' href='/watch'>
            Watch
          </Link>
          <Link className='rounded-md p-2 hover:bg-zinc-300/70' href='/explore'>
            Explore
          </Link>
        </div>
      </div>

      {/* search bar */}
      {/* search bar */}
      <form>
        <FaSearch />
        <input type='text' placeholder='Search...' className='border border-gray-300 p-2 rounded-md' />
        <button>
          <IoCloseSharp size='1.5rem' />
        </button>
        <AiOutlineLoading3Quarters />
      </form>

      {/* right hand side */}
      <div className='flex items-center space-x-2'>
        <div className='flex items-center text-base font-medium space-x-4 mr-6'>
          <Link className='p-2 rounded-md hover:bg-zinc-300/70' href='/about'>
            Giới thiệu
          </Link>
          <Link className='p-2 rounded-md hover:bg-zinc-300/70' href='/business'>
            Doanh nghiệp
          </Link>
          <Link className='p-2 rounded-md hover:bg-zinc-300/70' href='/blog'>
            Blog
          </Link>
        </div>
        <div className='flex items-center font-medium space-x-2'>
          <button className='btn-red'>Đăng nhập</button>
          <button className='bg-gray-300 hover:bg-zinc-400 px-3 py-2 rounded-full text-black'>Đăng ký</button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
