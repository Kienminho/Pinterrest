import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { createAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'
import { FaRegArrowAltCircleLeft } from 'react-icons/fa'
import { HiOutlineArrowRight } from 'react-icons/hi'
import SuspenseImg from '../../components/SuspenseImg/SuspenseImg'
import { Accordion, Button, Textarea } from 'flowbite-react'
import { ProfileImage } from '../../components/ProfileImage/ProfileImage'
import { createComment, followUser, replyComment, unfollowUser } from '../../store/apiRequest'
import moment from 'moment'
import 'moment/locale/vi'
import { resetFollowingStatus, setFollowingStatus } from '../../store/slices/FollowingSlice'
import toast from 'react-hot-toast'
import './DetailPin.css'

const DetailPin = () => {
  const formatRelativeTime = (timestamp, now = moment()) => {
    const commentTime = moment(timestamp)
    const diffInMinutes = now.diff(commentTime, 'minutes')
    const diffInHours = now.diff(commentTime, 'hours')
    const diffInDays = now.diff(commentTime, 'days')

    return diffInMinutes < 60 ? `${diffInMinutes}m` : diffInHours < 24 ? `${diffInHours}h` : `${diffInDays}d`
  }

  const [postData, setPostData] = useState({})
  console.log(postData)
  const [isReplying, setIsReplying] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [replyContent, setReplyContent] = useState('')
  const [comments, setComments] = useState([])
  const [selectedCommentId, setSelectedCommentId] = useState(null)
  console.log(comments)
  const [isReplyingToReply, setIsReplyingToReply] = useState(false)
  const [selectedReplyId, setSelectedReplyId] = useState(null)
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])

  // Khi cần sử dụng giá trị isFollowing trong component
  const isFollowing = useSelector((state) => state.Following.isFollowing)
  console.log(isFollowing)
  const user = useSelector((state) => state.Auth.login?.currentUser)
  const { Avatar: UserAvatar, _id: UserId } = useSelector((state) => state.User)
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isCurrentUser = user && UserId === postData?.Created?._id

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

  // Lấy thông tin chi tiết 1 post từ server
  useEffect(() => {
    const getDetailPostFromServer = async () => {
      try {
        const resData = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/post/get-detail-post/${id}`, {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        })
        console.log('🚀', resData)

        const postData = resData.data.data
        console.log(postData)

        if (postData) {
          setPostData(postData)
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
        console.log('🚀', allComments)

        setComments(allComments)
      } catch (error) {
        console.log(error)
      }
    }
    if (id) {
      getCommentsFromServer()
    }
  }, [id])

  // Lấy danh sách follower và following của người dùng hiện tại
  useEffect(() => {
    const fetchDataFromServer = async () => {
      try {
        // Gọi API để lấy danh sách follower
        const followersRes = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/get-follower`, {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        })

        const followersData = followersRes.data.data
        console.log(followersData)

        if (followersData) {
          setFollowers(followersData)
        }

        // Gọi API để lấy danh sách following
        const followingRes = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/get-following`, {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        })

        const followingData = followingRes.data.data
        console.log(followingData)

        if (followingData) {
          setFollowing(followingData)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchDataFromServer()
  }, [])

  const handleSendComment = async () => {
    try {
      // Gọi hàm createComment với các thông tin cần thiết
      await createComment(postData?._id, commentContent, postData?.Attachment, accessToken_daniel, axiosJWT)
    } catch (error) {
      console.log('Error creating comment:', error)
    }

    setCommentContent('')
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
      console.log(result)

      if (result) {
        console.log('New reply comment created successfully:', result)
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
        console.log('New reply comment created successfully:', result)
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

  console.log(following)
  // Khi người dùng nhấn vào nút "Theo dõi" hoặc "Bỏ theo dõi"
  const handleFollowToggle = async () => {
    const targetFollow = following.find((f) => f.following.UserName === postData?.Created?.UserName)
    console.log(targetFollow?._id)
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

  // Nếu là người dùng hiện tại, ẩn nút "Theo dõi"
  const followButton = !isCurrentUser && (
    <div className='creator-follow ml-auto'>
      <Button
        // gradientDuoTone='greenToBlue'
        color='blue'
        className='rounded-full px-1 py-1.5'
        onClick={handleFollowToggle}
      >
        <span className='text-base'>{isFollowing ? 'Bỏ theo dõi' : 'Theo dõi'}</span>
      </Button>
    </div>
  )

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

  return (
    <div className='detail-pin-container minus-nav-100vh bg-gradient-to-r from-teal-200 to-lime-200'>
      <div className='flex min-h-full justify-center relative '>
        {/* back button */}
        <div className='absolute go-back top-7 left-7 max-sm:hidden'>
          <button className='left-arrow rounded-full hover:bg-gray-200 p-2  transition' onClick={handleGoBack}>
            <FaRegArrowAltCircleLeft size='2rem' color='darkgreen' />
          </button>
        </div>
        {/* pin section */}
        <div className='pin-section flex m-20 rounded-3xl overflow-hidden max-w-5xl my-14 max-sm:rounded-none max-sm:my-0 max-sm:pb-24 max-sm:flex-col max-sm:px-2 max-sm:w-full'>
          {/* image left handside */}
          <div className='visual-pin-container w-[512px] max-sm:w-auto '>
            <SuspenseImg
              className='w-full'
              src={postData?.Attachment?.Thumbnail}
              fileName={postData?.Attachment?.Thumbnail}
              alt='post_image'
              height={500}
            />
          </div>

          {/* description right handside */}
          <div className=' w-[570px] desc-container max-sm:px-2 max-sm:w-auto bg-gradient-to-r from-orange-200 to-red-200 relative'>
            <div className='desc-container-header pt-9 px-9 pb-5 flex justify-end max-sm:pt-5 max-sm:justify-start'>
              {/* <Button pinId={id} savedBy={saves} /> */}
              <Button
                pill
                color='failure'
                // gradientDuoTone='pinkToOrange'
                className='px-2 py-1.5 text-base focus:box-shadow-none focus:ring-0'
              >
                <span className='text-base'>Lưu</span>
              </Button>
            </div>

            <div className='desc-body flex flex-col gap-6 px-9 max-sm:gap-3 overflow-y-auto rounded-xl overflow-scroll max-h-[33rem]'>
              <h1 className='text-3xl font-semibold max-sm:text-2xl'>{postData?.Title}</h1>{' '}
              <p className=' text-xl font-normal max-sm:text-base'>{postData?.Description}</p>
              {/* User info part */}
              <div className='creator-profile flex w-full items-center mt-auto gap-3'>
                <div className='creator-image rounded-full w-14 aspect-square overflow-hidden  shrink-0'>
                  {user ? (
                    <ProfileImage src={postData?.Created?.Avatar} alt='avatar' />
                  ) : (
                    <ProfileImage
                      src='https://static-images.vnncdn.net/files/publish/2023/6/30/mason-mount-1-228.jpg'
                      alt='stranger'
                      className='w-full'
                    />
                  )}
                </div>
                <div className='creator-name whitespace-nowrap overflow-hidden text-ellipsis flex flex-col'>
                  <div className='font-semibold'>{postData?.Created?.UserName}</div>
                  <div>{followers.length} người theo dõi</div>
                </div>
                {followButton}
              </div>
              {/* Comment part  */}
              <div>
                <Accordion className='hover:bg-none focus:ring-0 border-none hover:none dark:border-none focus:border-none'>
                  <Accordion.Panel className='hover:bg-none focus:ring-0'>
                    <Accordion.Title>
                      <h6 className='font-medium'>Nhận xét</h6>
                    </Accordion.Title>
                    {postData.IsComment === false ? (
                      <div className='text-stone-700'>Đã tắt nhận xét cho Ghim này</div>
                    ) : // Điều kiện thứ hai
                    postData.IsComment === true && comments.length === 0 ? (
                      <div className='text-stone-700'>
                        Chưa có nhận xét nào! Thêm nhận xét để bắt đầu cuộc trò chuyện.
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
                                  <div>{comment.content}</div>
                                </div>

                                <div className='flex gap-5'>
                                  <div className='cursor-pointer text-[#5F5F5F] text-base'>
                                    <div>{formatRelativeTime(comment.createdAt)}</div>
                                  </div>

                                  <div
                                    onClick={() => handleReplyClick(comment._id)}
                                    className='cursor-pointer text-[#5F5F5F] text-base font-semibold'
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
                                    className='px-4 py-3 rounded-xl bg-slate-100 resize-none'
                                    rows={1}
                                  />
                                  <div className='flex gap-2 justify-end mt-3'>
                                    <Button outline gradientDuoTone='tealToLime' onClick={handleCancelReply}>
                                      Huỷ
                                    </Button>
                                    <Button gradientDuoTone='purpleToPink' onClick={handleSendReply}>
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
                                className='reply-comment-section flex flex-col gap-2.5 ml-5 mt-[-8px]'
                              >
                                <div className='flex gap-3'>
                                  <div className='creator-image rounded-full w-10 h-10 aspect-square overflow-hidden shrink-0'>
                                    <ProfileImage src={reply.author.avatar} alt='stranger' />
                                  </div>
                                  <div className='creator-name whitespace-nowrap overflow-hidden text-ellipsis flex flex-col'>
                                    <div className='flex'>
                                      <div className='mr-3 text-red-700 font-semibold'>{reply.author.name}</div>
                                      <div className='mr-1 text-blue-700 font-semibold'>@{comment.author.name}</div>
                                      <div>{reply.content}</div>
                                    </div>
                                    <div className='flex gap-5'>
                                      <div className='cursor-pointer text-[#5F5F5F] text-base'>
                                        {formatRelativeTime(reply.createdAt)}
                                      </div>
                                      <div
                                        onClick={() => handleReplyToReplyClick(reply._id)}
                                        className='cursor-pointer text-[#5F5F5F] text-base font-semibold'
                                      >
                                        {'Trả lời'}
                                      </div>
                                    </div>
                                    {isReplying && selectedReplyId === reply._id && (
                                      <div>
                                        <Textarea
                                          id='reply'
                                          placeholder={`Trả lời ${reply.author.name}...`}
                                          value={replyContent}
                                          onChange={(e) => setReplyContent(e.target.value)}
                                          required
                                          className='px-4 py-3 rounded-xl bg-slate-100 resize-none'
                                          rows={1}
                                        />
                                        <div className='flex gap-2 justify-end mt-3'>
                                          <Button outline gradientDuoTone='tealToLime' onClick={handleCancelReply1}>
                                            Huỷ
                                          </Button>
                                          <Button gradientDuoTone='purpleToPink' onClick={handleSendReply1}>
                                            Gửi
                                          </Button>
                                        </div>
                                      </div>
                                    )}
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
                                      <div className='creator-name whitespace-nowrap overflow-hidden text-ellipsis flex flex-col  '>
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
                                            className='cursor-pointer text-[#5F5F5F] text-base font-semibold'
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

            {/* Comment box section */}
            {postData.IsComment ? (
              <div className='comment-box flex flex-col gap-3 px-5 py-3 max-sm:gap-2 rounded overflow-hidden min-h-30 mt-4 bg-gradient-to-r from-orange-300 to-red-300 absolute bottom-0 w-full border-t-2 border-zinc-400'>
                <h6>{getTotalCommentsAndReplies(comments)} Nhận xét</h6>

                <div className='flex gap-3'>
                  <div className='creator-image rounded-full w-12 aspect-square  shrink-0'>
                    <ProfileImage src={UserAvatar} alt='stranger' className='w-10 h-10' />
                  </div>
                  <div className='creator-name font-medium whitespace-nowrap text-ellipsis w-full'>
                    <Textarea
                      id='comment'
                      placeholder='Chia sẻ gì đó...'
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      required
                      rows={1}
                      className='px-4 py-3.5 rounded-full resize-none'
                    />
                  </div>
                  <Button
                    pill
                    onClick={handleSendComment}
                    gradientDuoTone='pinkToOrange'
                    color='failure'
                    className='px-2'
                  >
                    <HiOutlineArrowRight className='h-6 w-6' />
                  </Button>
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailPin
