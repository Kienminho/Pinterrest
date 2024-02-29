import React from 'react'
import PostsLayout from '../PostsGrid/PostsLayout'
import Post from '../Post/Post'

const UserSavedPosts = ({ posts }) => {
  return (
    <div className='user-saved-posts'>
      <PostsLayout postsCount={posts?.length} fallback={'Chưa có gì để hiển thị! Ghim bạn lưu sẽ xuất hiện ở đây.'}>
        {posts &&
          posts.map((post, i) => {
            return <Post data={post} key={i} type={'user-post'} />
          })}
      </PostsLayout>
    </div>
  )
}

export default UserSavedPosts
