import React from 'react'

const InputField = ({ id, label, name, type = 'text', handleChange }) => {
  return (
    <label htmlFor={id} className='flex flex-col text-dark_color text-md gap-2 capitalize'>
      {label}
      <input
        id={id}
        name={name}
        type={type}
        className='px-4 py-2 ps-5 text-base text-gray-900 border-2 border-[#cdcdcd] rounded-3xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none'
        onChange={handleChange}
      />
    </label>
  )
}

export default InputField
