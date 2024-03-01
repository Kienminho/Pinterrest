import { Spin } from 'antd'
import { Spinner } from 'flowbite-react'
import { useRef, useState } from 'react'
import { GrUploadOption as UploadIcon } from 'react-icons/gr'

const ImageUploaderAI = ({ imgSrc, loading }) => {
  const [imageHeight, setImageHeight] = useState(null)

  const previewImg = useRef(null)

  // to modify container height
  const getImageHeight = () => {
    const heightImg = previewImg.current.offsetHeight
    setImageHeight(heightImg)
  }

  const onDragOut = (event) => {
    event.preventDefault()
    console.log('image has been dragged!')
  }

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
          {imgSrc ? (
            <img className='w-full' ref={previewImg} src={imgSrc} alt='preview-img-upload' onLoad={getImageHeight} />
          ) : (
            <>
              {loading ? (
                <div className='flex flex-col items-center justify-center gap-3'>
                  <span className=''>Đang tạo ảnh, vui lòng đợi...</span>
                  {/* <Spinner color='gray' aria-label='Spinner button' size='xl' /> */}
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
    </>
  )
}

export default ImageUploaderAI
