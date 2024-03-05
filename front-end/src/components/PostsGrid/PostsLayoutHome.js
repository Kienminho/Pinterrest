import { Spin } from 'antd'
import React from 'react'

const PostsLayoutHome = ({ children, loading }) => {
  return (
    <>
      {loading ? (
        <div className='xl:columns-5 lg:columns-4 md:columns-3 sm:columns-2 sm:mx-auto xl:w-[1280px] lg:w-[1024px] md:w-[768px] sm:w-[640px] columns-2 mx-3 mb-20 max-sm:gap-2'>
          {children}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center gap-3 font-medium text-center text-lg text-[#767676]'>
          <span className='w-72'>Chúng tôi đang cá nhân hoá bảng tin của bạn, vui lòng đợi...</span>
          <Spin size='large' />
        </div>
      )}
    </>
  )
}

export default PostsLayoutHome
