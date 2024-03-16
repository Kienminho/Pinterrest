import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uploadFiles } from '../../store/apiRequest'
import { createAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'
import { Button } from 'flowbite-react'
import toast from 'react-hot-toast'

const AvatarUploader = ({ setTempPic }) => {
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
      } else {
        toast.error('Tải lên file thất bại')
      }
    } catch (error) {
      console.log('Xảy ra lỗi khi thực hiện tải lên và cập nhật avatar:', error)
    }
  }

  return (
    <>
      <Button onClick={selectfile} color='indigo' size='md' pill>
        Thay ảnh
      </Button>
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
    </>
  )
}

export default AvatarUploader
