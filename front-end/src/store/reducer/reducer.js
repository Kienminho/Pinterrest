// reducers.js

import { combineReducers } from '@reduxjs/toolkit'

const initialState = {
  // Khai báo trạng thái ban đầu nếu cần
}

const fakeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FAKE_ACTION':
      // Xử lý action nếu cần
      return state
    default:
      return state
  }
}

const rootReducer = combineReducers({
  fakeReducer
  // Thêm reducers khác nếu có
})

export default rootReducer
