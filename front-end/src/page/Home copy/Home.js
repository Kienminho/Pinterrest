import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Post from '../../components/Post/Post'
import PostsLayout from '../../components/PostsGrid/PostsLayout'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'

const Home = () => {
  const user = useSelector((state) => state.Auth.login?.currentUser)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  let axiosJWT = createAxios(user, dispatch, loginSuccess)

  const accessToken_daniel = user?.data?.AccessToken
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const getPhotosFromPexels = async () => {
      try {
        const resData = await axios.get(`https://api.pexels.com/v1/search?query=all&per_page=20`, {
          headers: { Authorization: 'NW1ABVQXn6lXw6bjHqL6ssSafrm4K10F1D1aLpS7lxPoZp9qx9kR56li' }
        })
        console.log(resData.data)

        const photosData = resData.data.photos
        console.log(photosData)

        if (photosData) {
          setPosts(photosData)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getPhotosFromPexels()
  }, [])
  return (
    <>
      <div className='posts-container pt-8 minus-nav-100vh max-sm:pt-3'>
        <PostsLayout postsCount={posts?.length}>
          {posts &&
            posts.map((post, index) => {
              return (
                <div className='post-container rounded-xl overflow-hidden mb-4 relative max-sm:mb-2' key={index}>
                  <img className='w-full' src={post.src.original} alt={post.id} />
                </div>
              )
            })}
        </PostsLayout>
      </div>
    </>
  )
}

export default Home
