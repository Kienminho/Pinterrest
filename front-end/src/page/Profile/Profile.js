import React, { useEffect, useState, createContext } from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import './Profile.css'
import { CreateAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'
import UserPicUploader from '../../components/UserPicUploader/UserPicUploader'
import { ProfileImage } from '../../components/ProfileImage/ProfileImage'
import ModalListFollow from '../../components/ModalListFollow/ModalListFollow'
import SuspenseLoader from '../../components/SuspenseLoader/SuspenseLoader'
import UserCreatedPosts from '../../components/UserCreatedPosts/UserCreatedPosts'
import UserSavedPosts from '../../components/UserSavedPosts/UserSavedPosts'
export const LoadingContext = createContext()

const Profile = () => {
  const user = useSelector((state) => state.Auth.login?.currentUser)
  const { _id, Avatar, FullName, UserName } = useSelector((state) => state.User)
  const [tempPic, setTempPic] = useState(null)
  const dispatch = useDispatch()
  let axiosJWT = CreateAxios(user, dispatch, loginSuccess)
  const accessToken_daniel = user?.data?.AccessToken

  const [createPosts, setCreatePosts] = useState([])
  const [savedPosts, setSavedPosts] = useState([])
  const [selectedTab, setSelectedTab] = useState('created')
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [loading, setLoading] = useState(false)
  // const [listSavedPosts, setListSavedPosts] = useState([])

  const { followingList } = useSelector((state) => {
    return state.Following
  })

  console.log('check followingList bên current: ', followingList)

  // const isFollowing = followingList?.includes(id)
  // console.log('check curUser follow othUser: ', isFollowing)

  // Get created posts
  useEffect(() => {
    const getPostsFromServer = async () => {
      try {
        setLoading(true)
        const resData = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/post/get-posts-by-user/${_id}`, {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        })
        const postData = resData.data.data
        if (postData) {
          setCreatePosts(postData)
          setLoading(false)
        } else {
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
    getPostsFromServer()
  }, [])

  // Get saved posts
  useEffect(() => {
    const getSavedPostsFromServer = async () => {
      try {
        setLoading(true)
        const resData = await axiosJWT.post(
          `${process.env.REACT_APP_API_URL}/post/get-saved-posts?pageIndex=1&pageSize=100`,
          { id: _id },
          {
            headers: { authorization: `Bearer ${accessToken_daniel}` }
          }
        )
        const postData = resData.data.data
        if (postData) {
          setSavedPosts(postData)
          setLoading(false)
        } else {
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
    getSavedPostsFromServer()
  }, [])

  // Get followers and following
  useEffect(() => {
    const fetchDataFromServer = async () => {
      try {
        // Gọi API để lấy danh sách follower
        const followersRes = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/get-follower/${_id}`, {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        })

        const followersData = followersRes?.data?.data
        if (followersData) {
          setFollowers(followersData)
        }

        // Gọi API để lấy danh sách following
        const followingRes = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/get-following/${_id}`, {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        })

        const followingData = followingRes?.data?.data
        if (followingData) {
          setFollowing(followingData)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchDataFromServer()
  }, [])

  console.log('check followers: ', followers)
  console.log('check following: ', following)

  return (
    <LoadingContext.Provider value={loading}>
      <div className='user_profile minus-nav-100vh bg-dark_blue text-white font-inter'>
        <div className='profile-header flex flex-col items-center pt-10'>
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
              <UserPicUploader setTempPic={(file) => setTempPic(file)} />
            </div>
          </div>

          {/* Fullname part */}
          <div className='profile-fullname'>
            <h1 className='text-[28px] font-semibold'>{FullName}</h1>
          </div>

          {/* Username part */}
          <div className='profile-username mt-2'>
            <h1 className='text-lg font-medium text-blue-500'>@{UserName}</h1>
          </div>

          {/* Follow modal part  */}
          <div className='profile-follow my-5  flex gap-3 items-center font-medium'>
            <ModalListFollow followersList={followers} followingsList={following} />
          </div>

          {/* Activity part */}
          <div className='profile-activity flex gap-3 items-center'>
            <NavLink to='/settings'>
              <button className='rounded-3xl text-white font-medium px-[18px] py-3 bg-hover_dark hover:bg-[#384454d3]'>
                Chỉnh sửa hồ sơ
              </button>
            </NavLink>
          </div>
        </div>
        <div className='profile-pins mt-8 text-white'>
          <div className='flex flex-col items-center'>
            {/* Category divided part */}
            <div className='category-selector flex gap-5 text-base'>
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
                    <UserCreatedPosts posts={createPosts} />
                  </SuspenseLoader>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoadingContext.Provider>
  )
}

export default Profile
