import React from 'react'
import { Link } from 'react-router-dom'

export default function MenuItem({ data }) {
  return (
    <Link className='btn-basic block' to={data.to}>
      {data.title}
    </Link>
  )
}
