import axios from 'axios'
import {
  changePassStart,
  changePassSuccess,
  changePassFailed,
  loginFailed,
  loginStart,
  loginSuccess,
  logoutFailed,
  logoutStart,
  logoutSuccess,
  registerFailed,
  registerStart,
  registerSuccess
} from './slices/AuthSlice'

import { getUsersFailed, getUsersStart, getUsersSuccess } from './slices/UserSlice_chuabiet'
import toast, { Toaster } from 'react-hot-toast'
import { uploadFileFailed, uploadFileStart, uploadFileSuccess } from './slices/FileSlice'

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart())

  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/login`, user)
    dispatch(loginSuccess(res.data))
    toast.success('Đăng nhập thành công')
    navigate('/')
  } catch (error) {
    let errorMessage = 'Lỗi không xác định khi đăng nhập'
    toast.error('Đăng nhập thất bại')

    // Nếu có dữ liệu phản hồi từ server
    if (error.response && error.response.data) {
      const { statusCode, message } = error.response.data
      console.error(`Mã lỗi ${statusCode}: ${message}`)
      errorMessage = `${message}`
    } else {
      // Xử lý các trường hợp lỗi khác tùy theo cần thiết
      console.error('Lỗi không xác định khi đăng nhập:', error.message)
    }

    dispatch(loginFailed())
    throw new Error(errorMessage)
  }
}

export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart())

  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/register`, user)
    dispatch(registerSuccess(res.data))
    toast.success('Đăng ký thành công')
    navigate('/login')
  } catch (error) {
    let errorMessage = 'Lỗi không xác định khi đăng ký'
    toast.error('Đăng ký không thành công')
    if (error.response && error.response.data) {
      const { statusCode, message } = error.response.data
      // Xử lý thông báo lỗi từ phản hồi khi đăng ký thất bại
      console.error(`Mã lỗi ${statusCode}: ${message}`)
      dispatch(registerFailed())
      errorMessage = `${message}`
    } else {
      // Xử lý các trường hợp lỗi khác tùy theo cần thiết
      console.error('Lỗi không xác định khi đăng ký:', error.message)
      dispatch(registerFailed())
    }
    throw new Error(errorMessage)
  }
}

export const logoutUser = async (dispatch, navigate, accessToken, axiosJWT) => {
  dispatch(logoutStart())
  try {
    await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/logout`, {
      headers: { authorization: `Bearer ${accessToken}` }
    })
    dispatch(logoutSuccess())
    toast.success('Đăng xuất thành công')
    navigate('/login')
  } catch (error) {
    dispatch(logoutFailed())
    toast.error('Đăng xuất không thành công')
  }
}

export const changePassword = async (email, newPassword, dispatch, navigate) => {
  console.log('toi dc day roi')
  dispatch(loginStart())

  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/forgot-password`, {
      email,
      newPassword
    })
    dispatch(loginSuccess(res.data))
    console.log(res.data)
    toast.success('Đặt lại mật khẩu thành công')
    navigate('/login')
  } catch (error) {
    let errorMessage = 'Lỗi không xác định khi đặt lại mật khẩu'
    toast.error('Đặt lại mật khẩu thất bại')

    // Nếu có dữ liệu phản hồi từ server
    if (error.response && error.response.data) {
      const { statusCode, message } = error.response.data
      console.error(`Mã lỗi ${statusCode}: ${message}`)
      errorMessage = `${message}`
    } else {
      // Xử lý các trường hợp lỗi khác tùy theo cần thiết
      console.error('Lỗi không xác định khi đặt lại mật khẩu:', error.message)
    }

    dispatch(loginFailed())
    throw new Error(errorMessage)
  }
}

export const uploadFilesAndCreatePost = async (files, postBody, dispatch, navigate, accessToken, axiosJWT) => {
  dispatch(uploadFileStart())
  try {
    const formData = new FormData()
    console.log(files)
    // Thêm ảnh vào formData
    // files.forEach((file) => {
    //   formData.append('files', file)
    // })
    formData.append('file', files[0])
    console.log(formData.get('file'))

    const uploadRes = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/file/upload`, formData, {
      headers: { authorization: `Bearer ${accessToken}` }
    })

    console.log(uploadRes.data)

    const { data: uploadData } = uploadRes

    if (uploadData.statusCode === 200) {
      dispatch(uploadFileSuccess(uploadData))
      console.log('Upload files thành công')
      toast.success('Upload files thành công')

      // Thêm đường dẫn tải lên vào postBody
      postBody.Attachment.Id = uploadData?.data._id // Thay đổi _id bằng trường Id của đối tượng File của bạn
      postBody.Attachment.Thumbnail = uploadData?.data.ThumbnailPath || '' // Thay đổi thành trường bạn cần
      console.log(postBody)

      // Gọi API tạo bài đăng
      const createPostRes = await axios.post(`${process.env.REACT_APP_API_URL}/post/create-post`, postBody, {
        headers: { authorization: `Bearer ${accessToken}` }
      })

      console.log('Create post response:', createPostRes.data)

      const { data: postData } = createPostRes

      // Xử lý phản hồi từ server nếu cần
      if (postData.statusCode === 200) {
        toast.success('Tạo bài đăng thành công')
        navigate('/')
        return createPostRes.data.data // Trả về thông tin bài đăng nếu cần
      } else {
        toast.error('Tạo bài đăng thất bại')
        throw new Error(createPostRes.data.message)
      }
    } else {
      console.error('Lỗi khi upload files:', uploadData.message)
      toast.error('Upload files thất bại')
      throw new Error(uploadData.message)
    }
  } catch (error) {
    dispatch(uploadFileFailed())
    console.error('Lỗi không xác định khi upload files hoặc tạo bài đăng:', error.message)
    toast.error('Xảy ra lỗi không xác định')
    throw new Error('Lỗi không xác định khi upload files hoặc tạo bài đăng')
  }
}

export const uploadFiles = async (files, dispatch, accessToken, axiosJWT) => {
  dispatch(uploadFileStart())
  try {
    const formData = new FormData()
    formData.append('file', files[0])

    const uploadRes = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/file/upload`, formData, {
      headers: { authorization: `Bearer ${accessToken}` }
    })

    console.log(uploadRes.data)

    const { data: uploadData } = uploadRes

    if (uploadData.statusCode === 200) {
      dispatch(uploadFileSuccess(uploadData))
      console.log('Upload files thành công')
      toast.success('Upload files thành công')

      return uploadData.data // Trả về thông tin file tải lên nếu cần
    } else {
      console.error('Lỗi khi upload files:', uploadData.message)
      toast.error('Upload files thất bại')
      throw new Error(uploadData.message)
    }
  } catch (error) {
    dispatch(uploadFileFailed())
    console.error('Lỗi không xác định khi upload files:', error.message)
    toast.error('Xảy ra lỗi không xác định khi upload files')
    throw new Error('Lỗi không xác định khi upload files')
  }
}

export const getAllUsers = async (accessToken, dispatch) => {
  dispatch(getUsersStart())
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/all`, {
      headers: { authorization: `Bearer ${accessToken}` }
    })
    dispatch(getUsersSuccess(res.data))
  } catch (error) {
    dispatch(getUsersFailed())
  }
}

export const updateUserInfo = async (userData, accessToken, axiosJWT) => {
  try {
    await axiosJWT.put(`${process.env.REACT_APP_API_URL}/user/update-info`, userData, {
      headers: { authorization: `Bearer ${accessToken}` }
    })
    console.log('Cap nhat thong tin thanh cong')
  } catch (error) {
    console.log(error)
  }
}

export const createComment = async (postId, content, attachment, accessToken, axiosJWT) => {
  try {
    const res = await axiosJWT.post(
      `${process.env.REACT_APP_API_URL}/comment/create-comment`,
      {
        PostId: postId,
        Content: content,
        Attachment: attachment
      },
      {
        headers: { authorization: `Bearer ${accessToken}` }
      }
    )
    console.log('day la comment moi: ', res.config.data)
  } catch (error) {
    console.log(error)
  }
}

export const replyComment = async (postId, parrentCommentId, content, attachment, accessToken, axiosJWT) => {
  try {
    const res = await axiosJWT.post(
      `${process.env.REACT_APP_API_URL}/comment/create-reply-comment`,
      {
        PostId: postId,
        ParentCommentId: parrentCommentId,
        Content: content,
        Attachment: attachment
      },
      {
        headers: { authorization: `Bearer ${accessToken}` }
      }
    )
    console.log('day la mot reply moi', res.config.data)
  } catch (error) {
    console.log(error)
  }
}

export const followUser = async (userId, targetUserId, accessToken, axiosJWT) => {
  try {
    const res = await axiosJWT.post(
      `${process.env.REACT_APP_API_URL}/user/follow`,
      {
        follower: userId,
        following: targetUserId
      },
      {
        headers: { authorization: `Bearer ${accessToken}` }
      }
    )
    console.log('day la follow user: ', res.config.data)
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const getUserByEmail = async (email, accessToken) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/user-by-email/${email}`, {
      headers: { authorization: `Bearer ${accessToken}` }
    })
    console.log(res.data)
    return res.data
  } catch (error) {
    console.log(error)
  }
}
