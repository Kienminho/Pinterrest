import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ImageUploader from '../../components/ImageUploader/ImageUploader'
import InputField from '../../components/Input/InputField'
import axios from 'axios'

const Create = () => {
  const navigate = useNavigate()
  const container = useRef()

  const [file, setFile] = useState(null)
  const [fileInfo, setFileInfo] = useState({
    pinTitle: '',
    pinDesc: '',
    pinLink: '',
    pinTopic: ''
  })

  const [underUpload, setUnderUpload] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFileInfo((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const preventDefault = (event) => {
    event.preventDefault()
  }

  // const uploadHandler = async () => {
  //   try {
  //     setUnderUpload(true)
  //     if (!file) {
  //       // setErrorMsg('Please select a file.')
  //       console.log('Please select a file.')
  //       return
  //     }

  //     if (!fileInfo.pinTitle || !fileInfo.pinDesc || !fileInfo.pinTopic) {
  //       // setErrorMsg('Title and Description are required.')
  //       console.log('Title and Description are required.')
  //       return
  //     }
  //     const formData = new FormData()
  //     // console.log(formData);

  //     //appendin img file
  //     formData.append('upload_file', file)

  //     //appending image meta data or additionals
  //     formData.append('pinTitle', fileInfo.pinTitle)
  //     formData.append('pinDescription', fileInfo.pinDescription)

  //     const response = await axios.post('image/upload', formData)
  //     // const resJson = await response.json();

  //     if (response.status === 200) {
  //       // console.log("Upload.js", resJson);
  //       console.log(response.data.message)
  //       // toast.success('post created successfully')
  //       navigate('/')
  //     } else {
  //       // toast.error('post creation failed: please check your connection')
  //       console.log(response.data.message)
  //     }
  //   } catch (error) {
  //     // toast.error('Oops! Something went wrong.')
  //     console.log('Failed to upload', error)
  //   } finally {
  //     setUnderUpload(false)
  //   }
  // }

  // useEffect(() => {
  //   // console.log(file);
  //   // console.log(fileMetadata);
  //   console.log(underUpload)
  // }, [underUpload])

  return (
    <div
      className='create-wrapper flex flex-col w-full minus-nav-100vh bg-slate-50'
      ref={container}
      onDrop={preventDefault}
      onDragOver={preventDefault}
    >
      <div className='pin-creator shadow-[rgba(0,0,0,0.1)_0px_1px_20px_0px] rounded-2xl mx-auto max-sm:mx-0 mt-12 max-sm:mt-0 max-sm:w-full max-sm:h-auto pb-20 max-sm:flex max-sm:flex-col max-sm:rounded-none bg-white'>
        {/* <FileUpload/> */}
        <div className='pin-form m-12 max-sm:m-5 flex gap-10 max-sm:gap-5 max-sm:flex-col '>
          <div className='upload-field'>
            <ImageUploader setFile={(selectedFile) => setFile(selectedFile)} />
          </div>
          <div className='pin-detls-inputs mt-1 w-[36rem] max-sm:w-auto gap-6 flex flex-col max-sm:gap-3'>
            <InputField
              name={'pinTitle'}
              id={'pinTitle'}
              handleChange={handleChange}
              label={'Title'}
              placeholder='Add a title'
            />
            <label htmlFor='pinDesc' className='flex flex-col text-[#111111] text-base gap-2'>
              Description
              <textarea
                type='text'
                name='pinDescription'
                id='pinDesc'
                rows={3}
                placeholder='Add a detailed description'
                className='border-[#cdcdcd] resize-none px-4 py-2 ps-5 text-base text-gray-900 rounded-3xl bg-gray-50 focus:ring-blue-300 focus:border-blue-300 outline-none border focus:border-2 focus:ring-1'
                onChange={handleChange}
              />
            </label>
            <InputField
              name={'pinLink'}
              id={'pinLink'}
              handleChange={handleChange}
              label={'Link'}
              placeholder='Add a link'
            />
            <InputField
              name={'pinTopic'}
              id={'pinTopic'}
              handleChange={handleChange}
              label={'Tagged Topic'}
              placeholder='Add a tag'
            />
            <div className='pin-prime-btn flex'>
              {/* <button disabled={underUpload} onClick={uploadHandler}>
                Publish
              </button> */}
              <button className='btn-save' disabled={underUpload}>
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Create
