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
        className='px-4 py-2 ps-5 text-base text-gray-900 border-[#cdcdcd] rounded-3xl bg-gray-50 focus:ring-blue-300 focus:border-blue-300 outline-none border focus:border-2 focus:ring-1'
        onChange={handleChange}
      />
    </label>
  )
})

export default InputField
