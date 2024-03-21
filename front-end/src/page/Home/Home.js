import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Post from '../../components/Post/Post'
import { useSelector } from 'react-redux'
import CategoryPicker from '../../components/Intro/CategoryPicker'
import { useFetchUserInfo } from '../../customHooks/useFetchUserInfo'
import PostsLayoutHome from '../../components/PostsGrid/PostsLayoutHome'
import './Home.css'
import InfiniteScroll from 'react-infinite-scroll-component'

const Home = () => {
  useFetchUserInfo()
  const user = useSelector((state) => state.Auth.login?.currentUser)
  const accessToken_daniel = user?.data?.AccessToken
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)

  let { FirstLogin } = useSelector((state) => state.User)

  // Lấy dữ liệu cho trang đầu tiên khi component được render
  useEffect(() => {
    const getPostsByCategories = async () => {
      try {
        setLoading(true)
        const resData = await axios.get(
          `${process.env.REACT_APP_API_URL}/post/get-posts-by-categories?pageIndex=1&pageSize=40`,
          {
            headers: { Authorization: `Bearer ${accessToken_daniel}` }
          }
        )
        if (resData.data.statusCode === 200) {
          setPosts(resData.data.data)
          setTotalPosts(resData.data.totalRecord)
          setLoading(false)
          setPageNumber(pageNumber + 1)
        } else {
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
    getPostsByCategories()
  }, []) // Thêm dependencies vào useEffect

  const fetchData = () => {
    setPageNumber(pageNumber + 1)
    console.log(`${process.env.REACT_APP_API_URL}/post/get-posts-by-categories?pageIndex=${pageNumber}&pageSize=40`)
    const getPostsByCategories = async () => {
      try {
        const resData = await axios.get(
          `${process.env.REACT_APP_API_URL}/post/get-posts-by-categories?pageIndex=${pageNumber}&pageSize=40`,
          {
            headers: { Authorization: `Bearer ${accessToken_daniel}` }
          }
        )
        if (resData.data.statusCode === 200) {
          setPosts([...posts, ...resData.data.data])
          setTotalPosts(resData.data.totalRecord)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getPostsByCategories()
  }
  console.log('so posts: ', posts)

  return (
    <div className='bg-dark_blue'>
      {FirstLogin ? (
        <CategoryPicker />
      ) : (
        <>
          <div className='user-home-posts'>
            <PostsLayoutHome loading={loading}>
              {posts &&
                posts.map((post, i) => {
                  return <Post data={post} key={i} type={'home-post'} />
                })}
            </PostsLayoutHome>
          </div>
          <InfiniteScroll
            dataLength={posts.length} //This is important field to render the next data
            next={fetchData}
            hasMore={true}
          ></InfiniteScroll>
        </>
      )}
    </div>
  )
}

export default Home
