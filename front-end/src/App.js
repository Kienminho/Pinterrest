import React, { lazy, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import { useFetchUserInfo } from './customHooks/useFetchUserInfo'

import Nav from './components/Nav/Nav'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'
import IntroContainer from './components/Intro'
import Login from './page/Login/Login'
import Signup from './page/Signup/Signup'
import ChangePassword from './page/ChangePassword/ChangePassword'

import DetailPin from './page/DetailPin/DetailPin'
import Profile from './page/Profile/Profile'
import Create from './page/Create/Create'
import Home from './page/Home/Home'
import Setting from './page/Setting/Setting'
import Messenger from './page/Messenger/Messenger'
import { SearchBar } from './components/SearchBar/SearchBar'
import { SearchResultsList } from './components/SearchBar/SearchResultList'
import AuthLayout from './components/AuthLayout/AuthLayout'

// const DetailPin = lazy(() => import('./page/DetailPin/DetailPin'))
// const Profile = lazy(() => import('./page/Profile/Profile'))
// const Create = lazy(() => import('./page/Create/Create'))
// const Home = lazy(() => import('./page/Home/Home'))
// const Setting = lazy(() => import('./page/Setting/Setting'))

const App = () => {
  const [results, setResults] = useState([])
  console.log(results)
  useFetchUserInfo()
  return (
    <>
      <Nav />
      {/* <SearchBar setResults={setResults} />
      <SearchResultsList results={results} /> */}

      <Routes>
        <Route
          path='/login'
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path='/register'
          element={
            <AuthLayout>
              <Signup />
            </AuthLayout>
          }
        />
        <Route
          path='/'
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path='/message'
          element={
            <PrivateRoute>
              <Messenger />
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
