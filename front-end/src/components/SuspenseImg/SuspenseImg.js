import './SuspenseImg.css'
import React, { useEffect, useState } from 'react'

const SuspenseImg = ({ src, height, alt, className, fileName }) => {
  const [loading, setLoading] = useState(true)

  const handleImageLoad = () => {
    setLoading(false)
  }
  useEffect(() => {
    console.log(loading)
  }, [loading])

  return (
    <div>
      {loading && <ImgPlaceHolder height={height} />}
      {fileName && src && (
        <img src={src} alt={alt} onLoad={handleImageLoad} className={`${className}  ${loading ? 'h-0' : 'h-auto'}`} />
      )}
    </div>
  )
}

const ImgPlaceHolder = ({ height = 350 }) => {
  return <div className={'w-full shimmer-bg'} style={{ height: height + 'px' }}></div>
}

export default SuspenseImg
