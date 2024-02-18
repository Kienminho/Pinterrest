import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ImageUploader from '../../components/ImageUploader/ImageUploader'
import InputField from '../../components/Input/InputField'
import axios from 'axios'

import { ToggleSwitch } from 'flowbite-react'
import { uploadFilesAndCreatePost } from '../../store/apiRequest'
import { useDispatch, useSelector } from 'react-redux'
import { createAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'

const Create = () => {
  const user = useSelector((state) => state.Auth.login?.currentUser)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  let axiosJWT = createAxios(user, dispatch, loginSuccess)

  const accessToken_daniel = user?.data?.AccessToken
  const container = useRef()

  const [switch1, setSwitch1] = useState(true)
  const [allowComment, setAllowComment] = useState(true)

  const [file, setFile] = useState(null)
  const [fileInfo, setFileInfo] = useState({
    Title: '',
    Description: '',
    pinLink: ''
  })

  const [underUpload, setUnderUpload] = useState(false)

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
              name={'Title'}
              id={'pinTitle'}
              handleChange={handleChange}
              label={'Title'}
              placeholder='Add a title'
            />
            <label htmlFor='pinDesc' className='flex flex-col text-[#111111] text-base gap-2'>
              Description
              <textarea
                type='text'
                name='Description'
                id='pinDesc'
                rows={3}
                placeholder='Add a detailed description'
                className='border-[#cdcdcd] px-4 py-2 ps-5 text-base text-gray-900 rounded-3xl bg-gray-50 focus:ring-blue-300 focus:border-blue-300 outline-none border focus:border-1 focus:ring-1'
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
            {/* <ToggleSwitch checked={switch1} label='Cho phép mọi người bình luận' onChange={setSwitch1} /> */}
            <ToggleSwitch
              checked={allowComment}
              label='Cho phép mọi người bình luận'
              onChange={handleToggleSwitchChange}
            />

            <div className='pin-prime-btn flex'>
              {/* <button disabled={underUpload} onClick={uploadHandler}>
                Publish
              </button> */}
              <button className='btn-save' disabled={underUpload} onClick={handlePostCreate}>
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
