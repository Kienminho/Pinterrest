import axios from 'axios'
import {
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

import toast from 'react-hot-toast'
import { uploadFileFailed, uploadFileStart, uploadFileSuccess } from './slices/FileSlice'
import { resetState } from './slices/UserSlice'

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart())

  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/login`, user)
    if (res.data.statusCode === 200) {
      dispatch(loginSuccess(res.data))
      toast.success('Đăng nhập thành công')
      navigate('/')
    } else {
      dispatch(loginFailed())
      toast.error('Đăng nhập không thành công')
    }
  } catch (error) {
    let errorMessage = 'Lỗi không xác định khi đăng nhập'
    toast.error('Đăng nhập không thành công')

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
    if (res.data.statusCode === 200) {
      dispatch(registerSuccess(res.data))
      toast.success('Đăng ký thành công')
      navigate('/login')
    } else {
      dispatch(registerFailed())
      toast.error('Đăng ký không thành công')
    }
  } catch (error) {
    let errorMessage = 'Lỗi không xác định khi đăng ký'
    toast.error('Đăng ký không thành công')
    if (error.response && error.response.data) {
      const { statusCode, message } = error.response.data
      console.error(`Mã lỗi ${statusCode}: ${message}`)
      dispatch(registerFailed())
      errorMessage = `${message}`
    } else {
      dispatch(registerFailed())
    }
    throw new Error(errorMessage)
  }
}

export const logoutUser = async (dispatch, navigate, accessToken, axiosJWT) => {
  dispatch(logoutStart())
  try {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/logout`, {
      headers: { authorization: `Bearer ${accessToken}` }
    })
    if (res.data.statusCode === 200) {
      dispatch(logoutSuccess())
      dispatch(resetState())
      toast.success('Đăng xuất thành công')
      navigate('/login')
    } else {
      dispatch(logoutFailed())
      dispatch(resetState())
      navigate('/login')
      toast.error('Lỗi khi đăng xuất')
    }
  } catch (error) {
    dispatch(logoutFailed())
    dispatch(resetState())
    navigate('/login')
    toast.error('Đăng xuất không thành công')
  }
}

export const changePassword = async (email, newPassword, dispatch, navigate) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/forgot-password`, {
      email,
      newPassword
    })
    if (res.data.statusCode === 200) {
      toast.success('Đặt lại mật khẩu thành công')
      navigate('/login')
    } else {
      toast.error('Đặt lại mật khẩu thất bại')
    }
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
    throw new Error(errorMessage)
  }
}

export const uploadFilesAndCreatePost = async (files, postBody, dispatch, navigate, accessToken, axiosJWT) => {
  dispatch(uploadFileStart())
  try {
    const formData = new FormData()
    formData.append('file', files[0])

    const uploadRes = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/file/upload`, formData, {
      headers: { authorization: `Bearer ${accessToken}` }
    })

    const { data: uploadData } = uploadRes

    if (uploadData.statusCode === 200) {
      dispatch(uploadFileSuccess(uploadData))
      console.log('Upload files thành công')

      // Thêm đường dẫn tải lên vào postBody
      postBody.Attachment.Id = uploadData?.data._id
      postBody.Attachment.Thumbnail = uploadData?.data.ThumbnailPath || ''

      // Gọi API tạo bài đăng
      const createPostRes = await axios.post(`${process.env.REACT_APP_API_URL}/post/create-post`, postBody, {
        headers: { authorization: `Bearer ${accessToken}` }
      })

      console.log('Create post response normal:', createPostRes.data)

      const { data: postData } = createPostRes
      console.log(postData)
      return postData
    } else {
      throw new Error(uploadData.message)
    }
  } catch (error) {
    dispatch(uploadFileFailed())
    console.error('Lỗi không xác định khi upload files hoặc tạo bài đăng:', error.message)
    throw new Error('Lỗi không xác định khi upload files hoặc tạo bài đăng')
  }
}

export const createPostAI = async (linkImageAI, postBody, dispatch, navigate, accessToken, axiosJWT) => {
  try {
    // Thêm đường dẫn tải lên vào postBody
    postBody.Attachment.Id = '65dbf999d3431c34958551b7'
    postBody.Attachment.Thumbnail = linkImageAI

    // Gọi API tạo bài đăng
    const createPostRes = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/post/create-post`, postBody, {
      headers: { authorization: `Bearer ${accessToken}` }
    })
    const { data: postData } = createPostRes
    return postData
  } catch (error) {
    console.error('Lỗi không xác định khi tạo bài đăng:', error.message)
    throw new Error('Lỗi không xác định khi tạo bài đăng')
  }
}

export const updatePost = async (updatedData, accessToken, axiosJWT) => {
  try {
    const updateData = {
      PostId: updatedData.id,
      Title: updatedData.Title,
      Description: updatedData.Description,
      IsComment: updatedData.IsComment
    }

    // Gọi API cập nhật bài viết
    const updatePostRes = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/post/update-post`, updateData, {
      headers: { authorization: `Bearer ${accessToken}` }
    })
    console.log('Update post response:', updatePostRes.data)
    const { data: postData } = updatePostRes

    if (postData.statusCode === 200) {
      toast.success('Cập nhật bài đăng thành công')
      return postData.data // Trả về thông tin bài đăng đã được cập nhật
    } else {
      console.error('Lỗi khi cập nhật bài đăng:', postData.message)
      toast.error('Cập nhật bài đăng thất bại')
      throw new Error(postData.message)
    }
  } catch (error) {
    console.error('Lỗi không xác định khi cập nhật bài đăng:', error.message)
    toast.error('Xảy ra lỗi không xác định khi cập nhật bài đăng')
    throw new Error('Lỗi không xác định khi cập nhật bài đăng')
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

    const { data: uploadData } = uploadRes

    if (uploadData.statusCode === 200) {
      dispatch(uploadFileSuccess(uploadData))
      toast.success('Upload files thành công')
      return uploadData.data
    } else {
      dispatch(uploadFileFailed())
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

export const updateUserInfo = async (userData, accessToken, axiosJWT) => {
  try {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/user/update-info`, userData, {
      headers: { authorization: `Bearer ${accessToken}` }
    })
    return res.data
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
    return res.data
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
    return res.data
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
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const unfollowUser = async (followedId, accessToken, axiosJWT) => {
  try {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/user/un-follow/${followedId}`, {
      headers: { authorization: `Bearer ${accessToken}` }
    })
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const getUserByEmail = async (email, accessToken, axiosJWT) => {
  try {
    const res = await axiosJWT.post(
      `${process.env.REACT_APP_API_URL}/user/user-by-email/`,
      { Email: email },
      {
        headers: { authorization: `Bearer ${accessToken}` }
      }
    )
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const createConversation = async (senderId, receiverId, accessToken, axiosJWT) => {
  try {
    const res = await axiosJWT.post(
      `${process.env.REACT_APP_API_URL}/conversation/create-conversation`,
      {
        senderId,
        receiverId
      },
      {
        headers: { authorization: `Bearer ${accessToken}` }
      }
    )
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const getConversationByUser = async (accessToken, axiosJWT) => {
  try {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/conversation/conversation-by-user/`, {
      headers: { authorization: `Bearer ${accessToken}` }
    })
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const createMessage = async (conversationId, senderId, receiverId, message, accessToken, axiosJWT) => {
  try {
    const res = await axiosJWT.post(
      `${process.env.REACT_APP_API_URL}/message/create-message`,
      {
        conversationId,
        senderId,
        receiverId,
        message
      },
      {
        headers: { authorization: `Bearer ${accessToken}` }
      }
    )
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const readMessage = async (messageId, readerId, accessToken, axiosJWT) => {
  try {
    const res = await axiosJWT.post(
      `${process.env.REACT_APP_API_URL}/message/read-message`,
      {
        messageId,
        readerId
      },
      {
        headers: { authorization: `Bearer ${accessToken}` }
      }
    )
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const getMessageByConversation = async (conversationId, senderId, receiverId, accessToken, axiosJWT) => {
  try {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/message/get-message/${conversationId}`, {
      headers: { authorization: `Bearer ${accessToken}` }
    })
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const getReactionByUser = async (postOrCommentId, userId, accessToken, axiosJWT) => {
  try {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/reaction/get-reaction-by-user`, {
      params: { postOrCommentId, userId },
      headers: { authorization: `Bearer ${accessToken}` }
    })
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const getAllReactions = async (pageIndex, pageSize, postOrCommentId, accessToken, axiosJWT) => {
  try {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/reaction/get-all-reactions`, {
      params: { pageIndex, pageSize, postOrCommentId },
      headers: { authorization: `Bearer ${accessToken}` }
    })
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const createReaction = async (postOrCommentId, userId, icon, isPost, accessToken, axiosJWT) => {
  try {
    const res = await axiosJWT.post(
      `${process.env.REACT_APP_API_URL}/reaction/create-reaction`,
      { postOrCommentId, userId, icon, isPost },
      {
        headers: { authorization: `Bearer ${accessToken}` }
      }
    )
    return res.data
  } catch (error) {
    console.log(error)
  }
}
