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
import './Create.css'
import toast from 'react-hot-toast'

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
  const [loadingAI, setLoadingAI] = useState(false)
  const [loadingPostAI, setLoadingPostAI] = useState(false)
  const handleUploadType = (type) => {
    setUploadType(type)
    setFile('')
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
      setLoading(true)
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
      if (res.statusCode === 200) {
        toast.success('Tạo bài đăng thành công')
        navigate('/')
        setLoading(false)
      } else {
        toast.error('Tạo bài đăng thất bại')
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error('Lỗi khi tạo bài đăng:', error.message)
    }
  }

  const handlePostCreateAI = async () => {
    try {
      setLoadingPostAI(true)
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
      if (res.statusCode === 200) {
        toast.success('Tạo bài đăng thành công')
        navigate('/')
        setLoadingPostAI(false)
      } else {
        toast.error('Tạo bài đăng thất bại')
        setLoadingPostAI(false)
      }
    } catch (error) {
      console.error('Lỗi khi tạo bài đăng:', error.message)
      setLoadingPostAI(false)
    }
  }

  const handleResetPrompt = () => {
    setPrompt('')
    setFile('')
    inputRef.current.focus()
  }

  const handleGenerateImage = async () => {
    try {
      setLoadingAI(true)
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
      if (res.data.statusCode === 200) {
        const generatedImageLink = res.data.data
        setFile(generatedImageLink)
        setLoadingAI(false)
      } else {
        setLoadingAI(false)
      }
    } catch (error) {
      setLoadingAI(false)
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
          <div className='upload-option flex flex-col md:flex-row justify-center items-center gap-4'>
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
        <div className='pin-form mt-12 max-sm:m-5 px-8 md:px-16 flex justify-center gap-12 max-sm:gap-5 max-sm:flex-col w-full'>
          <div className='upload-field flex flex-col gap-8'>
            {uploadType === 'AI' && (
              <ImageUploaderAI imgSrc={file} loadingAI={loadingAI} loadingPostAI={loadingPostAI} />
            )}
            {uploadType === 'Normal' && (
              <ImageUploader setFile={(selectedFile) => setFile(selectedFile)} loading={loading} />
            )}
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

            <div className='title-input flex flex-col'>
              <InputField
                name={'Title'}
                id={'pinTitle'}
                handleChange={handleChange}
                label={'Tiêu đề'}
                placeholder='Thêm tiêu đề...'
              />
            </div>
            <div className='desc-input flex flex-col'>
              <label className='text-[#111111] text-base font-medium mb-2 capitalize'>Mô tả </label>
              <textarea
                type='text'
                name='Description'
                id='pinDesc'
                rows={4}
                placeholder='Thêm mô tả chi tiết'
                className='border-[#cdcdcd] placeholder:text-gray-400 px-4 py-2 ps-5 text-base text-gray-900 rounded-xl bg-gray-50 hover:ring-indigo-300 focus:ring-indigo-400 focus:border-indigo-400 focus:border-1 focus:ring-1 resize-none font-normal outline-none block w-full border-1'
                onChange={handleChange}
              />
            </div>

            <div className='flex gap-3 items-center'>
              <span className='font-medium'>Cho phép bình luận</span>
              <ToggleSwitch color='indigo' checked={allowComment} onChange={handleToggleSwitchChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Create
