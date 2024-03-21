import { Modal } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { ProfileImage } from '../ProfileImage/ProfileImage'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { CreateAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'
import { followUser, unfollowUser } from '../../store/slices/FollowingSlice'
import { NavLink } from 'react-router-dom'
import './ModalListFollow.css'

function ModalListFollow({ followersList, followingsList }) {
  const [openModalFollowers, setOpenModalFollowers] = useState(false)
  const [openModalFollowings, setOpenModalFollowings] = useState(false)
  console.log(followingsList)

  const { _id: UserId } = useSelector((state) => state.User)
  const dispatch = useDispatch()
  const user = useSelector((state) => state.Auth.login?.currentUser)
  let axiosJWT = CreateAxios(user, dispatch, loginSuccess)
  const accessToken_daniel = user?.data?.AccessToken

  const { followingList } = useSelector((state) => {
    return state.Following
  })

  const handleUnFollowUser = async (unFollowId, UnFollowUserId) => {
    try {
      const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/user/un-follow/${unFollowId}`, {
        headers: { authorization: `Bearer ${accessToken_daniel}` }
      })
      if (res.data.statusCode === 200) {
        dispatch(unfollowUser(UnFollowUserId))
        toast.success('Huỷ theo dõi thành công!')
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {}, [followingList])

  return (
    <div className='font-inter flex gap-4 font-medium'>
      <button
        className='bg-hover_dark hover:bg-slate-700 transition duration-300 ease-in-out px-3 py-3 rounded-2xl'
        onClick={() => setOpenModalFollowers(true)}
      >
        {followersList?.length} người theo dõi
      </button>
      <button
        className='bg-hover_dark hover:bg-slate-700 transition duration-300 ease-in-out px-3 py-3 rounded-2xl'
        onClick={() => setOpenModalFollowings(true)}
      >
        {followingsList?.length} đang theo dõi
      </button>
      <Modal show={openModalFollowers} onClose={() => setOpenModalFollowers(false)}>
        <Modal.Header>{followersList?.length} người theo dõi</Modal.Header>
        <Modal.Body>
          <div className='space-y-6'>
            <div className='follower-list'>
              {followersList?.map((follower) => (
                <NavLink to={`/${UserId === follower.follower._id ? 'profile' : 'profiles'}/${follower.follower._id}`}>
                  <div
                    key={follower._id}
                    className='creator-profile flex w-full items-center mt-auto gap-3 mb-4 hover:bg-hover_dark py-2 px-6 transition duration-300 ease-in-out rounded-xl cursor-pointer'
                  >
                    <div className='creator-image rounded-full w-14 aspect-square overflow-hidden  shrink-0'>
                      <ProfileImage src={follower?.follower?.Avatar} alt={follower.follower.UserName} />
                    </div>
                    <div className='creator-name whitespace-nowrap overflow-hidden text-ellipsis flex flex-col cursor-pointer'>
                      <div className='font-semibold'>
                        {follower?.follower?.FullName ? follower?.follower?.FullName : follower?.follower?.UserName}
                      </div>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={openModalFollowings} onClose={() => setOpenModalFollowings(false)}>
        <Modal.Header>{followingsList?.length} đang theo dõi</Modal.Header>
        <Modal.Body>
          <div className='space-y-6'>
            <div className='follower-list'>
              {followingsList?.map((following) => (
                <NavLink
                  to={`/${UserId === following?.following?._id ? 'profile' : 'profiles'}/${following?.following?._id}`}
                >
                  <div
                    key={following?._id}
                    className='creator-profile flex w-full items-center mt-auto gap-3 mb-4 hover:bg-hover_dark py-2 px-6 transition duration-300 ease-in-out rounded-xl cursor-pointer'
                  >
                    <div className='creator-image rounded-full w-14 aspect-square overflow-hidden  shrink-0'>
                      <ProfileImage src={following?.following?.Avatar} alt={following?.following?.UserName} />
                    </div>
                    <div className='creator-name whitespace-nowrap overflow-hidden text-ellipsis flex flex-col'>
                      <div className='font-semibold'>{following?.following?.UserName}</div>
                    </div>
                    {UserId !== following?.following?._id && (
                      <div className='creator-follow ml-auto'>
                        <button
                          className='btn-category bg-pink-100 text-pink-600 hover:bg-pink-200'
                          onClick={() => handleUnFollowUser(following?._id, following?.following?._id)}
                        >
                          <span className='text-base'>Đang theo dõi</span>
                        </button>
                      </div>
                    )}
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ModalListFollow
