import { Image, Spin } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { GrUploadOption as UploadIcon } from 'react-icons/gr'

const ImageUploaderAI = ({ imgSrc: propImgSrc, loadingAI, loadingPostAI }) => {
  const [imageHeight, setImageHeight] = useState(null)
  const [previousImages, setPreviousImages] = useState([])
  const [imgSrc, setImgSrc] = useState(propImgSrc) // Sử dụng useState để quản lý imgSrc

  const previewImg = useRef(null)

  // to modify container height
  const getImageHeight = () => {
    const heightImg = previewImg.current.offsetHeight
    setImageHeight(heightImg)
  }

  // Function to handle click on previous image
  const handlePreviousImageClick = (imageURL) => {
    setImgSrc(imageURL) // Cập nhật imgSrc khi click vào hình ảnh trước đó
  }

  const onDragOut = (event) => {
    event.preventDefault()
    console.log('image has been dragged!')
  }

  // Function to render previous images
  const renderPreviousImages = () => {
    return (
      <>
        <h5>Chọn lại ảnh trước đó, (lưu tối đa 3 ảnh)</h5>
        <div className='flex gap-2 justify-around'>
          {previousImages.map((imageURL, index) => (
            <div className='rounded-3xl ring-2 hover:ring-indigo-400 hover:ring-4 '>
              <img
                key={index}
                className='w-32 h-32 object-cover rounded-3xl cursor-pointer'
                src={imageURL}
                alt='preview-img-upload'
                onClick={() => handlePreviousImageClick(imageURL)}
              />
            </div>
          ))}
        </div>

        <h5>Chọn xem preview ảnh trước đó</h5>
        <div className='flex gap-2 justify-around'>
          {previousImages.map((imageURL, index) => (
            <Image
              key={index}
              width={120}
              height={120}
              className='rounded-3xl'
              src={imageURL}
              alt='preview-img-upload'
              preview={true}
            />
          ))}
        </div>
      </>
    )
  }

  // Add the generated image to previousImages array when imgSrc changes
  useEffect(() => {
    if (propImgSrc) {
      setImgSrc(propImgSrc)
      setPreviousImages([propImgSrc, ...previousImages.slice(0, 2)])
    }
  }, [propImgSrc])

  return (
    <>
      <div
        className={`img-Uploader bg-[#e9e9e9] w-[26rem] max-sm:w-auto rounded-3xl border-dashed border-indigo-300 hover:border-indigo-400 border-2 cursor-pointer overflow-hidden relative ${
          // check if not image, set default height
          imgSrc && imageHeight ? `h-[${imageHeight}]` : 'h-[32rem] max-sm:h-[25rem]'
        }`}
        onDragOver={onDragOut}
      >
        <div className='flex flex-col justify-center items-center h-full pointer-events-none'>
          {loadingPostAI && (
            <div className='flex flex-col gap-3 items-center justify-center absolute inset-0 bg-white bg-opacity-70'>
              <span className=''>Đang tạo bài viết, vui lòng đợi...</span>
              <Spin size='large' />
            </div>
          )}
          {imgSrc ? (
            <img className='w-full' ref={previewImg} src={imgSrc} alt='preview-img-upload' onLoad={getImageHeight} />
          ) : (
            <>
              {loadingAI ? (
                <div className='flex flex-col items-center justify-center gap-3'>
                  <span className=''>Đang tạo ảnh, vui lòng đợi...</span>
                  <Spin size='large' />
                </div>
              ) : (
                <>
                  <UploadIcon size='2.5rem' className='rounded-full' />
                  <span className='text-center font-normal text-base pointer-events-none break-words max-w-[250px] mt-3'>
                    Ảnh tạo bằng AI sẽ xuất hiện ở đây
                  </span>
                </>
              )}
            </>
          )}
        </div>
      </div>
      {/* Render previous images */}
      {previousImages.length > 0 && renderPreviousImages()}
    </>
  )
}

export default ImageUploaderAI
