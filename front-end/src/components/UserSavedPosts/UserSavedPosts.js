import React from 'react'
import PostsLayout from '../PostsGrid/PostsLayout'
import Post from '../Post/Post'

const UserSavedPosts = ({ posts }) => {
  return (
    <div className='user-saved-posts'>
      <PostsLayout postsCount={posts?.length} fallback={"You haven't saved any posts yet."}>
        {posts &&
          posts.map((post, i) => {
            return <Post data={post} key={i} type={'user-post'} />
          })}
      </PostsLayout>
    </div>
  )
}

export default UserSavedPosts
