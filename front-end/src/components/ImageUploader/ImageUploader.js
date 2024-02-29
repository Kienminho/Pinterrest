import { useRef, useState } from 'react'
import { GrUploadOption as UploadIcon } from 'react-icons/gr'

const ImageUploader = ({ setFile }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [imageHeight, setImageHeight] = useState(null)

  const inputRef = useRef(null)
  const previewImg = useRef(null)

  const selectFile = () => {
    inputRef.current.click()
  }

  // to modify container height
  const getImageHeight = () => {
    const heightImg = previewImg.current.offsetHeight
    setImageHeight(heightImg)
  }

  const onDropIn = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    // check whether file is image or not
    if (file.type.startsWith('image/')) {
      setFile(file)
      setSelectedFile(file)
      console.log('drop img done!', file)
    } else {
      setFile(null)
      setSelectedFile(null)
      console.log('dropped file is not an image')
    }
  }

  const onDragOut = (event) => {
    event.preventDefault()
    console.log('image has been dragged!')
  }

  return (
    <>
      <div
        className={`img-Uploader bg-[#e9e9e9] w-[26rem] max-sm:w-auto rounded-3xl border-dashed border-gray-300 hover:border-[#929292] border-2 cursor-pointer overflow-hidden relative ${
          // check if not image, set default height
          selectedFile && imageHeight ? `h-[${imageHeight}]` : 'h-[32rem] max-sm:h-[25rem]'
        }`}
        onClick={selectFile}
        onDrop={onDropIn}
        onDragOver={onDragOut}
      >
        <div className='flex flex-col justify-center items-center h-full pointer-events-none'>
          {selectedFile ? (
            <img
              className='w-full'
              ref={previewImg}
              src={URL.createObjectURL(selectedFile)}
              alt='preview-img-upload'
              onLoad={getImageHeight}
            />
          ) : (
            <>
              <UploadIcon size='2.5rem' className='rounded-full' />
              <span className='text-center font-normal text-base pointer-events-none break-words max-w-[250px] mt-3'>
                Chọn một tệp hoặc kéo và thả tệp ở đây
              </span>
            </>
          )}
        </div>
        {/* Muốn chọn ảnh khác */}
        {selectedFile && (
          <div className='flex items-center justify-center  flex-col w-full h-full z-20 bg-[#ffffff8f] absolute opacity-0 hover:opacity-100 top-0'>
            <UploadIcon size='2rem' />
            <h4 className='text-center pointer-events-none break-words max-w-[210px]'>Chọn file ảnh khác</h4>
          </div>
        )}
        <input
          type='file'
          accept='image/*'
          name='upload_file'
          onChange={(e) => {
            setSelectedFile(e.target.files[0])
            setFile(e.target.files[0])
          }}
          hidden
          multiple={false}
          ref={inputRef}
        />
      </div>
    </>
  )
}

export default ImageUploader
