// IntroPageContainer.jsx
import React, { useEffect } from 'react'
import CTASection from './CTASection'
import ExploreSection from './ExploreSection'
import HeroSection from './HeroSection'
import SaveIdeaSection from './SaveIdeaSection'
import SearchIdeaSection from './SearchIdeaSection'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { loginSuccess } from '../../store/slices/AuthSlice'
import { createAxios } from '../../createInstance'

const IntroContainer = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const user = useSelector((state) => state.Auth.login?.currentUser)

  let axiosJWT = createAxios(user, dispatch, loginSuccess)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [])

  return (
    <div>
      {/* <HeroSection /> */}
      <SearchIdeaSection />
      <SaveIdeaSection />
      <ExploreSection />
      <CTASection />
    </div>
  )
}

export default IntroContainer
