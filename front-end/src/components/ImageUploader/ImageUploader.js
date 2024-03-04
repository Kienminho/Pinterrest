import { Image, Spin } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { GrUploadOption as UploadIcon } from 'react-icons/gr'

const ImageUploader = ({ setFile, loading }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [imageHeight, setImageHeight] = useState(null)
  const [previousImages, setPreviousImages] = useState([])
  const [previousFiles, setPreviousFiles] = useState([])

  console.log(previousImages)
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
      setPreviousImages([...previousImages, URL.createObjectURL(file)])
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

  const handlePreviousImageClick = (imageURL, event) => {
    console.log(event)
    setPreviousImages(previousImages.filter((image) => image !== imageURL))
    setPreviousImages([imageURL, ...previousImages.filter((image) => image !== imageURL).slice(0, 2)])
    setPreviousFiles(previousFiles.filter((file) => file !== selectedFile))
    setPreviousFiles([selectedFile, ...previousFiles.filter((file) => file !== selectedFile).slice(0, 2)])
    setSelectedFile(previousFiles[2])
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    setFile(file)
    setSelectedFile(file)
    setPreviousImages([URL.createObjectURL(file), ...previousImages])
    setPreviousFiles([...previousFiles, file])
  }

  console.log(selectedFile)
  console.log(previousFiles)

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
                onClick={(event) => handlePreviousImageClick(imageURL, event)} // Thêm event vào đây
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
          {loading && (
            <div className='flex flex-col gap-3 items-center justify-center absolute inset-0 bg-white bg-opacity-70'>
              <span className=''>Đang tạo bài viết, vui lòng đợi...</span>
              <Spin size='large' />
            </div>
          )}
          {selectedFile && previousImages.length === 0 ? (
            <img
              ref={previewImg}
              src={URL.createObjectURL(selectedFile)}
              alt='preview-img-upload'
              onLoad={getImageHeight}
            />
          ) : selectedFile && previousImages.length >= 1 ? (
            <img ref={previewImg} src={previousImages[0]} alt='preview-img-upload' onLoad={getImageHeight} />
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
          onChange={handleFileInputChange}
          hidden
          multiple={false}
          ref={inputRef}
        />
      </div>
      {/* Render previous images */}
      {previousImages.length > 0 && renderPreviousImages()}
    </>
  )
}

export default ImageUploader
