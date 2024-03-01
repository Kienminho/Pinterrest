import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ImageUploader from '../../components/ImageUploader/ImageUploader'
import InputField from '../../components/Input/InputField'
import axios from 'axios'

import { ToggleSwitch } from 'flowbite-react'
import { createPostAI, uploadFilesAndCreatePost } from '../../store/apiRequest'
import { useDispatch, useSelector } from 'react-redux'
import { createAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'
import ImageUploaderAI from '../../components/ImageUploaderAI/ImageUploaderAI'

const Create = () => {
  const user = useSelector((state) => state.Auth.login?.currentUser)
  const inputRef = useRef()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  let axiosJWT = createAxios(user, dispatch, loginSuccess)

  const accessToken_daniel = user?.data?.AccessToken
  const container = useRef()

  const [allowComment, setAllowComment] = useState(true)

  const [file, setFile] = useState(null)
  const [fileInfo, setFileInfo] = useState({
    Title: '',
    Description: ''
  })

  const [prompt, setPrompt] = useState('')

  const [underUpload, setUnderUpload] = useState(false)
  const [uploadType, setUploadType] = useState('Normal')
  const [loading, setLoading] = useState(false)
  const handleUploadType = (type) => {
    setUploadType(type)
  }

  // Xử lý khi người dùng thay đổi ToggleSwitch
  const handleToggleSwitchChange = (newValue) => {
    setAllowComment(newValue)
  }

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

  const handlePostCreate = async () => {
    try {
      const postBody = {
        Title: fileInfo.Title,
        Description: fileInfo.Description,
        Attachment: {
          Id: '',
          Thumbnail: ''
        },
        IsComment: allowComment
      }
      console.log(postBody)
      const res = await uploadFilesAndCreatePost([file], postBody, dispatch, navigate, accessToken_daniel, axiosJWT)
      console.log(res)
    } catch (error) {
      console.error('Failed to create post:', error.message)
    }
  }

  const handlePostCreateAI = async () => {
    try {
      const postBody = {
        Title: fileInfo.Title,
        Description: fileInfo.Description,
        Attachment: {
          Id: '',
          Thumbnail: ''
        },
        IsComment: allowComment
      }
      console.log(postBody)
      const res = await createPostAI(file, postBody, dispatch, navigate, accessToken_daniel, axiosJWT)
      console.log(res)
    } catch (error) {
      console.error('Failed to create post:', error.message)
    }
  }

  const handleResetPrompt = () => {
    setPrompt('')
    setFile(null)
    inputRef.current.focus()
  }

  const handleGenerateImage = async () => {
    try {
      setLoading(true)
      // Send request to backend to generate image based on text input
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/ai/create-image-from-text`,
        {
          text: prompt
        },
        {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        }
      )
      console.log(res.data.data)
      const generatedImageLink = res.data.data
      setFile(generatedImageLink)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error('Failed to generate image:', error.message)
    }
  }

  return (
    <div
      className='create-wrapper flex flex-col w-full minus-nav-100vh '
      ref={container}
      onDrop={preventDefault}
      onDragOver={preventDefault}
    >
      <div className='pin-creator max-sm:mx-0 max-sm:mt-0 max-sm:w-full max-sm:h-auto pb-10 max-sm:flex max-sm:flex-col max-sm:rounded-none bg-white'>
        <div className='flex items-center justify-between border-b border-gray-300 py-5 px-7'>
          <span className='font-medium text-xl text-dark_color'>Tạo ghim</span>
          <div className='upload-option flex justify-center items-center gap-4'>
            <button
              onClick={() => handleUploadType('AI')}
              className='box-border relative z-30 inline-flex items-center justify-center w-auto px-8 py-2.5 overflow-hidden font-medium text-white transition-all duration-300 bg-purple_btn rounded-md cursor-pointer group focus:ring-2 focus:ring-indigo-400  ease focus:outline-none hover:bg-[#5850e9]'
            >
              <span class='absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0'></span>
              <span class='absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0'></span>
              <span class='relative z-20 flex items-center'>
                <svg
                  class='relative w-5 h-5 mr-2 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M13 10V3L4 14h7v7l9-11h-7z'
                  ></path>
                </svg>
                Tạo ảnh bằng AI
              </span>
            </button>
            <button
              className='btn-chosen-normal bg-blue-50 hover:bg-blue-100 hover:text-blue-600 text-blue-500 focus:ring-2 focus:ring-blue-400'
              onClick={() => handleUploadType('Normal')}
            >
              Tải lên ảnh của bạn
            </button>
          </div>
          <div className='upload-button'>
            {uploadType === 'AI' ? (
              <button className='btn-upload' disabled={underUpload} onClick={handlePostCreateAI}>
                Đăng
              </button>
            ) : (
              <button className='btn-upload' disabled={underUpload} onClick={handlePostCreate}>
                Đăng
              </button>
            )}
          </div>
        </div>

        {/* <FileUpload/> */}
        <div className='pin-form m-12 max-sm:m-5 px-48 flex justify-center gap-12 max-sm:gap-5 max-sm:flex-col w-full'>
          <div className='upload-field flex flex-col gap-8'>
            {uploadType === 'AI' && <ImageUploaderAI imgSrc={file} loading={loading} />}
            {uploadType === 'Normal' && <ImageUploader setFile={(selectedFile) => setFile(selectedFile)} />}
          </div>
          <div className='pin-details-inputs mt-1 w-[36rem] max-sm:w-auto gap-6 flex flex-col max-sm:gap-3'>
            {uploadType === 'AI' && (
              <div className='prompt-input'>
                <InputField
                  ref={inputRef}
                  name={'prompt'}
                  id={'prompt'}
                  value={prompt}
                  handleChange={(e) => setPrompt(e.target.value)}
                  placeholder='Nhập mô tả ảnh.. ( nếu muốn tạo ảnh AI )'
                  label={'Prompt Tạo ảnh AI'}
                />
                <div className='flex justify-evenly gap-3'>
                  <button
                    className='btn-chosen-normal bg-red-100 hover:bg-red-200 hover:text-red-600 text-red-500 focus:ring-2 focus:ring-red-400 mt-4 w-[70%]'
                    onClick={handleGenerateImage}
                  >
                    Tạo ảnh AI
                  </button>
                  <button
                    className='btn-chosen-normal bg-gray-100 hover:bg-gray-200 hover:text-gray-600 text-gray-500 focus:ring-2 focus:ring-gray-400 mt-4 w-[30%]'
                    onClick={handleResetPrompt}
                  >
                    Tạo ảnh khác
                  </button>
                </div>
              </div>
            )}

            <InputField
              name={'Title'}
              id={'pinTitle'}
              handleChange={handleChange}
              label={'Tiêu đề'}
              placeholder='Thêm tiêu đề'
            />
            <label htmlFor='pinDesc' className='flex flex-col text-[#111111] text-base gap-2 font-medium'>
              Mô tả
              <textarea
                type='text'
                name='Description'
                id='pinDesc'
                rows={3}
                placeholder='Thêm mô tả chi tiết'
                className='border-[#cdcdcd] placeholder:text-gray-400 px-4 py-2 ps-5 text-base text-gray-900 rounded-3xl bg-gray-50 focus:ring-blue-300 focus:border-blue-300 outline-none border focus:border-1 focus:ring-1 resize-none font-normal'
                onChange={handleChange}
              />
            </label>

            <ToggleSwitch
              color='indigo'
              checked={allowComment}
              label='Cho phép bình luận'
              onChange={handleToggleSwitchChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Create
