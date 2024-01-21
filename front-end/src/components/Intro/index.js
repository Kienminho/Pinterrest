// IntroPageContainer.jsx
import React from 'react'
import CTASection from './CTASection'
import ExploreSection from './ExploreSection'
import HeroSection from './HeroSection'
import SaveIdeaSection from './SaveIdeaSection'
import SearchIdeaSection from './SearchIdeaSection'

const IntroContainer = () => {
  return (
    <div>
      <HeroSection />
      <SearchIdeaSection />
      <SaveIdeaSection />
      <ExploreSection />
      <CTASection />
    </div>
  )
}

export default IntroContainer
