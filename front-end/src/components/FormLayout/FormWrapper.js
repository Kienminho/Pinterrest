import React from 'react'

const FormWrapper = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen bg-cover bg-center'>
      <div className='form-container flex justify-center my-12 max-sm:my-0'>
        <div
          className='auth-form w-[500px] max-sm:w-full bg-white py-7 px-3 rounded-[32px] max-sm:rounded-none max-sm:min-h-screen max-sm:pt-20'
          style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', filter: 'brightness(1)' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default FormWrapper
