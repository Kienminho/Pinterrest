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
    const getDataFromServer = async () => {
      try {
        const resData = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/post/get-posts-by-user`, {
          headers: { authorization: `Bearer ${accessToken_daniel}` }
        })
        console.log(resData)

        const postData = resData.data.data
        console.log(postData)

        if (postData) {
          setPosts(postData)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getDataFromServer()
  }, [])
  return (
    <>
      <div className='posts-container pt-8 minus-nav-100vh max-sm:pt-3'>
        <PostsLayout postsCount={posts.length} fallback={'Nothing to see yet.'}>
          {' '}
          {posts &&
            posts.map((post, i) => {
              return <Post data={post} key={i} />
            })}
        </PostsLayout>
      </div>
    </>
  )
}

export default Home
