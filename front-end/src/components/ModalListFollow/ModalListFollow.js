import { Button, Modal } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { ProfileImage } from '../ProfileImage/ProfileImage'
import { useDispatch, useSelector } from 'react-redux'
import { followUser, unfollowUser } from '../../store/apiRequest'
import { resetFollowingStatus, setFollowingStatus } from '../../store/slices/FollowingSlice'
import toast from 'react-hot-toast'
import { createAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'

function ModalListFollow({ followerList, followingList }) {
  const [openModalFollowers, setOpenModalFollowers] = useState(false)
  const [openModalFollowings, setOpenModalFollowings] = useState(false)
  const [followingState, setFollowingState] = useState({})
  console.log('danh sach Follower: ', followerList)
  console.log('danh sach Following: ', followingList)

  const isFollowing = useSelector((state) => state.Following.isFollowing)
  console.log(isFollowing)
  const { _id: UserId } = useSelector((state) => state.User)
  const dispatch = useDispatch()
  const user = useSelector((state) => state.Auth.login?.currentUser)
  let axiosJWT = createAxios(user, dispatch, loginSuccess)
  const accessToken_daniel = user?.data?.AccessToken

  const handleFollowToggle = async (followerId) => {
    const targetFollow = followingList.find((f) => f.following?._id === followerId)
    console.log(targetFollow?._id)
    try {
      if (followingState[followerId]) {
        // Nếu đang theo dõi, thực hiện hành động "Bỏ theo dõi"
        await unfollowUser(targetFollow?._id, accessToken_daniel, axiosJWT)
        dispatch(setFollowingStatus(false))
        setFollowingState({ ...followingState, [followerId]: false })
        toast.success('Huỷ theo dõi thành công!')
      } else {
        // Nếu chưa theo dõi, thực hiện hành động "Theo dõi"
        await followUser(UserId, followerId, accessToken_daniel, axiosJWT)
        dispatch(setFollowingStatus(true))
        setFollowingState({ ...followingState, [followerId]: true })
        toast.success('Theo dõi thành công!')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUnFollowToggle = async (followerId) => {
    const targetFollow = followingList.find((f) => f.following?._id === followerId)
    console.log(targetFollow?._id)
    try {
      // Nếu đang theo dõi, thực hiện hành động "Bỏ theo dõi"
      await unfollowUser(targetFollow?._id, accessToken_daniel, axiosJWT)
      dispatch(setFollowingStatus(false))
      setFollowingState({ ...followingState, [followerId]: false })
      toast.success('Huỷ theo dõi thành công!')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <button className='font-normal' onClick={() => setOpenModalFollowers(true)}>
        {followerList.length} người theo dõi
      </button>
      <button className='font-normal' onClick={() => setOpenModalFollowings(true)}>
        {followingList.length} đang theo dõi
      </button>
      <Modal show={openModalFollowers} onClose={() => setOpenModalFollowers(false)}>
        <Modal.Header>{followerList.length} người theo dõi</Modal.Header>
        <Modal.Body>
          <div className='space-y-6'>
            <div className='follower-list'>
              {followerList.map((follower) => (
                <div key={follower._id} className='creator-profile flex w-full items-center mt-auto gap-3 mb-4'>
                  <div className='creator-image rounded-full w-14 aspect-square overflow-hidden  shrink-0'>
                    <ProfileImage src={follower?.follower?.Avatar} alt={follower.follower.UserName} />
                  </div>
                  <div className='creator-name whitespace-nowrap overflow-hidden text-ellipsis flex flex-col'>
                    <div className='font-semibold'>{follower.follower.UserName}</div>
                  </div>
                  <div className='creator-follow ml-auto'>
                    <Button
                      color='light'
                      className='rounded-full'
                      onClick={() => handleFollowToggle(follower.follower._id)}
                    >
                      <span className='text-base'>
                        {followingState[follower.follower._id] ? 'Đang theo dõi' : 'Theo dõi'}
                      </span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={openModalFollowings} onClose={() => setOpenModalFollowings(false)}>
        <Modal.Header>{followingList.length} đang theo dõi</Modal.Header>
        <Modal.Body>
          <div className='space-y-6'>
            <div className='follower-list'>
              {followingList.map((following) => (
                <div key={following._id} className='creator-profile flex w-full items-center mt-auto gap-3 mb-4'>
                  <div className='creator-image rounded-full w-14 aspect-square overflow-hidden  shrink-0'>
                    <ProfileImage src={following?.following?.Avatar} alt={following.following.UserName} />
                  </div>
                  <div className='creator-name whitespace-nowrap overflow-hidden text-ellipsis flex flex-col'>
                    <div className='font-semibold'>{following.following.UserName}</div>
                  </div>
                  <div className='creator-follow ml-auto'>
                    <Button
                      color='light'
                      className='rounded-full'
                      onClick={() => handleUnFollowToggle(following.following._id)}
                    >
                      <span className='text-base'>Huỷ theo dõi</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ModalListFollow
