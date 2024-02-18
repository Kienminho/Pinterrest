import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AuthSlice from './slices/AuthSlice'
import UserSlice from './slices/UserSlice'
import FileSlice from './slices/FileSlice'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import FollowingSlice from './slices/FollowingSlice'

const persistConfig = {
  key: 'root',
  version: 1,
  storage
}
const rootReducer = combineReducers({
  Auth: AuthSlice,
  User: UserSlice,
  File: FileSlice,
  Following: FollowingSlice
})
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

export let persistor = persistStore(store)
