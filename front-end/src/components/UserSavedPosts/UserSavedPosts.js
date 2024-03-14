import React from 'react'
import PostsLayout from '../PostsGrid/PostsLayout'
import PostSaved from '../Post/PostSaved'

const UserSavedPosts = ({ posts }) => {
  return (
    <div className='user-saved-posts'>
      <PostsLayout postsCount={posts?.length} fallback={'Chưa có gì để hiển thị! Ghim bạn lưu sẽ xuất hiện ở đây.'}>
        {posts &&
          posts.map((post, i) => {
            return <PostSaved data={post} key={i} type={'user-saved'} />
          })}
      </PostsLayout>
    </div>
  )
}

export default UserSavedPosts
