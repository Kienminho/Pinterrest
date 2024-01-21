import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function AccountItem({ data }) {
  return (
    <Link to={`/@${data.nickname}`} className='flex items-center py-2 px-4 cursor-pointer hover:bg-gray-100'>
      <img className='w-10 h-10 rounded-full object-cover' src={data.avatar} alt='{data.full_name}' />
      <div className='flex-1 ml-3'>
        <h4 className='font-medium text-lg flex items-center'>
          <span>{data.full_name}</span>
          {data.tick && <FaCheckCircle size='1rem' style={{ marginLeft: '6px', color: 'skyblue' }} />}
        </h4>
        <span className='text-gray-500'>{data.nickname}</span>
      </div>
    </Link>
  )
}
