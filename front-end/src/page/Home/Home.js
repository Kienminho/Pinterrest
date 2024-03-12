import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Post from '../../components/Post/Post'
import { useSelector } from 'react-redux'
import CategoryPicker from '../../components/Intro/CategoryPicker'
import { useFetchUserInfo } from '../../customHooks/useFetchUserInfo'
import PostsLayoutHome from '../../components/PostsGrid/PostsLayoutHome'

const Home = () => {
  useFetchUserInfo()
  const user = useSelector((state) => state.Auth.login?.currentUser)
  const accessToken_daniel = user?.data?.AccessToken
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)

  let { FirstLogin } = useSelector((state) => state.User)

  // lấy tất cả các bài viết theo danh mục
  useEffect(() => {
    const getPostsByCategories = async () => {
      try {
        const resData = await axios.get(
          `${process.env.REACT_APP_API_URL}/post/get-posts-by-categories?pageIndex=1&pageSize=15`,
          {
            headers: { Authorization: `Bearer ${accessToken_daniel}` }
          }
        )

        if (resData.data.data) {
          setPosts(resData.data.data)
          setLoading(true)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getPostsByCategories()
  }, [])

  return (
    <>
      {FirstLogin ? (
        <CategoryPicker />
      ) : (
        <div className='user-home-posts mt-5'>
          <PostsLayoutHome loading={loading}>
            {posts &&
              posts.map((post, i) => {
                return <Post data={post} key={i} type={'home-post'} />
              })}
          </PostsLayoutHome>
        </div>
      )}
    </>
  )
}

export default Home
