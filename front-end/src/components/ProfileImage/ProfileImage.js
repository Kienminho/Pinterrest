import React from 'react'

export function ProfileImage({ src, alt, className = '', ...rest }) {
  return <img src={src} alt={alt} className={`w-12 h-12 rounded-full object-cover ${className}`} {...rest} />
}
