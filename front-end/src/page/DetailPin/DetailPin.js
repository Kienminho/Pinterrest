import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { createAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'
import { FaRegArrowAltCircleLeft } from 'react-icons/fa'
import SuspenseImg from '../../components/SuspenseImg/SuspenseImg'
import { Button, Textarea } from 'flowbite-react'
import { ProfileImage } from '../../components/ProfileImage/ProfileImage'
import { createComment, followUser, getUserByEmail, replyComment } from '../../store/apiRequest'
import moment from 'moment'
import 'moment/locale/vi'

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
  const [replyContent, setReplyContent] = useState('')
  const [comments, setComments] = useState([])
  const [selectedCommentId, setSelectedCommentId] = useState(null)
  console.log(comments)
  const [isReplyingToReply, setIsReplyingToReply] = useState(false)
  const [selectedReplyId, setSelectedReplyId] = useState(null)
  const [followers, setFollowers] = useState([])

  const user = useSelector((state) => state.Auth.login?.currentUser)
  const { Avatar, UserName, _id: UserId } = useSelector((state) => state.User)
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

  // Lấy danh sách follower của user
  useEffect(() => {
    const getFollowersFromServer = async () => {
      try {
        const resData = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/get-follower`, {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        })
        console.log(resData)

        const followersData = resData.data.data
        console.log(followersData)

        if (followersData) {
          setFollowers(followersData)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getFollowersFromServer()
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

  const handleFollowUser = async () => {
    try {
      const creatorId = postData?.Created?._id

      const resData = await followUser(UserId, creatorId, accessToken_daniel, axiosJWT)
      console.log('🚀', resData)
    } catch (error) {
      console.log(error)
    }
  }

  const getTotalCommentsAndReplies = (comments) => {
    let total = 0

    // Lặp qua từng bình luận
    comments.forEach((comment) => {
      // Tăng số lượng bình luận lên 1
      total++

      // Nếu có các phản hồi, gọi đệ qui để tính số lượng phản hồi và cộng vào tổng
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
          <div className=' w-[570px] desc-container max-sm:px-2 max-sm:w-auto bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 relative'>
            <div className='desc-container-header pt-9 px-9 pb-5 flex justify-end max-sm:pt-5 max-sm:justify-start'>
              {/* <Button pinId={id} savedBy={saves} /> */}
              <Button gradientDuoTone='pinkToOrange' className='rounded-full px-2 py-1.5'>
                Save
              </Button>
            </div>

            <div className='desc-body flex flex-col gap-6 px-9 max-sm:gap-3 overflow-y-auto rounded-xl overflow-scroll max-h-[33rem]'>
              <h1 className=' capitalize text-4xl font-semibold max-sm:text-3xl'>{postData?.Title}</h1>{' '}
              <p className=' text-xl max-sm:text-base'>{postData?.Description}</p>
              {/* User info part */}
              <div className='creator-profile flex w-full items-center mt-auto gap-3'>
                <div className='creator-image rounded-full w-14 aspect-square overflow-hidden opacity-80 shrink-0'>
                  {user ? (
                    <ProfileImage src={Avatar} alt='avatar' />
                  ) : (
                    <ProfileImage
                      src='https://static-images.vnncdn.net/files/publish/2023/6/30/mason-mount-1-228.jpg'
                      alt='stranger'
                      className='w-full'
                    />
                  )}
                </div>
                <div className='creator-name font-medium opacity-80 capitalize whitespace-nowrap overflow-hidden text-ellipsis flex flex-col'>
                  <div>{UserName}</div>
                  <div>{followers.length} người theo dõi</div>
                </div>
                <div className='creator-follow ml-auto'>
                  <Button gradientDuoTone='greenToBlue' className='rounded-full px-1 py-1.5' onClick={handleFollowUser}>
                    Theo dõi
                  </Button>
                </div>
              </div>
              {/* Comment part  */}
              <h6>Comments section</h6>
              {/* Hiển thị danh sách bình luận */}
              {comments.map((comment) => (
                <div key={comment._id} className='comment-section flex flex-col w-full gap-1'>
                  <div className='flex gap-3'>
                    <div className='creator-image rounded-full w-10 h-10 aspect-square overflow-hidden opacity-80 shrink-0'>
                      <ProfileImage src={comment.author.avatar} alt='strangers' />
                    </div>
                    <div className='creator-name font-medium opacity-80 capitalize whitespace-nowrap overflow-hidden text-ellipsis flex flex-col'>
                      <div className='flex'>
                        {' '}
                        <div className='mr-3 text-green-700 font-bold'>{comment.author.name}</div>
                        <div>{comment.content}</div>
                      </div>

                      <div className='flex gap-5'>
                        <div>
                          <div>{formatRelativeTime(comment.createdAt)}</div>
                        </div>

                        <div onClick={() => handleReplyClick(comment._id)} className='cursor-pointer text-orange-500'>
                          {'reply'}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Hộp trả lời 1 bình luận */}
                  <div className='w-3/5 ml-36'>
                    {isReplying && selectedCommentId === comment._id && (
                      <div className='mt-2'>
                        <Textarea
                          id='reply'
                          placeholder='Reply...'
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          required
                          className='px-4 py-3 rounded-xl bg-slate-100 '
                          rows={1}
                        />
                        <div className='flex gap-2 justify-end mt-3'>
                          <Button outline gradientDuoTone='tealToLime' onClick={handleCancelReply}>
                            Cancel
                          </Button>
                          <Button gradientDuoTone='purpleToPink' onClick={handleSendReply}>
                            Send
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hiển thị danh sách trả lời của 1 bình luận */}
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className='reply-comment-section flex flex-col gap-3 ml-5 mt-3'>
                      <div className='flex gap-3'>
                        <div className='creator-image rounded-full w-10 h-10 aspect-square overflow-hidden opacity-80 shrink-0'>
                          <ProfileImage src={reply.author.avatar} alt='stranger' />
                        </div>
                        <div className='creator-name font-medium opacity-80 capitalize whitespace-nowrap overflow-hidden text-ellipsis flex flex-col'>
                          <div className='flex'>
                            <div className='mr-3 text-green-700 font-bold'>{reply.author.name}</div>
                            <div className='mr-1 text-blue-700 font-semibold'>@{comment.author.name}</div>
                            <div>{reply.content}</div>
                          </div>
                          <div className='flex gap-5'>
                            <div>{formatRelativeTime(reply.createdAt)}</div>
                            <div
                              onClick={() => handleReplyToReplyClick(reply._id)}
                              className='cursor-pointer text-orange-500'
                            >
                              {'reply'}
                            </div>
                          </div>
                          {isReplying && selectedReplyId === reply._id && (
                            <div className='mt-2'>
                              <Textarea
                                id='reply'
                                placeholder={`Reply to ${reply.author.name}...`}
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                required
                                className='px-4 py-3 rounded-xl bg-slate-100 '
                                rows={1}
                              />
                              <div className='flex gap-2 justify-end mt-3'>
                                <Button outline gradientDuoTone='tealToLime' onClick={handleCancelReply1}>
                                  Cancel
                                </Button>
                                <Button gradientDuoTone='purpleToPink' onClick={handleSendReply1}>
                                  Send
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
                            className={`nested-reply-comment-section flex gap-3 ${index !== 0 ? 'mt-2' : ''}`}
                          >
                            <div className='creator-image rounded-full w-10 h-10 aspect-square overflow-hidden opacity-80 shrink-0'>
                              <ProfileImage src={nestedReply.author.avatar} alt='stranger' />
                            </div>
                            <div className='creator-name font-medium capitalize whitespace-nowrap overflow-hidden text-ellipsis flex flex-col opacity-80 '>
                              <div className='flex'>
                                <div className='mr-3 text-green-700 font-bold'>{nestedReply.author.name}</div>
                                <div className='mr-1 text-blue-700 font-semibold'>@{reply.author.name}</div>
                                <div>{nestedReply.content}</div>
                              </div>
                              <div className='flex gap-5'>
                                <div>{formatRelativeTime(nestedReply.createdAt)}</div>
                                <div
                                  onClick={() => handleReplyClick(comment._id)}
                                  className='cursor-pointer text-orange-500'
                                >
                                  {'reply'}
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
            </div>

            {/* Comment box section */}
            <div className='comment-box flex flex-col gap-3 px-5 py-3 max-sm:gap-2 rounded overflow-hidden min-h-30 mt-4 bg-gradient-to-r from-indigo-300 to-purple-400 absolute bottom-0 w-full'>
              <h6>{getTotalCommentsAndReplies(comments)} comments</h6>

              <div className='flex gap-3'>
                <div className='creator-image rounded-full w-12 aspect-square opacity-80 shrink-0'>
                  <ProfileImage src={Avatar} alt='stranger' />
                </div>
                <div className='creator-name font-medium capitalize whitespace-nowrap text-ellipsis w-full'>
                  <Textarea
                    id='comment'
                    placeholder='Add a comment...'
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    required
                    rows={1}
                    className='px-4 py-3 rounded-full'
                  />
                </div>
                <Button gradientDuoTone='pinkToOrange' onClick={handleSendComment} className='rounded-full px-3'>
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailPin
