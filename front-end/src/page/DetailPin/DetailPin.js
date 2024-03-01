import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { createAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'
import { FaRegArrowAltCircleLeft } from 'react-icons/fa'
import { MdSend } from 'react-icons/md'

import SuspenseImg from '../../components/SuspenseImg/SuspenseImg'
import { Accordion, Button, Textarea } from 'flowbite-react'
import { ProfileImage } from '../../components/ProfileImage/ProfileImage'
import { createComment, followUser, replyComment, unfollowUser } from '../../store/apiRequest'
import moment from 'moment'
import 'moment/locale/vi'
import { setFollowingStatus } from '../../store/slices/FollowingSlice'
import toast from 'react-hot-toast'
import './DetailPin.css'
import { Spin } from 'antd'
import ImageDownloader from '../../components/ImageDownloader/ImageDownloader'

const DetailPin = () => {
  const formatRelativeTime = (timestamp, now = moment()) => {
    const commentTime = moment(timestamp)
    const diffInMinutes = now.diff(commentTime, 'minutes')
    const diffInHours = now.diff(commentTime, 'hours')
    const diffInDays = now.diff(commentTime, 'days')

    return diffInMinutes < 60 ? `${diffInMinutes}m` : diffInHours < 24 ? `${diffInHours}h` : `${diffInDays}d`
  }

  const [postData, setPostData] = useState({})
  const [isReplying, setIsReplying] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [finishCmt, setFinishCmt] = useState(false)
  const [finishRep, setFinishRep] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [comments, setComments] = useState([])
  const [selectedCommentId, setSelectedCommentId] = useState(null)
  const [isReplyingToReply, setIsReplyingToReply] = useState(false)
  const [selectedReplyId, setSelectedReplyId] = useState(null)
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [loadingCmt, setLoadingCmt] = useState(true)
  const [loadingPost, setLoadingPost] = useState(true)

  const user = useSelector((state) => state.Auth.login?.currentUser)
  const isFollowing = useSelector((state) => state.Following.isFollowing)
  const { Avatar: UserAvatar, _id: UserId } = useSelector((state) => state.User)
  const isCurrentUser = user && UserId === postData?.Created?._id
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  let axiosJWT = createAxios(user, dispatch, loginSuccess)
  const accessToken_daniel = user?.data?.AccessToken

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleReplyClick = (idcuachinhno) => {
    setIsReplying(true)
    setSelectedCommentId(idcuachinhno)
    setReplyContent('')
  }

  const handleReplyToReplyClick = (replyId) => {
    setIsReplying(true)
    setSelectedCommentId(null) // Đặt về null để tránh trạng thái đang trả lời comment chính
    setIsReplyingToReply(true)
    setSelectedReplyId(replyId)
    setReplyContent('')
  }

  const handleCancelReply = () => {
    setIsReplying(false)
    setReplyContent('')
  }

  const handleCancelReply1 = () => {
    setIsReplying(false)
    setIsReplyingToReply(false)
    setSelectedCommentId(null)
    setSelectedReplyId(null)
    setReplyContent('')
  }

  const handleSendComment = async () => {
    try {
      // Gọi hàm createComment với các thông tin cần thiết
      const res = await createComment(postData?._id, commentContent, postData?.Attachment, accessToken_daniel, axiosJWT)
      if (res.statusCode === 200) {
        toast.success('Bình luận thành công')
        setCommentContent('')
        setFinishCmt(true)
      }
    } catch (error) {
      toast.error('Bình luận thất bại')
      console.log('Error creating comment:', error)
    }
  }

  const handleSendReply = async () => {
    try {
      // Gọi hàm replyComment với các thông tin cần thiết
      const result = await replyComment(
        postData?._id,
        selectedCommentId,
        replyContent,
        postData?.Attachment,
        accessToken_daniel,
        axiosJWT
      )

      if (result) {
        toast.success('Trả lời nhận xét thành công!')
        setReplyContent('')
        setFinishRep(true)
      }
    } catch (error) {
      console.log('Error replying comment:', error)
    }

    setIsReplying(false)
    setReplyContent('')
  }

  const handleSendReply1 = async () => {
    try {
      let commentIdToReply = selectedCommentId

      if (isReplyingToReply) {
        commentIdToReply = selectedReplyId
      }

      const result = await replyComment(
        postData?._id,
        commentIdToReply,
        replyContent,
        postData?.Attachment,
        accessToken_daniel,
        axiosJWT
      )

      if (result) {
        toast.success('Trả lời nhận xét thành công!')
        setReplyContent('')
        setFinishRep(true)
      }
    } catch (error) {
      console.log('Error replying comment:', error)
    }

    setIsReplying(false)
    setIsReplyingToReply(false)
    setSelectedCommentId(null)
    setSelectedReplyId(null)
    setReplyContent('')
  }

  // Khi người dùng nhấn vào nút "Theo dõi" hoặc "Bỏ theo dõi"
  const handleFollowToggle = async () => {
    const targetFollow = following.find((f) => f.following.UserName === postData?.Created?.UserName)
    try {
      if (isFollowing) {
        // Nếu đang theo dõi, thực hiện hành động "Bỏ theo dõi"
        await unfollowUser(targetFollow?._id, accessToken_daniel, axiosJWT)
        dispatch(setFollowingStatus(false))
        toast.success('Huỷ theo dõi thành công!')
      } else {
        // Nếu chưa theo dõi, thực hiện hành động "Theo dõi"
        await followUser(UserId, postData?.Created?._id, accessToken_daniel, axiosJWT)
        dispatch(setFollowingStatus(true))
        toast.success('Theo dõi thành công!')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getTotalCommentsAndReplies = (comments) => {
    let total = 0
    comments.forEach((comment) => {
      total++
      if (comment.replies && comment.replies.length > 0) {
        total += getTotalCommentsAndReplies(comment.replies)
      }
    })
    return total
  }

  // Lấy thông tin chi tiết 1 post từ server
  useEffect(() => {
    const getDetailPostFromServer = async () => {
      try {
        const resData = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/post/get-detail-post/${id}`, {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        })
        const postData = resData.data.data
        if (postData) {
          setPostData(postData)
          setLoadingPost(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getDetailPostFromServer()
  }, [id])

  // Lấy danh sách bình luận của 1 post (mainComment + replyComments) từ server
  useEffect(() => {
    const getCommentsFromServer = async () => {
      try {
        const resData = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/comment/get-comments-by-post/${id}`, {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        })

        const allComments = resData.data.data
        console.log('', allComments)

        setComments(allComments)
        setLoadingCmt(false)
      } catch (error) {
        console.log(error)
      }
    }

    if (id) {
      getCommentsFromServer()
    }
  }, [id, finishCmt, finishRep])

  // Lấy danh sách follower và following của người dùng hiện tại
  useEffect(() => {
    const fetchDataFromServer = async () => {
      try {
        // Gọi API để lấy danh sách follower
        const followersRes = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/get-follower`, {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        })
        const followersData = followersRes.data.data
        if (followersData) {
          setFollowers(followersData)
        }

        // Gọi API để lấy danh sách following
        const followingRes = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/get-following`, {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        })
        const followingData = followingRes.data.data
        if (followingData) {
          setFollowing(followingData)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchDataFromServer()
  }, [])

  console.log(finishCmt)

  return (
    <div className='detail-pin-container minus-nav-100vh'>
      <div className='flex min-h-full justify-center relative '>
        {/* back button */}
        <div className='absolute go-back top-7 left-7 max-sm:hidden'>
          <button className='left-arrow rounded-full hover:bg-gray-200 p-2  transition' onClick={handleGoBack}>
            <FaRegArrowAltCircleLeft size='2rem' color='#5850ec' />
          </button>
        </div>
        {/* pin section */}
        <div
          className='pin-section flex m-20 rounded-3xl overflow-hidden max-w-5xl my-14 max-sm:rounded-none max-sm:my-0 max-sm:pb-24 max-sm:flex-col max-sm:px-2 max-sm:w-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] '
          style={{ minHeight: '400px' }}
        >
          {/* image left handside */}
          <div className='visual-pin-container py-5 pl-5 w-[500px] max-sm:w-auto '>
            <SuspenseImg
              className='w-full rounded-3xl'
              src={postData?.Attachment?.Thumbnail}
              fileName={postData?.Attachment?.Thumbnail}
              alt='post_image'
              height={500}
            />
          </div>

          {/* description right handside */}
          <div className='w-[550px] desc-container max-sm:px-2 max-sm:w-auto relative'>
            <div className='desc-container-header pt-9 px-9 pb-5 flex justify-between items-center max-sm:pt-5 max-sm:justify-start'>
              <ImageDownloader imageUrl={postData?.Attachment?.Thumbnail} />
              {/* <Button pinId={id} savedBy={saves} /> */}
              <Button pill color='failure' className='px-2 py-1.5 text-base focus:box-shadow-none focus:ring-0'>
                <span className='text-base'>Lưu</span>
              </Button>
            </div>

            <div className='desc-body flex flex-col gap-4 px-9 max-sm:gap-3 overflow-scroll max-h-[40rem]'>
              <span className='text-3xl font-medium max-sm:text-2xl text-dark_color'>{postData?.Title}</span>{' '}
              <span className='text-[20px] font-normal max-sm:text-base text-gray-700'>{postData?.Description}</span>
              {/* User info part */}
              <div className='creator-profile flex w-full items-center mt-auto gap-3'>
                <div className='creator-image rounded-full w-14 aspect-square overflow-hidden shrink-0'>
                  {user ? (
                    <ProfileImage src={postData?.Created?.Avatar} />
                  ) : (
                    <ProfileImage
                      src='https://static-images.vnncdn.net/files/publish/2023/6/30/mason-mount-1-228.jpg'
                      alt='stranger'
                      className='w-full'
                    />
                  )}
                </div>
                <div className='creator-name whitespace-nowrap overflow-hidden text-ellipsis flex flex-col text-dark_color'>
                  <div className='font-semibold'>{postData?.Created?.UserName}</div>
                  <div className=''>{followers.length} người theo dõi</div>
                </div>
                {/* Nếu là người dùng hiện tại, ẩn nút "Theo dõi" */}
                {!isCurrentUser && (
                  <div className='creator-follow ml-auto'>
                    <Button color='blue' className='rounded-full px-1 py-1.5' onClick={handleFollowToggle}>
                      <span className='text-base'>{isFollowing ? 'Bỏ theo dõi' : 'Theo dõi'}</span>
                    </Button>
                  </div>
                )}
              </div>
              {/* Comment part  */}
              <div>
                <Accordion className='hover:bg-none focus:ring-0 border-none hover:none dark:border-none focus:border-none'>
                  <Accordion.Panel className='hover:bg-none focus:ring-0'>
                    <Accordion.Title>
                      <h6 className='font-medium text-dark_color'>Nhận xét</h6>
                    </Accordion.Title>
                    {postData.IsComment === false ? (
                      <button disabled className='text-gray-500 -mt-10'>
                        Đã tắt nhận xét cho Ghim này
                      </button>
                    ) : // Điều kiện thứ hai
                    !loadingCmt && !loadingPost && postData.IsComment === true && comments.length === 0 ? (
                      <button disabled className='text-gray-500 -mt-10'>
                        Chưa có nhận xét nào! Thêm nhận xét để bắt đầu.aaa
                      </button>
                    ) : loadingCmt && loadingPost ? (
                      <div className='flex items-center justify-center absolute inset-0 bg-white'>
                        {/* <Spinner color='gray' aria-label='Spinner button' size='xl' /> */}
                        <Spin size='large' />
                      </div>
                    ) : (
                      <Accordion.Content>
                        {/* Hiển thị danh sách bình luận */}
                        {comments.map((comment) => (
                          <div key={comment._id} className='comment-section flex flex-col w-full gap-2.5 mt-2'>
                            <div className='flex gap-3'>
                              <div className='creator-image rounded-full w-10 h-10 aspect-square overflow-hidden shrink-0'>
                                <ProfileImage src={comment.author.avatar} alt='strangers' />
                              </div>
                              <div className='creator-name whitespace-nowrap overflow-hidden text-ellipsis flex flex-col'>
                                <div className='flex'>
                                  <div className='mr-3 text-red-700 font-semibold'>{comment.author.name}</div>
                                  <div className='text-base text-dark_color'>{comment.content}</div>
                                </div>

                                <div className='flex gap-5'>
                                  <div className='cursor-pointer text-[#5F5F5F] text-base'>
                                    <div>{formatRelativeTime(comment.createdAt)}</div>
                                  </div>

                                  <div
                                    onClick={() => handleReplyClick(comment._id)}
                                    className='cursor-pointer text-[#767676] text-base font-medium'
                                  >
                                    {'Trả lời'}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Hộp trả lời 1 bình luận */}
                            <div className='w-4/5 ml-20'>
                              {isReplying && selectedCommentId === comment._id && (
                                <div>
                                  <Textarea
                                    id='reply'
                                    placeholder='Trả lời...'
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    required
                                    autoFocus
                                    className='px-4 py-3.5 rounded-full resize-none outline-none text-gray-800 border border-gray-200 focus:ring-gray-300 focus:border-0 focus:bg-white'
                                    rows={1}
                                  />
                                  <div className='flex gap-2 justify-end mt-3'>
                                    <Button pill color='light' onClick={handleCancelReply}>
                                      Huỷ
                                    </Button>
                                    <Button pill onClick={handleSendReply}>
                                      Gửi
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Hiển thị danh sách trả lời của 1 bình luận */}
                            {comment.replies.map((reply) => (
                              <div
                                key={reply._id}
                                className='reply-comment-section flex flex-col gap-2.5 ml-7 mt-[-8px]'
                              >
                                <div className='flex gap-3'>
                                  <div className='creator-image rounded-full w-10 h-10 aspect-square overflow-hidden shrink-0'>
                                    <ProfileImage src={reply.author.avatar} alt='stranger' />
                                  </div>
                                  <div className='creator-name whitespace-nowrap flex flex-col'>
                                    <div className='flex'>
                                      <div className='mr-3 text-red-700 font-semibold'>{reply.author.name}</div>
                                      <div className='mr-1 text-blue-700 font-semibold'>@{comment.author.name}</div>
                                      <div className='text-base text-dark_color'>{reply.content}</div>
                                    </div>
                                    <div className='flex gap-5'>
                                      <div className='cursor-pointer text-[#5F5F5F] text-base'>
                                        {formatRelativeTime(reply.createdAt)}
                                      </div>
                                      <div
                                        onClick={() => handleReplyToReplyClick(reply._id)}
                                        className='cursor-pointer text-[#767676] text-base font-medium'
                                      >
                                        {'Trả lời'}
                                      </div>
                                    </div>
                                    <div className='w-full'>
                                      {isReplying && selectedReplyId === reply._id && (
                                        <div>
                                          <Textarea
                                            id='reply'
                                            placeholder={`Trả lời ${reply.author.name}...`}
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            required
                                            autoFocus
                                            className='mt-2 ml-5 px-24 py-3.5 ps-5 rounded-full resize-none outline-none text-gray-800 border border-gray-200 focus:ring-gray-300 focus:border-0 focus:bg-white'
                                            rows={1}
                                          />
                                          <div className='flex gap-2 justify-end mt-3'>
                                            <Button pill color='light' onClick={handleCancelReply1}>
                                              Huỷ
                                            </Button>
                                            <Button pill onClick={handleSendReply1}>
                                              Gửi
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  {reply.replies.map((nestedReply, index) => (
                                    <div
                                      key={nestedReply._id}
                                      className={`nested-reply-comment-section flex gap-3 mb-3 ${
                                        index !== 0 ? 'mt-2' : 'mt-1.5'
                                      }`}
                                    >
                                      <div className='creator-image rounded-full w-10 h-10 aspect-square overflow-hidden shrink-0'>
                                        <ProfileImage src={nestedReply.author.avatar} alt='stranger' />
                                      </div>
                                      <div className='creator-name whitespace-nowrap text-ellipsis flex flex-col  '>
                                        <div className='flex'>
                                          <div className='mr-3 text-red-700 font-semibold'>
                                            {nestedReply.author.name}
                                          </div>
                                          <div className='mr-1 text-blue-700 font-semibold'>@{reply.author.name}</div>
                                          <div>{nestedReply.content}</div>
                                        </div>
                                        <div className='flex gap-5'>
                                          <div className='cursor-pointer text-[#5F5F5F] text-base'>
                                            {formatRelativeTime(nestedReply.createdAt)}
                                          </div>
                                          <div
                                            onClick={() => handleReplyClick(comment._id)}
                                            className='cursor-pointer text-[#767676] text-base font-medium'
                                          >
                                            {'Trả lời'}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </Accordion.Content>
                    )}
                  </Accordion.Panel>
                </Accordion>
              </div>
            </div>

            <div className='desc-commentbox absolute bottom-0 right-0 left-0'>
              {/* Comment box section */}
              {postData.IsComment ? (
                <div
                  className={`comment-box flex flex-col gap-4 px-6 pt-4 pb-5 max-sm:gap-2 rounded overflow-scroll bg-white relative border-t-2 border-gray-100 ${
                    parseInt(postData?.Attachment?.Thumbnail.split('-')[1].split('x')[1].split('.')[0]) > 600
                      ? 'absolute'
                      : ''
                  }`}
                >
                  <h6 className='text-dark_color font-medium ml-1'>
                    {getTotalCommentsAndReplies(comments) === 0
                      ? 'Bạn nghĩ gì?'
                      : `${getTotalCommentsAndReplies(comments)} Nhận xét`}
                  </h6>

                  <div className='flex gap-3'>
                    <div className='creator-image rounded-full w-12 aspect-square  shrink-0'>
                      <ProfileImage src={UserAvatar} alt='stranger' className='w-10 h-10' />
                    </div>
                    <div className='creator-name whitespace-nowrap text-ellipsis w-full'>
                      <Textarea
                        id='comment'
                        placeholder='Thêm nhận xét...'
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        required
                        rows={1}
                        className='px-4 py-3.5 rounded-full resize-none outline-none hover:bg-[#e1e1e1] text-gray-800 bg-gray_input focus:ring-gray-300 focus:border-white focus:bg-white'
                      />
                    </div>
                    <button onClick={handleSendComment} className='btn-linkhover rounded-xl px-5'>
                      <MdSend className='h-6 w-6' />
                    </button>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailPin
