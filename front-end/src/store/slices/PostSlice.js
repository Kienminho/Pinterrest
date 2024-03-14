// import { createSlice } from '@reduxjs/toolkit'

// const PostSlice = createSlice({
//   name: 'Post',
//   initialState: {
//     savedPosts: [] // Thay đổi trạng thái ban đầu thành một mảng chứa ID của các post đã được lưu
//   },
//   reducers: {
//     savePost: (state, action) => {
//       // Thêm ID của post vào mảng savedPosts khi lưu post
//       console.log(action)
//       state.savedPosts = state.savedPosts?.push(action.payload)
//     },
//     unsavePost: (state, action) => {
//       // Loại bỏ ID của post khỏi mảng savedPosts khi hủy lưu post
//       state.savedPosts = state.savedPosts?.filter((id) => id !== action.payload)
//     }
//   }
// })

// export const { savePost, unsavePost } = PostSlice.actions

// export default PostSlice.reducer
