import React from 'react'
import PostsLayout from '../PostsGrid/PostsLayout'
import Post from '../Post/Post'

const UserCreatedPosts = ({ posts }) => {
  return (
    <div className='user-created-posts'>
      <PostsLayout postsCount={posts?.length} fallback={"You haven't created any posts yet."}>
        {posts &&
          posts.map((post, i) => {
            return <Post data={post} key={i} type={'user-post'} />
          })}
      </PostsLayout>
    </div>
  )
}

export default UserCreatedPosts
