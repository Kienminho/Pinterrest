import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PersonalProfile from './components/PersonalProfile/PersonalProfile'
import PublicProfile from './components/PublicProfile/PublicProfile'
import MyModal from './components/Signup/signup'
import './App.css'
import Profile from './pages_copy/Profile'
import DefaultLayout from './components/Layout/Defaultlayout'
import HeaderOnly from './components/Layout/HeaderOnly'
import Upload from './pages_copy/Upload'
import Search from './components/Layout/components/Search'
import routesConfig from './config/routes'
import Login from './page/Login/Login'
import Signup from './page/Signup/Signup'
import Navbar from './components/Navbar/Navbar'
import IntroContainer from './components/Intro'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<IntroContainer />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </>
  )
}

export default App
