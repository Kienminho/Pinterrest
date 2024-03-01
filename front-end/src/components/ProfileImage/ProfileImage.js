import React from 'react'

export function ProfileImage({ src, alt, className = '', ...rest }) {
  return (
    <img src={src} alt={alt} className={`min-h-full min-w-full rounded-full object-cover ${className}`} {...rest} />
  )
}
