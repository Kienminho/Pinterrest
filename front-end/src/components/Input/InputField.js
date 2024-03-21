import React, { forwardRef } from 'react'

const InputField = forwardRef(
  ({ id, label, name, value, type = 'text', placeholder, handleChange, className }, ref) => {
    return (
      <label htmlFor={id} className='flex flex-col  text-white text-base font-medium gap-2 capitalize'>
        {label}
        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          className={`border-[#cdcdcd] ps-5 text-base border-none rounded-xl  font-normal  w-full bg-[#334155] resize-none outline-none p-3 px-4 py-3 text-[#ffffff] w-full placeholder:text-[#ffffffb3] ${className}`}
          onChange={handleChange}
        />
      </label>
    )
  }
)

export default InputField
