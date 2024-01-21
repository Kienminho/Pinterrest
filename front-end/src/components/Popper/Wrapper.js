import React from 'react'

export default function Wrapper({ children }) {
  return (
    <div className='w-full max-h-[min((100vh_-_96px),734px)] min-h-[100px] shadow-[rgb(0_0_0_/_12%)_0px_2px_12px] pt-2 rounded-lg'>
      {children}
    </div>
  )
}
