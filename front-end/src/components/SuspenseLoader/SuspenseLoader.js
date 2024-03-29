import React, { Suspense } from 'react'
import { HashLoader } from 'react-spinners'

const SuspenseLoader = ({ children }) => {
  return (
    <>
      <Suspense fallback={<HashLoaderWapper />}>{children}</Suspense>
    </>
  )
}
const HashLoaderWapper = () => {
  return (
    <div className='flex justify-center my-8'>
      <HashLoader
        color='#ffffff'
        size={18}
        speedMultiplier={1.2}
        cssOverride={{
          'background-color': '#5f5f5f',
          'border-radius': '50%',
          padding: '20px'
        }}
      />
    </div>
  )
}

export default SuspenseLoader
