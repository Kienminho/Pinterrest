import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './page/Login/Login'
import Signup from './page/Signup/Signup'
import Navbar from './components/Navbar/Navbar'
import Nav from './components/Nav/Nav'
import IntroContainer from './components/Intro'
import Create from './page/Create/Create'
import { Toaster } from 'react-hot-toast'
import ChangePassword from './page/ChangePassword/ChangePassword'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'
import Home from './page/Home/Home'
import Profile from './page/Profile/Profile'
import SuspenseLoader from './components/SuspenseLoader/SuspenseLoader'
import UserCreatedPosts from './components/UserCreatedPosts/UserCreatedPosts'
import UserSavedPosts from './components/UserSavedPosts/UserSavedPosts'
import DetailPin from './page/DetailPin/DetailPin'
import Setting from './page/Setting/Setting'
import { useFetchUserInfo } from './customHooks/useFetchUserInfo'

function App() {
  useFetchUserInfo()
  return (
    <>
      {/* <Navbar /> */}
      <Nav />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Signup />} />
        <Route
          path='/'
          element={
            <PrivateRoute>
              <IntroContainer />
            </PrivateRoute>
          }
        />
        <Route
          path='/home'
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path='/profile/*'
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path='/create'
          element={
            <PrivateRoute>
              <Create />
            </PrivateRoute>
          }
        />
        <Route
          path='/pin/:id'
          element={
            <PrivateRoute>
              <DetailPin />
            </PrivateRoute>
          }
        />
        <Route
          path='/settings'
          element={
            <PrivateRoute>
              <Setting />
            </PrivateRoute>
          }
        />
        <Route path='/forgot-password' element={<ChangePassword />} />
      </Routes>
      <Toaster position={window.innerWidth > 640 ? 'bottom-right' : 'top-center'} reverseOrder={true} />
    </>
  )
}

export default App
