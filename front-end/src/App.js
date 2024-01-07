import { useState } from 'react'
import PersonalProfile from './components/PersonalProfile/PersonalProfile'
import PublicProfile from './components/PublicProfile/PublicProfile'
import Signin from './components/Signin/signin'
import MyModal from './components/Signup/signup'
import logo from './logo.svg'

function App() {
  return (
    <div className='App'>
      <MyModal />
      {/* <Signin /> */}
      {/* <PublicProfile /> */}
      {/* <PersonalProfile /> */}
    </div>
  )
}

export default App
