import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import './ProfileOther.css'
import { createAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'
import { ProfileImage } from '../../components/ProfileImage/ProfileImage'
import ModalListFollow from '../../components/ModalListFollow/ModalListFollow'
import SuspenseLoader from '../../components/SuspenseLoader/SuspenseLoader'

import UserCreatedPosts from '../../components/UserCreatedPosts/UserCreatedPosts'
import UserSavedPosts from '../../components/UserSavedPosts/UserSavedPosts'
import toast from 'react-hot-toast'
import { followUser, unfollowUser } from '../../store/slices/FollowingSlice'

const ProfileOther = () => {
  const { id } = useParams()
  const user = useSelector((state) => state.Auth.login?.currentUser)
  const { _id } = useSelector((state) => state.User)
  const dispatch = useDispatch()
  let axiosJWT = createAxios(user, dispatch, loginSuccess)
  const accessToken_daniel = user?.data?.AccessToken

  const [createdPosts, setCreatedPosts] = useState([])
  const [savedPosts, setSavedPosts] = useState([])
  const [selectedTab, setSelectedTab] = useState('created')
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [loadingOther, setLoadingOther] = useState(false)

  const { followingList } = useSelector((state) => {
    return state.Following
  })

  const isFollowing = followingList.includes(id)

  // Khi người dùng nhấn vào nút "Theo dõi" hoặc "Bỏ theo dõi"
  const handleFollowUser = async () => {
    try {
      const res = await axiosJWT.post(
        `${process.env.REACT_APP_API_URL}/user/follow`,
        {
          follower: _id,
          following: id
        },
        {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        }
      )
      if (res.data.statusCode === 200) {
        dispatch(followUser(id))
        toast.success('Theo dõi thành công!')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUnFollowUser = async () => {
    try {
      const targetUnfollow = followers.find((item) => item.following === id)
      const targetUnfollowId = targetUnfollow?._id
      const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/user/un-follow/${targetUnfollowId}`, {
        headers: { authorization: `Bearer ${accessToken_daniel}` }
      })
      if (res.data.statusCode === 200) {
        dispatch(unfollowUser(id))
        toast.success('Huỷ theo dõi thành công!')
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Lấy danh sách follower và following của người dùng hiện tại (ngdung khac)
  useEffect(() => {
    const fetchDataFromServer = async () => {
      try {
        // Gọi API để lấy danh sách follower
        const followersRes = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/get-follower/${id}`, {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        })

        const followersData = followersRes.data.data
        if (followersData) {
          setFollowers(followersData)
        }

        // Gọi API để lấy danh sách following
        const followingRes = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/get-following/${id}`, {
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
  }, [isFollowing])

  // get post by user
  useEffect(() => {
    const getPostsFromServer = async () => {
      try {
        setLoadingOther(true)
        const resData = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/post/get-posts-by-user/${id}`, {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        })
        const postData = resData.data.data
        if (resData.data.statusCode === 200) {
          setCreatedPosts(postData)
          setLoadingOther(false)
        } else {
          setLoadingOther(false)
        }
      } catch (error) {
        setLoadingOther(false)
        console.log(error)
      }
    }
    getPostsFromServer()
  }, [])

  // Get saved posts
  useEffect(() => {
    const getSavedPostsFromServer = async () => {
      try {
        // setLoading(true)
        const resData = await axiosJWT.post(
          `${process.env.REACT_APP_API_URL}/post/get-saved-posts?pageIndex=1&pageSize=100`,
          { id: id },
          {
            headers: { authorization: `Bearer ${accessToken_daniel}` }
          }
        )
        const postData = resData.data.data
        if (postData) {
          setSavedPosts(postData)
          // setLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getSavedPostsFromServer()
  }, [])

  return (
    <div className='user_profile minus-nav-100vh '>
      <div className='profile-header flex flex-col items-center pt-10'>
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
          <ModalListFollow followersList={followers} followingsList={following} />
        </div>

        <div className='creator-follow mx-auto mt-3'>
          {isFollowing ? (
            <button onClick={handleUnFollowUser} className='btn-linkhover py-3.5 px-5 rounded-full'>
              Đã theo dõi
            </button>
          ) : (
            <button onClick={handleFollowUser} className='btn-save py-3.5'>
              <span className='text-base'>Theo dõi</span>
            </button>
          )}
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
                  <UserSavedPosts posts={savedPosts} loadingOther={loadingOther} />
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
