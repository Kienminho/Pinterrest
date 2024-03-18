// IntroPageContainer.jsx
import React from 'react'
import { useFetchUserInfo } from '../../customHooks/useFetchUserInfo'
import CategoryPicker from './CategoryPicker'

const IntroContainer = () => {
  useFetchUserInfo()
  return (
    <div>
      <CategoryPicker />
    </div>
  )
}

export default IntroContainer
