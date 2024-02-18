import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Profile.css'
import { useDispatch, useSelector } from 'react-redux'
import { createAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'
import UserCreatedPosts from '../../components/UserCreatedPosts/UserCreatedPosts'
import UserSavedPosts from '../../components/UserSavedPosts/UserSavedPosts'
import UserPicUploader from '../../components/UserPicUploader/UserPicUploader'
import { ProfileImage } from '../../components/ProfileImage/ProfileImage'
import ModalListFollow from '../../components/ModalListFollow/ModalListFollow'
import { updateState } from '../../store/slices/UserSlice'

const Profile = () => {
  const user = useSelector((state) => state.Auth.login?.currentUser)
  const { Avatar, FullName, UserName } = useSelector((state) => state.User)
  const [tempPic, setTempPic] = useState(null)

  const dispatch = useDispatch()

  let axiosJWT = createAxios(user, dispatch, loginSuccess)
  const accessToken_daniel = user?.data?.AccessToken

  const [createPosts, setCreatePosts] = useState([])
  const [savedPosts, setSavedPosts] = useState([])
  const [selectedTab, setSelectedTab] = useState('created')
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])

  useEffect(() => {
    const getPostsFromServer = async () => {
      try {
        const resData = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/post/get-posts-by-user`, {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        })
        const postData = resData.data.data
        console.log(postData)

        if (postData) {
          setCreatePosts(postData)
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
    <>
      <div className='user_profile minus-nav-100vh'>
        <div className='profile-header flex flex-col items-center pt-10 bg-gradient-to-r from-green-400 to-blue-500'>
          {/* Avatar part */}
          <div className='relative profile-pic-main mb-4'>
            <div className='w-32 flex justify-center rounded-full aspect-square overflow-hidden'>
              {tempPic ? (
                <ProfileImage src={URL.createObjectURL(tempPic)} alt='pic' />
              ) : (
                <ProfileImage src={Avatar} alt='pic' />
              )}
            </div>
            <div className='absolute bottom-0 right-2'>
              <div class='w-8 aspect-square rounded-full z-20 bg-gray-100 hover:bg-gray-200 grid place-content-center'>
                <UserPicUploader setTempPic={(file) => setTempPic(file)} />
              </div>
            </div>
          </div>

          {/* Fullname part */}
          <div className='profile-fullname'>
            <h1 className='text-3xl font-semibold'>{FullName}</h1>
          </div>

          {/* Username part */}
          <div className='profile-username mt-2'>
            <h1 className='text-xl font-medium text-gray-800'>@{UserName}</h1>
          </div>

          {/* Follow modal part  */}
          <div className='profile-follow mt-3 flex gap-3 items-center font-medium'>
            <ModalListFollow followerList={followers} followingList={following} />
          </div>

          {/* Activity part */}
          <div className='profile-activity mt-2 flex gap-3 items-center font-medium'>
            <div className='save-pic'>{savedPosts?.length} đã lưu</div>
            <div className='create-pic'>{createPosts?.length} đã tạo</div>
          </div>
        </div>
        <div className='profile-pins mt-8 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400'>
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
            <div className='user-posts-container mt-14'>
              <div className='user-created-posts'>
                {selectedTab === 'saved' ? (
                  <UserSavedPosts posts={savedPosts} />
                ) : (
                  <UserCreatedPosts posts={createPosts} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
