import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PersonalProfile from './components/PersonalProfile/PersonalProfile'
import PublicProfile from './components/PublicProfile/PublicProfile'
import MyModal from './components/Signup/signup'
import './App.css'
import routesConfig from './config/routes'
import Login from './page/Login/Login'
import Signup from './page/Signup/Signup'
import Navbar from './components/Navbar/Navbar'
import IntroContainer from './components/Intro'
import Create from './page/Create/Create'
import { Toaster } from 'react-hot-toast'
import ChangePassword from './page/ChangePassword/ChangePassword'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<IntroContainer />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/create' element={<Create />} />
        <Route path='/forgot-password' element={<ChangePassword />} />
      </Routes>
      <Toaster position={window.innerWidth > 640 ? 'bottom-right' : 'top-center'} reverseOrder={true} />
    </>
  )
}

export default App
