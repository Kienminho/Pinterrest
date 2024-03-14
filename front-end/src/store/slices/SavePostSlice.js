import { createSlice } from '@reduxjs/toolkit'

const SavePostSlice = createSlice({
  name: 'SavePost',
  initialState: {
    savedPosts: [] // Thay đổi trạng thái ban đầu thành một mảng chứa ID của các post đã được lưu
  },
  reducers: {
    savePost: (state, action) => {
      // Thêm ID của post vào mảng savedPosts khi lưu post
      return {
        ...state,
        savedPosts: [...state.savedPosts, action.payload] // Thêm giá trị mới vào mảng savedPosts
      }
    },
    unsavePost: (state, action) => {
      // Loại bỏ ID của post khỏi mảng savedPosts khi hủy lưu post
      return {
        ...state,
        savedPosts: state.savedPosts?.filter((id) => id !== action.payload)
      }
    },
    resetSavedPosts: (state) => {
      return {
        ...state,
        savedPosts: []
      }
    }
  }
})

export const { savePost, unsavePost, resetSavedPosts } = SavePostSlice.actions

export default SavePostSlice.reducer
