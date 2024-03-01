import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { LoadingContext } from '../../page/Profile/Profile'
import { Spin } from 'antd'

const PostsLayout = ({ children, postsCount, fallback }) => {
  const loading = useContext(LoadingContext)
  return (
    <>
      {loading ? (
        postsCount > 0 ? (
          <div className='xl:columns-5 lg:columns-4 md:columns-3 sm:columns-2 sm:mx-auto xl:w-[1280px] lg:w-[1024px] md:w-[768px] sm:w-[640px] columns-2 mx-3 mb-20 max-sm:gap-2'>
            {children}
          </div>
        ) : (
          <div className='flex flex-col gap-3 items-center'>
            {fallback}
            <NavLink to='/create'>
              <button className='btn-save px-3.5 py-2.5'>Tạo ghim</button>
            </NavLink>
          </div>
        )
      ) : (
        <div className='flex flex-col items-center justify-center gap-3'>
          <span className=''>Đang tải dữ liệu, vui lòng đợi...</span>
          {/* <Spinner color='gray' aria-label='Spinner button' size='xl' /> */}
          <Spin size='large' />
        </div>
      )}
    </>
  )
}

export default PostsLayout
