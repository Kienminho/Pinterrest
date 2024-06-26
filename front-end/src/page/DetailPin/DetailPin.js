import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { CreateAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'
import { FaRegArrowAltCircleLeft } from 'react-icons/fa'
import { MdSend } from 'react-icons/md'

import SuspenseImg from '../../components/SuspenseImg/SuspenseImg'
import { ProfileImage } from '../../components/ProfileImage/ProfileImage'
import { createComment, createReaction, getAllReactions, getReactionByUser, replyComment } from '../../store/apiRequest'
import 'moment/locale/vi'
import { followUser, unfollowUser } from '../../store/slices/FollowingSlice'
import toast from 'react-hot-toast'
import './DetailPin.css'
import { Spin } from 'antd'
import ImageDownloader from '../../components/ImageDownloader/ImageDownloader'
import { Comment } from '../../components/Comment/Comment'
import { ReplyInput } from '../../components/ReplyInput/ReplyInput'
import { ReplyComment } from '../../components/ReplyComment/ReplyComment'
import { savePost, unsavePost } from '../../store/slices/SavePostSlice'
// import Heart from 'react-animated-heart'
import Heart from '@react-sandbox/heart'
import FBReactions from '../../components/FBReactions/FBReactions'
import ReactionStats from '../../components/ReactionStats/ReactionStats'

const DetailPin = () => {
  const [postData, setPostData] = useState({})
  const [isReplying, setIsReplying] = useState(false)
  const [isReplyingToReply, setIsReplyingToReply] = useState(false)
  const [isReplyingToNestedReply, setIsReplyingToNestedReply] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [finishCmt, setFinishCmt] = useState(false)
  const [finishRep, setFinishRep] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [comments, setComments] = useState([])
  const [selectedCommentId, setSelectedCommentId] = useState(null)
  const [selectedReplyId, setSelectedReplyId] = useState(null)
  const [selectedNestedReplyId, setSelectedNestedReplyId] = useState(null)
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [followersOther, setFollowersOther] = useState([])
  const [followingOther, setFollowingOther] = useState([])
  const [loadingCmt, setLoadingCmt] = useState(true)
  const [loadingPost, setLoadingPost] = useState(true)
  const [active, setActive] = useState(false)
  const [reactionList, setReactionList] = useState([])
  const [reactedType, setReactedType] = useState('')

  const { savedPosts } = useSelector((state) => {
    return state.SavePost
  })

  const isPostSaved = savedPosts?.includes(postData?._id)
  console.log('lưu post chưa ', isPostSaved)

  const { followingList } = useSelector((state) => {
    return state.Following
  })

  const idOther = postData?.Created?._id
  console.log(idOther)

  const isFollowing = followingList?.includes(postData?.Created?._id)

  const user = useSelector((state) => state.Auth.login?.currentUser)
  const { Avatar: UserAvatar, _id: UserId } = useSelector((state) => state.User)
  const isCurrentUser = user && UserId === postData?.Created?._id
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  let axiosJWT = CreateAxios(user, dispatch, loginSuccess)
  const accessToken_daniel = user?.data?.AccessToken

  const handleGoBack = () => {
    navigate(-1)
  }

  // create reaction
  const handleReactionSelect = async (selectedReaction) => {
    try {
      const res = await createReaction(postData._id, UserId, selectedReaction, true, accessToken_daniel, axiosJWT)
      if (res.statusCode === 200) {
        setActive(true)
        // toast.success('Đã thích bài viết')
      } else {
        toast.error('Thích bài viết không thành công')
      }
    } catch (error) {
      console.log('Error creating reaction:', error)
    }
  }

  // get all reactions of post
  useEffect(() => {
    const getReactions = async () => {
      try {
        const res = await getAllReactions(1, 50, postData._id, accessToken_daniel, axiosJWT)
        if (res.statusCode === 200) {
          setReactionList(res.data)
        }
      } catch (error) {
        console.log('Error getting reactions:', error)
      }
    }
    getReactions()
  }, [active])

  // check reacted this post or not
  useEffect(() => {
    const checkReacted = async () => {
      try {
        const res = await getReactionByUser(postData._id, UserId, accessToken_daniel, axiosJWT)
        if (res.statusCode === 200 && res.data !== '') {
          setActive(false)
          setReactedType(res.data)
        }
      } catch (error) {
        console.log('Error getting reactions:', error)
      }
    }
    checkReacted()
  }, [reactionList])

  console.log('active', active)

  // Cấp 1: Cmt chính -> Reply (cmtId)
  const handleReplyClick = (commentId) => {
    setIsReplying(true)
    setSelectedCommentId(commentId)
    setReplyContent('')
  }

  // Cấp 2: Cmt phụ cấp 1 -> Reply (replyId)
  const handleReplyToReplyClick = (replyId) => {
    setSelectedCommentId(null) // Đặt về null để tránh trạng thái đang trả lời comment chính
    setIsReplyingToReply(true)
    setSelectedReplyId(replyId)
    setReplyContent('')
  }

  // Cấp 3: Cmt phụ cấp 2 -> Reply (nestedReplyId)
  const handleReplyToNestedReplyClick = (nestedReplyId) => {
    setSelectedCommentId(null) // Đặt về null để tránh trạng thái đang trả lời comment chính
    setSelectedReplyId(null) // Đặt về null để tránh trạng thái đang trả lời comment phụ cấp 1
    setIsReplyingToNestedReply(true)
    setSelectedNestedReplyId(nestedReplyId)
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

  const handleCancelReply2 = () => {
    setIsReplying(false)
    setIsReplyingToReply(false)
    setIsReplyingToNestedReply(false)
    setSelectedCommentId(null)
    setSelectedReplyId(null)
    setSelectedNestedReplyId(null)
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
      } else {
        toast.error('Bình luận không thành công')
        setCommentContent('')
        setFinishCmt(true)
      }
    } catch (error) {
      setFinishCmt(true)
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

      if (result.statusCode === 200) {
        toast.success('Trả lời nhận xét thành công!')
        setReplyContent('')
        setFinishRep(true)
      } else {
        toast.error('Trả lời nhận xét không thành công!')
        setReplyContent('')
        setFinishRep(true)
      }
    } catch (error) {
      setFinishRep(true)
      console.log('Error replying comment:', error)
    }

    setIsReplying(false)
    setReplyContent('')
  }

  const handleSendReply1 = async () => {
    try {
      const result = await replyComment(
        postData?._id,
        selectedReplyId,
        replyContent,
        postData?.Attachment,
        accessToken_daniel,
        axiosJWT
      )

      if (result) {
        toast.success('Trả lời nhận xét thành công!')
        setReplyContent('')
        setFinishRep(true)
      } else {
        toast.error('Trả lời nhận xét không thành công!')
        setReplyContent('')
        setFinishRep(true)
      }
    } catch (error) {
      setFinishRep(true)
      console.log('Error replying comment:', error)
    }

    setIsReplying(false)
    setIsReplyingToReply(false)
    setSelectedCommentId(null)
    setSelectedReplyId(null)
    setReplyContent('')
  }

  const handleSendReply2 = async () => {
    try {
      const result = await replyComment(
        postData?._id,
        selectedNestedReplyId,
        replyContent,
        postData?.Attachment,
        accessToken_daniel,
        axiosJWT
      )

      if (result) {
        toast.success('Trả lời nhận xét thành công!')
        setReplyContent('')
        setFinishRep(true)
      } else {
        toast.error('Trả lời nhận xét không thành công!')
        setReplyContent('')
        setFinishRep(true)
      }
    } catch (error) {
      setFinishRep(true)
      console.log('Error replying comment:', error)
    }

    setIsReplying(false)
    setIsReplyingToReply(false)
    setIsReplyingToNestedReply(false)
    setSelectedCommentId(null)
    setSelectedReplyId(null)
    setSelectedNestedReplyId(null)
    setReplyContent('')
  }

  const handleFollowUser = async () => {
    try {
      const res = await axiosJWT.post(
        `${process.env.REACT_APP_API_URL}/user/follow`,
        {
          follower: UserId,
          following: postData?.Created?._id
        },
        {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        }
      )
      if (res.data.statusCode === 200) {
        dispatch(followUser(postData?.Created?._id))
        toast.success('Theo dõi thành công!')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUnFollowUser = async () => {
    try {
      const targetUnfollow = following.find((item) => item.following._id === postData?.Created?._id)
      const targetUnfollowId = targetUnfollow?._id
      const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/user/un-follow/${targetUnfollowId}`, {
        headers: { authorization: `Bearer ${accessToken_daniel}` }
      })
      if (res.data.statusCode === 200) {
        dispatch(unfollowUser(postData?.Created?._id))
        toast.success('Huỷ theo dõi thành công!')
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Khi người dùng nhấn vào nút "Theo dõi" hoặc "Bỏ theo dõi"
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

  const handleSavedPost = async () => {
    try {
      const res = await axiosJWT.post(
        `${process.env.REACT_APP_API_URL}/post/save-post`,
        { postId: postData?._id, userId: UserId },
        {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        }
      )
      if (res.data.statusCode === 200) {
        dispatch(savePost(postData?._id))
        toast.success('Lưu bài viết thành công!')
      }
    } catch (error) {
      console.log('Error saving post:', error)
      toast.error('Lưu bài viết thất bại!')
    }
  }

  const handleUnsavePost = async () => {
    try {
      const res = await axiosJWT.post(
        `${process.env.REACT_APP_API_URL}/post/unsave-post`,
        { postId: postData?._id, userId: UserId },
        {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        }
      )
      if (res.data.statusCode === 200) {
        dispatch(unsavePost(postData?._id))
        toast.success('Hủy lưu bài viết thành công!')
      }
    } catch (error) {
      console.log('Error saving post:', error)
      toast.error('Hủy lưu bài viết thất bại!')
    }
  }

  // Lấy thông tin chi tiết 1 post từ server
  useEffect(() => {
    const getDetailPostFromServer = async () => {
      try {
        const resData = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/post/get-detail-post/${id}`, {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        })
        if (resData.data.statusCode === 200) {
          const postData = resData.data.data
          setPostData(postData)
          setLoadingPost(false)
        } else {
          setLoadingPost(false)
        }
      } catch (error) {
        setLoadingPost(false)
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
        if (resData.data.statusCode === 200) {
          const allComments = resData.data.data
          setComments(allComments)
          setLoadingCmt(false)
          setFinishCmt(false)
          setFinishRep(false)
        } else {
          setLoadingCmt(false)
        }
      } catch (error) {
        setLoadingCmt(false)
        setFinishCmt(false)
        setFinishRep(false)
        console.log(error)
      }
    }

    if (id || finishCmt || finishRep) {
      // Thêm finishCmt và finishRep vào điều kiện
      getCommentsFromServer()
    }
  }, [id, finishCmt, finishRep])

  // Lấy danh sách follower và following của người dùng hiện tại
  useEffect(() => {
    const fetchDataFromServer = async () => {
      try {
        // Gọi API để lấy danh sách follower
        const followersRes = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/get-follower/${UserId}`, {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        })
        const followersData = followersRes.data.data
        if (followersData) {
          setFollowers(followersData)
        }

        // Gọi API để lấy danh sách following
        const followingRes = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/get-following/${UserId}`, {
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

  // Lấy danh sách follower và following của người dùng chủ bài đăng
  useEffect(() => {
    const fetchDataFromServer = async () => {
      try {
        // Gọi API để lấy danh sách follower
        const followersRes = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/get-follower/${idOther}`, {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        })
        const followersData = followersRes.data.data
        if (followersData) {
          setFollowersOther(followersData)
        }

        // Gọi API để lấy danh sách following
        const followingRes = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/get-following/${idOther}`, {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        })
        const followingData = followingRes.data.data
        if (followingData) {
          setFollowingOther(followingData)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchDataFromServer()
  }, [postData])

  const handleShowProfile = () => {
    navigate(`/profiles/${postData?.Created?._id}`)
  }

  console.log(followers)
  console.log(followersOther)
  return (
    <div className='detail-pin-container minus-nav-100vh font-inter'>
      <div className='flex min-h-full justify-center relative '>
        {/* back button */}
        <div className='absolute go-back top-7 left-7 max-sm:hidden'>
          <button className='left-arrow rounded-full hover:bg-hover_dark p-2  transition' onClick={handleGoBack}>
            <FaRegArrowAltCircleLeft size='2rem' />
          </button>
        </div>
        {/* pin section */}
        <div
          className={`pin-section flex md:m-10 lg:m-20 rounded-3xl overflow-hidden my-14 max-sm:rounded-none max-sm:my-0 max-sm:pb-24 max-sm:flex-col max-sm:px-2 max-sm:w-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-light_blue ${
            comments.length > 0 ? 'min-h-[800px]' : 'min-h-[600px]'
          }`}
        >
          {/* image left handside */}
          <div className='visual-pin-container w-[550px] max-sm:w-auto '>
            <SuspenseImg
              className='w-full rounded-l-3xl'
              src={postData?.Attachment?.Thumbnail}
              fileName={postData?.Attachment?.Thumbnail}
              alt='post_image'
              height={500}
            />
          </div>

          {/* description right handside */}
          <div className='w-[550px] desc-container max-sm:px-2 max-sm:w-auto relative'>
            <div className='desc-container-header pt-9 px-9 pb-7 flex justify-between items-center max-sm:pt-5'>
              <ImageDownloader imageUrl={postData?.Attachment?.Thumbnail} />
              {isPostSaved ? (
                <button
                  onClick={handleUnsavePost}
                  className='btn-pink bg-pink-100 text-pink-600 border border-pink-200 rounded-full py-3 px-6'
                >
                  Đã lưu
                </button>
              ) : (
                <button
                  onClick={handleSavedPost}
                  className='btn-pink bg-pink-600 hover:bg-pink-700 rounded-full py-2.5 px-6'
                >
                  <span className='text-base'>Lưu</span>
                </button>
              )}
            </div>

            <div className={`desc-body flex flex-col gap-7 px-7 max-sm:gap-3 overflow-scroll h-[70%] mb-5`}>
              <span className='text-3xl font-medium max-sm:text-2xl text-white'>{postData?.Title}</span>{' '}
              <span className='text-[18px] font-normal max-sm:text-base text-zinc-300'>{postData?.Description}</span>
              {/* User info part */}
              <div className='creator-profile flex w-full items-center gap-1'>
                <div
                  className='creator-image rounded-full w-14 aspect-square overflow-hidden shrink-0 hover:bg-blue-300 cursor-pointer p-1'
                  onClick={handleShowProfile}
                >
                  {user ? (
                    <ProfileImage src={postData?.Created?.Avatar} />
                  ) : (
                    <ProfileImage
                      src='https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-avatar-placeholder-png-image_3416697.jpg'
                      alt='stranger'
                      className='w-full'
                    />
                  )}
                </div>
                <div className='creator-name whitespace-nowrap overflow-hidden text-ellipsis flex flex-col text-white cursor-pointer gap-1 hover:text-gray-300 p-2 transition duration-200 rounded-xl'>
                  <div className='font-semibold' onClick={handleShowProfile}>
                    {postData?.Created?.UserName}
                  </div>
                  <div className='text-zinc-300'>
                    {UserId === postData?.Created?._id ? followers?.length : followersOther?.length} người theo dõi
                  </div>
                </div>
                {/* Nếu là người dùng hiện tại, ẩn nút "Theo dõi" */}
                {!isCurrentUser && (
                  <div className='creator-follow ml-auto'>
                    {isFollowing ? (
                      <button
                        onClick={handleUnFollowUser}
                        className='btn-pink bg-pink-100 text-pink-600 border border-pink-200 rounded-full py-3 px-6 text-[15px]'
                      >
                        Đã theo dõi
                      </button>
                    ) : (
                      <button
                        onClick={handleFollowUser}
                        className='btn-pink bg-pink-600 hover:bg-pink-700 rounded-full py-3 px-6'
                      >
                        <span className='text-base'>Theo dõi</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
              {/* Comment part  */}
              <div>
                <>
                  {postData.IsComment === false ? (
                    <button disabled className='text-zinc-300 -mt-10 text-left'>
                      Đã tắt nhận xét cho Ghim này
                    </button>
                  ) : // Điều kiện thứ hai
                  !loadingCmt && !loadingPost && postData.IsComment === true && comments.length === 0 ? (
                    <button disabled className='text-zinc-300 -mt-10 text-left'>
                      Chưa có nhận xét nào! Thêm nhận xét để bắt đầu.
                    </button>
                  ) : loadingCmt && loadingPost ? (
                    <div className='flex items-center justify-center absolute inset-0 bg-light_blue'>
                      <Spin size='large' />
                    </div>
                  ) : (
                    <>
                      {/* Hiển thị danh sách bình luận */}
                      {comments.map((comment) => (
                        <div
                          key={comment._id}
                          className={`comment-section flex flex-col w-full gap-2 ${
                            comment.replies.length > 0 ? 'mt-5' : 'mt-3'
                          }`}
                        >
                          {/* Hiển thị bình luận chính */}
                          <Comment comment={comment} handleReplyClick={handleReplyClick} />

                          {/* Ô input trả lời bình luận chính */}
                          <ReplyInput
                            isReplying={isReplying && selectedCommentId === comment._id}
                            onReplyCancel={handleCancelReply}
                            onReplySend={handleSendReply}
                            handleChange={(e) => setReplyContent(e.target.value)}
                            placeholder={`Trả lời ${comment.author.name}...`}
                          />

                          {/* Hiển thị danh sách trả lời của bình luận chính */}
                          {comment.replies.map((reply) => (
                            <div key={reply._id} className='reply-comment-section flex flex-col gap-1 ml-10'>
                              {/* Hiển thị trả lời */}
                              <ReplyComment
                                comment={reply}
                                parentAuthor={comment.author.name}
                                handleClick={handleReplyToReplyClick}
                              />

                              {/* Ô input trả lời của 1 trả lời */}
                              <ReplyInput
                                isReplying={isReplyingToReply && selectedReplyId === reply._id}
                                onReplyCancel={handleCancelReply1}
                                onReplySend={handleSendReply1}
                                handleChange={(e) => setReplyContent(e.target.value)}
                                placeholder={`Trả lời ${reply.author.name}...`}
                              />

                              {/* Hiển thị danh sách trả lời của 1 trả lời */}
                              {reply.replies.map((nestedReply) => (
                                <div
                                  key={nestedReply._id}
                                  className={`reply-reply-section flex flex-col mt-1 mb-3 ml-10`}
                                >
                                  {/* Hiển thị trả lời cấp 2 */}
                                  <ReplyComment
                                    comment={nestedReply}
                                    parentAuthor={reply.author.name}
                                    handleClick={handleReplyToNestedReplyClick}
                                  />
                                  {/* toi day roi la 3 cap */}
                                  {/* Ô input trả lời của 1 trả lời cấp 2 */}
                                  <ReplyInput
                                    isReplying={isReplyingToNestedReply && selectedNestedReplyId === nestedReply._id}
                                    onReplyCancel={handleCancelReply2}
                                    onReplySend={handleSendReply2}
                                    handleChange={(e) => setReplyContent(e.target.value)}
                                    placeholder={`Trả lời ${nestedReply.author.name}...`}
                                  />

                                  {/* Hiển thị danh sách trả lời của 1 trả lời cấp 2 */}
                                  {nestedReply.replies.map((nestedReply1) => (
                                    <div key={nestedReply1._id} className={`reply-reply-section flex flex-col mt-3`}>
                                      {/* Hiển thị trả lời cấp 3 */}
                                      <ReplyComment
                                        comment={nestedReply1}
                                        parentAuthor={nestedReply.author.name}
                                        handleClick={handleReplyToNestedReplyClick}
                                      />

                                      {/* Ô input trả lời của 1 trả lời cấp 3 */}
                                      <ReplyInput
                                        isReplying={
                                          isReplyingToNestedReply && selectedNestedReplyId === nestedReply1._id
                                        }
                                        onReplyCancel={handleCancelReply2}
                                        onReplySend={handleSendReply2}
                                        handleChange={(e) => setReplyContent(e.target.value)}
                                        placeholder={`Trả lời cmt ${nestedReply1.author.name}...`}
                                      />
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      ))}
                    </>
                  )}
                </>
              </div>
            </div>

            <div
              className={`desc-commentbox-main bottom-0 right-0 left-0 ${window.innerWidth >= 768 ? 'absolute' : ''}`}
            >
              {/* Comment box section */}
              {postData.IsComment ? (
                <div
                  className={`comment-box flex flex-col gap-4 px-6 pt-4 pb-5 max-sm:gap-2 rounded overflow-y-auto bg-light_blue relative border-t-2 border-gray-700 ${
                    parseInt(postData?.Attachment?.Thumbnail.split('-')[1].split('x')[1].split('.')[0]) > 600
                      ? 'absolute'
                      : ''
                  }`}
                >
                  <div className='flex justify-between items-center'>
                    <h6 className='text-[#ffffffb3] font-medium ml-1'>
                      {getTotalCommentsAndReplies(comments) === 0
                        ? 'Bạn nghĩ gì?'
                        : `${getTotalCommentsAndReplies(comments)} Nhận xét`}
                    </h6>
                    <div className='react-length flex gap-5 items-center'>
                      <ReactionStats
                        postData={postData}
                        accessToken_daniel={accessToken_daniel}
                        axiosJWT={axiosJWT}
                        active={active}
                      />
                      <FBReactions onReactionSelect={handleReactionSelect} reactedType={reactedType} />
                    </div>
                  </div>

                  <div className='flex gap-3'>
                    <div className='creator-image rounded-full w-12 aspect-square  shrink-0'>
                      <ProfileImage src={UserAvatar} alt='stranger' className='w-8 h-8' />
                    </div>
                    <div className='creator-name whitespace-nowrap text-ellipsis w-full'>
                      <input
                        id='comment'
                        placeholder='Thêm nhận xét...'
                        value={commentContent}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSendComment()
                          }
                        }}
                        onChange={(e) => setCommentContent(e.target.value)}
                        required
                        rows={1}
                        className='text-base py-3 hover:bg-[#334155b7] focus:ring-gray-300 focus:border-white border-none bg-[#334155] w-full resize-none outline-none rounded-full p-3 px-4 text-[#ffffff] placeholder:text-[#ffffff] transition duration-300 ease-in-out'
                      />
                    </div>
                    <button
                      onClick={handleSendComment}
                      className='btn-linkhover bg-hover_dark hover:bg-[#334155b7] rounded-full px-5'
                    >
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
