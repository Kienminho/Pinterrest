import React, { forwardRef } from 'react'

const InputField = forwardRef(({ id, label, name, type = 'text', placeholder, handleChange }, ref) => {
  return (
    <label htmlFor={id} className='flex flex-col text-dark_color text-md gap-2 capitalize'>
      {label}
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        className='border border-[#cdcdcd] text-gray-900 text-sm block w-full ps-7 p-2.5 rounded-3xl bg-gray-50 focus:ring-blue-300 focus:border-blue-300 outline-none focus:ring-1 shadow-sm'
        onChange={handleChange}
      />
    </label>
  )
})

export default InputField
