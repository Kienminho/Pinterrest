import React, { useRef, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
// import { updateState } from '../../store/slices/UserSlice'
import { MdOutlineEdit } from 'react-icons/md'
import { updateAvatar, uploadFiles } from '../../store/apiRequest'
import { createAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'

const UserPicUploader = ({ setTempPic }) => {
  const user = useSelector((state) => state.Auth.login?.currentUser)
  const dispatch = useDispatch()
  let axiosJWT = createAxios(user, dispatch, loginSuccess)
  const accessToken_daniel = user?.data?.AccessToken
  const inputRef = useRef(null)

  const selectfile = () => {
    inputRef.current.click()
  }

  const postUserPic = async (e) => {
    const File = e.target.files[0]
    console.log(File)

    try {
      // Gọi hàm uploadFiles để tải file lên
      const uploadData = await uploadFiles([File], dispatch, accessToken_daniel, axiosJWT)

      // Kiểm tra xem việc tải lên file có thành công hay không
      if (uploadData) {
        // Lấy đường dẫn của file đã tải lên
        const newAvatarPath = uploadData.ThumbnailPath

        // Gọi API cập nhật avatar sử dụng đường dẫn mới
        const updateAvatarData = {
          newAvatar: newAvatarPath
        }

        const updateResponse = await axiosJWT.put(
          `${process.env.REACT_APP_API_URL}/user/update-avatar`,
          updateAvatarData,
          {
            headers: { authorization: `Bearer ${accessToken_daniel}` }
          }
        )

        console.log(updateResponse)
      } else {
        console.log('Tải lên file thất bại')
      }
    } catch (error) {
      console.log('Xảy ra lỗi khi thực hiện tải lên và cập nhật avatar:', error)
    }
  }

  return (
    <div
      className='w-8 aspect-square z-20 rounded-full bg-gray-100 hover:bg-gray-200 grid place-content-center '
      onClick={selectfile}
    >
      <MdOutlineEdit />
      <input
        type='file'
        accept='image/*'
        name='upload_pic_file'
        onChange={(e) => {
          postUserPic(e)
          setTempPic(e.target.files[0])
        }}
        hidden
        ref={inputRef}
        multiple={false}
      />
    </div>
  )
}

export default UserPicUploader
