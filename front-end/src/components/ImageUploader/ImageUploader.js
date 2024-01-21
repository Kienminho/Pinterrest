import { useRef, useState } from 'react'
import { UploadIcon } from '../Icon/UploadIcon'

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
        className={`img-Uploader bg-[#e9e9e9] w-[24rem] max-sm:w-auto rounded-3xl border-dashed border-[#dadada]  hover:border-[#929292] border-2 cursor-pointer overflow-hidden relative ${
          // check if not image, set default height
          selectedFile && imageHeight ? `h-[${imageHeight}]` : 'h-[28rem] max-sm:h-[23rem]'
        }`}
        onClick={selectFile}
        onDrop={onDropIn}
        onDragOver={onDragOut}
      >
        <div className='flex flex-col justify-center items-center h-full pointer-events-none'>
          {selectedFile ? (
            <img
              className=' w-full '
              ref={previewImg}
              src={URL.createObjectURL(selectedFile)}
              alt='preview-img-upload'
              onLoad={getImageHeight}
            />
          ) : (
            <>
              <UploadIcon width={26} />
              <h3 className='text-center pointer-events-none break-words max-w-[210px]'>
                Choose a file or drag and drop it here
              </h3>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default ImageUploader
