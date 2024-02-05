import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { createAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'
import { FaRegArrowAltCircleLeft } from 'react-icons/fa'
import SuspenseImg from '../../components/SuspenseImg/SuspenseImg'
import { Button, Textarea } from 'flowbite-react'
import { ProfileImage } from '../../components/ProfileImage/ProfileImage'
import { createComment, replyComment } from '../../store/apiRequest'
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
  const [replyComments, setReplyComments] = useState([])

  const user = useSelector((state) => state.Auth.login?.currentUser)
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  let axiosJWT = createAxios(user, dispatch, loginSuccess)

  const accessToken_daniel = user?.data?.AccessToken

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleReplyClick = (commentId) => {
    setIsReplying(true)
    setSelectedCommentId(commentId)
    setReplyContent('')
  }

  const handleReplyClick1 = (parrentId) => {
    setIsReplying(true)
    setSelectedCommentId(parrentId)
    setReplyContent('')
  }

  const handleCancelReply = () => {
    setIsReplying(false)
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

        if (allComments) {
          // Gom nhóm reply comments theo commentId
          const groupedReplyComments = allComments.reduce((acc, comment) => {
            if (comment.replies) {
              comment.replies.forEach((reply) => {
                acc[comment._id] = acc[comment._id] || []
                acc[comment._id].push(reply)
              })
            }
            return acc
          }, {})

          console.log('🚀', groupedReplyComments)

          setReplyComments(groupedReplyComments)

          // Lọc ra danh sách comments chính (không phải reply)
          const mainComments = allComments.filter((comment) => comment._id)
          console.log(mainComments)
          setComments(mainComments)
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (id) {
      getCommentsFromServer()
    }
  }, [comments])

  const handleSendComment = async () => {
    try {
      // Gọi hàm createComment với các thông tin cần thiết
      const result = await createComment(
        id,
        commentContent,
        postData?.Attachment?.Thumbnail,
        accessToken_daniel,
        axiosJWT
      )
      if (result) {
        console.log('New comment created successfully:', result)
      }
    } catch (error) {
      console.log('Error creating comment:', error)
    }

    setCommentContent('')
  }

  const handleSendReply = async () => {
    try {
      // Gọi hàm replyComment với các thông tin cần thiết
      const result = await replyComment(
        id,
        selectedCommentId,
        replyContent,
        postData.Attachment.Thumbnail,
        accessToken_daniel,
        axiosJWT
      )
      console.log(result)

      if (result) {
        console.log('New comment created successfully:', result)
      }
    } catch (error) {
      console.log('Error replying comment:', error)
    }

    setIsReplying(false)
    setReplyContent('')
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
          <div className=' w-[570px] desc-container max-sm:px-2 max-sm:w-auto bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400'>
            <div className='desc-container-header pt-9 px-9 pb-5 flex justify-end max-sm:pt-5 max-sm:justify-start'>
              {/* <Button pinId={id} savedBy={saves} /> */}
              <Button gradientDuoTone='pinkToOrange'>Save</Button>
            </div>

            <div className='desc-body flex flex-col gap-8 px-9 max-sm:gap-3 overflow-y-auto max-h-[25rem] rounded-xl overflow-scroll'>
              <h1 className=' capitalize text-4xl font-semibold max-sm:text-3xl'>{postData?.Title}</h1>{' '}
              <p className=' text-xl max-sm:text-base'>{postData?.Description}</p>
              {/* User info part */}
              <div className='creator-profile flex w-full items-center mt-auto gap-3'>
                <div className='creator-image rounded-full w-14 aspect-square overflow-hidden opacity-80 shrink-0'>
                  {user?.userPic ? (
                    <ProfileImage
                      src='https://static-images.vnncdn.net/files/publish/2023/6/30/mason-mount-1-228.jpg'
                      alt='stranger'
                    />
                  ) : (
                    <ProfileImage
                      src='https://static-images.vnncdn.net/files/publish/2023/6/30/mason-mount-1-228.jpg'
                      alt='stranger'
                      className='w-full'
                    />
                  )}
                </div>
                <div className='creator-name font-medium opacity-80 capitalize whitespace-nowrap overflow-hidden text-ellipsis flex flex-col'>
                  <div>{postData?.Created?.UserName}</div>
                  <div>{'12 followers'}</div>
                </div>
                <div className='creator-follow ml-auto'>
                  <Button gradientDuoTone='greenToBlue'>Follow</Button>
                </div>
              </div>
              {/* Comment part  */}
              <h6>Comments section</h6>
              {/* Hiển thị danh sách bình luận */}
              {comments.map((comment) => (
                <div key={comment._id} className='comment-section flex flex-col w-full'>
                  <div className='flex gap-3'>
                    <div className='creator-image rounded-full w-10 h-10 aspect-square overflow-hidden opacity-80 shrink-0'>
                      <ProfileImage
                        src={'https://cdn.icon-icons.com/icons2/2438/PNG/512/boy_avatar_icon_148455.png'}
                        alt='stranger'
                      />
                    </div>
                    <div className='creator-name font-medium opacity-80 capitalize whitespace-nowrap overflow-hidden text-ellipsis flex flex-col'>
                      <div className='flex'>
                        {' '}
                        <div className='mr-3 text-dark_explore'>{comment.author.name}</div>
                        <div>{comment.content}</div>
                      </div>

                      <div className='flex gap-5'>
                        <div>
                          <div>{formatRelativeTime(comment.createdAt)}</div>
                        </div>

                        <div onClick={() => handleReplyClick(comment._id)} className='cursor-pointer text-blue-700'>
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

                  {/* Hiển thị danh sách reply comments */}
                  <div className='w-full ml-8'>
                    {replyComments[comment._id] &&
                      replyComments[comment._id].map((reply) => (
                        <div key={reply._id}>
                          <div className='flex gap-3 mt-3'>
                            {/* Hiển thị thông tin người tạo reply */}
                            <div className='creator-image rounded-full w-10 h-10 aspect-square overflow-hidden opacity-80 shrink-0'>
                              <ProfileImage
                                src={'https://cdn-icons-png.freepik.com/512/186/186313.png'}
                                alt='stranger'
                              />
                            </div>
                            <div className='creator-name font-medium opacity-80 capitalize whitespace-nowrap overflow-hidden text-ellipsis flex flex-col'>
                              <div className='flex'>
                                {' '}
                                <div className='mr-3 text-dark_explore'>{reply.author.name}</div>
                                <div>{reply.content}</div>
                              </div>

                              <div className='flex gap-5'>
                                <div>
                                  <div>{formatRelativeTime(reply.createdAt)}</div>
                                </div>

                                <div
                                  onClick={() => handleReplyClick1(reply.parentComment)}
                                  className='cursor-pointer text-blue-700'
                                >
                                  {'reply'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Comment box section */}
            <div className='comment-box flex flex-col gap-5 p-4 max-sm:gap-2 rounded overflow-hidden min-h-32 mt-6 bg-gradient-to-r from-indigo-300 to-purple-400'>
              <h6>{comments.length} comments</h6>

              <div className='flex gap-3'>
                <div className='creator-image rounded-full w-12 aspect-square  opacity-80 shrink-0'>
                  <ProfileImage
                    src={
                      'https://e7.pngegg.com/pngimages/178/419/png-clipart-man-illustration-computer-icons-avatar-login-user-avatar-child-web-design-thumbnail.png'
                    }
                    alt='stranger'
                  />
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
                <Button gradientDuoTone='pinkToOrange' onClick={handleSendComment} className='rounded-full px-2'>
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
