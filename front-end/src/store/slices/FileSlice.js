import { createSlice } from '@reduxjs/toolkit'

const FileSlice = createSlice({
  name: 'File',
  initialState: {
    uploadFile: {
      isFetching: false,
      success: false,
      error: false,
      data: null
    }
  },
  reducers: {
    uploadFileStart: (state) => {
      state.uploadFile.isFetching = true
    },
    uploadFileSuccess: (state, action) => {
      state.uploadFile.isFetching = false
      state.uploadFile.success = true
      state.uploadFile.data = action.payload ? action.payload.data : null
    },
    uploadFileFailed: (state) => {
      state.uploadFile.isFetching = false
      state.uploadFile.success = false
    }
  }
})

export const { uploadFileStart, uploadFileSuccess, uploadFileFailed } = FileSlice.actions

export default FileSlice.reducer
