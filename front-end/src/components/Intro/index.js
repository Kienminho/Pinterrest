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
import { Carousel } from 'flowbite-react'

const IntroContainer = () => {
  return (
    <div>
      <HeroSection />
      <div className='h-72 sm:h-64 xl:h-100 2xl:h-[44rem]'>
        <Carousel>
          <img src='https://pxwall.com/wp-content/uploads/2021/06/1920x1080-4k-Wallpaper.jpg' alt='...' />
          <img src='https://cdn.wallpapersafari.com/46/34/Mxjr2p.jpg' alt='...' />
          <img src='https://wallpapers.com/images/hd/food-4k-1pf6px6ryqfjtnyr.jpg' alt='...' />
          <img src='https://wallpapers.com/images/hd/black-car-4k-qgapc9ubvarvfmc7.jpg' alt='...' />
          <img src='https://wallpapergod.com/images/hd/car-4k-3840X2400-wallpaper-om5lbmwb8gdrmumw.jpeg' alt='...' />
        </Carousel>
      </div>
      <SearchIdeaSection />
      <SaveIdeaSection />
      <ExploreSection />
      <CTASection />
    </div>
  )
}

export default IntroContainer
