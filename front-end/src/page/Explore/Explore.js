import React from 'react'
import PostsLayoutHome from '../../components/PostsGrid/PostsLayoutHome'
import Post from '../../components/Post/Post'
import { useLocation } from 'react-router-dom'

const Explore = () => {
  const location = useLocation()
  const searchResults = location.state?.searchResults
  return (
    <div className='explore-page'>
      <div className='user-search-posts mt-5'>
        <PostsLayoutHome loading={true}>
          {searchResults.map((post, i) => (
            <Post data={post} key={i} type={'search-post'} />
          ))}
        </PostsLayoutHome>
      </div>
      {/* <InfiniteScroll
        dataLength={searchResults.length} //This is important field to render the next data
        next={fetchData}
        hasMore={true}
        loader={
          // <div className='flex flex-col gap-3 items-center bottom-0 left-0 right-0'>
          //   <Spin size='large' />
          // </div>
          <h5 className='text-center'>Đang tải...</h5>
        }
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      ></InfiniteScroll> */}
    </div>
  )
}

export default Explore
