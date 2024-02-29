import React from 'react'
import PostsLayout from '../PostsGrid/PostsLayout'
import Post from '../Post/Post'

const UserCreatedPosts = ({ posts }) => {
  return (
    <div className='user-created-posts'>
      <PostsLayout postsCount={posts?.length} fallback={'Chưa có gì để hiển thị! Ghim bạn tạo sẽ xuất hiện ở đây.'}>
        {posts &&
          posts.map((post, i) => {
            return <Post data={post} key={i} type={'user-post'} />
          })}
      </PostsLayout>
    </div>
  )
}

export default UserCreatedPosts
