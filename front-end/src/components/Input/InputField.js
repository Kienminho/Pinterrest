import React, { forwardRef } from 'react'

const InputField = forwardRef(({ id, label, name, type = 'text', placeholder, handleChange }, ref) => {
  return (
    <label htmlFor={id} className='flex flex-col text-dark_color text-base font-medium gap-2 capitalize'>
      {label}
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        className='ps-7 rounded-3xl bg-gray-50 outline-none block w-full border-0 py-3 text-dark_color shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:font-normal focus:ring-inset focus:ring-[#818cf8] focus:ring-2 font-normal'
        onChange={handleChange}
      />
    </label>
  )
})

export default InputField
