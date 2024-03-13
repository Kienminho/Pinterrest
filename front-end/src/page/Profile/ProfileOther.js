import React, { useEffect, useState, createContext } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import './ProfileOther.css'
import { createAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'
import UserPicUploader from '../../components/UserPicUploader/UserPicUploader'
import { ProfileImage } from '../../components/ProfileImage/ProfileImage'
import ModalListFollow from '../../components/ModalListFollow/ModalListFollow'
import SuspenseLoader from '../../components/SuspenseLoader/SuspenseLoader'

// const UserCreatedPosts = lazy(() => import('../../components/UserCreatedPosts/UserCreatedPosts'))
// const UserSavedPosts = lazy(() => import('../../components/UserSavedPosts/UserSavedPosts'))

import UserCreatedPosts from '../../components/UserCreatedPosts/UserCreatedPosts'
import UserSavedPosts from '../../components/UserSavedPosts/UserSavedPosts'
import { followUser, unfollowUser } from '../../store/apiRequest'
import { setFollowingStatus } from '../../store/slices/FollowingSlice'
import toast from 'react-hot-toast'

const ProfileOther = () => {
  const { id } = useParams()
  const user = useSelector((state) => state.Auth.login?.currentUser)
  const { _id, Avatar, FullName, UserName } = useSelector((state) => state.User)
  const dispatch = useDispatch()
  let axiosJWT = createAxios(user, dispatch, loginSuccess)
  const accessToken_daniel = user?.data?.AccessToken

  const [createdPosts, setCreatedPosts] = useState([])
  const [savedPosts, setSavedPosts] = useState([])
  const [selectedTab, setSelectedTab] = useState('created')
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [loadingOther, setLoadingOther] = useState(false)

  const isFollowing = useSelector((state) => state.Following.isFollowing)

  // Khi người dùng nhấn vào nút "Theo dõi" hoặc "Bỏ theo dõi"
  const handleFollowToggle = async () => {
    const targetFollow = following.find((f) => f.following.UserName === createdPosts[0]?.Created?.UserName)
    try {
      if (isFollowing) {
        // Nếu đang theo dõi, thực hiện hành động "Bỏ theo dõi"
        await unfollowUser(targetFollow?._id, accessToken_daniel, axiosJWT)
        dispatch(setFollowingStatus(false))
        toast.success('Huỷ theo dõi thành công!')
      } else {
        // Nếu chưa theo dõi, thực hiện hành động "Theo dõi"
        await followUser(_id, id, accessToken_daniel, axiosJWT)
        dispatch(setFollowingStatus(true))
        toast.success('Theo dõi thành công!')
      }
    } catch (error) {
      console.log(error)
    }
  }

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

  useEffect(() => {
    const getPostsFromServer = async () => {
      try {
        setLoadingOther(true)
        const resData = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/post/get-posts-by-user/${id}`, {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        })
        const postData = resData.data.data
        console.log(postData)

        if (postData) {
          setCreatedPosts(postData)
          setLoadingOther(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getPostsFromServer()
  }, [])

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

  return (
    <div className='user_profile minus-nav-100vh '>
      <div className='profile-header flex flex-col items-center pt-10 '>
        {/* Avatar part */}
        <div className='relative profile-pic-main mb-4'>
          <div className='w-32 flex justify-center rounded-full aspect-square overflow-hidden'>
            <ProfileImage src={createdPosts[0]?.Created.Avatar} alt='pic' />
          </div>
        </div>

        {/* Fullname part */}
        <div className='profile-fullname'>
          <h1 className='text-3xl font-semibold'>{createdPosts[0]?.Created.FullName}</h1>
        </div>

        {/* Username part */}
        <div className='profile-username mt-2'>
          <h1 className='text-xl font-medium text-gray-800'>@{createdPosts[0]?.Created.UserName}</h1>
        </div>

        {/* Follow modal part  */}
        <div className='profile-follow mt-3 flex gap-3 items-center font-medium'>
          <ModalListFollow followerList={followers} followingList={following} />
        </div>

        <div className='creator-follow mx-auto mt-3'>
          <button className='btn-upload rounded-full py-3' onClick={handleFollowToggle}>
            <span className='text-base'>{isFollowing ? 'Bỏ theo dõi' : 'Theo dõi'}</span>
          </button>
        </div>
      </div>
      <div className='profile-pins mt-8 text-[#333333]'>
        <div className='flex flex-col items-center'>
          {/* Category divided part */}
          <div className='category-selector flex gap-5'>
            <NavLink to={'saved'} className={`${selectedTab === 'saved' ? 'active' : ''}`}>
              <p className='relative font-semibold p-2 category-link' onClick={() => setSelectedTab('saved')}>
                Đã lưu
              </p>
            </NavLink>
            <NavLink
              to={'created'}
              className={`${selectedTab === 'created' ? 'active' : ''}`}
              aria-current='page'
              onClick={() => setSelectedTab('created')}
            >
              <p className='relative font-semibold p-2 category-link'>Đã tạo</p>
            </NavLink>
          </div>

          {/* Create and Saved Posts part */}
          <div className='user-posts-container mt-10'>
            <div className='user-created-posts'>
              {selectedTab === 'saved' ? (
                <SuspenseLoader>
                  <UserSavedPosts posts={savedPosts} />
                </SuspenseLoader>
              ) : (
                <SuspenseLoader>
                  <UserCreatedPosts posts={createdPosts} loadingOther={loadingOther} />
                </SuspenseLoader>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileOther
