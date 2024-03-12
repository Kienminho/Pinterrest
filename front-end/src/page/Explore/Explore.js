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
    </div>
  )
}

export default Explore
