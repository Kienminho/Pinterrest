import React, { useEffect, useState, useRef } from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'
import routesConfig from '../../config/routes'
import { Football_Ideas, Fashion_Ideas, Food_Ideas, Cartoon_Ideas } from './Assets/constants'

import '../Intro/Assets/style_home.css'
import { Link } from 'react-router-dom'

const HeroSection = () => {
  // control which idea is currently being displayed
  const [index, setIndex] = useState(0)

  const ideas = [
    {
      idea: 'hình nền bóng đá',
      images: [
        { src: Football_Ideas[0], height: 40 },
        { src: Football_Ideas[1], height: 40 },
        { src: Football_Ideas[2], height: 40 },
        { src: Football_Ideas[3], height: 40 },
        { src: Football_Ideas[4], height: 40 }
      ]
    },
    {
      idea: 'phối đồ nam',
      images: [
        { src: Fashion_Ideas[0], height: 40 },
        { src: Fashion_Ideas[1], height: 40 },
        { src: Fashion_Ideas[2], height: 40 },
        { src: Fashion_Ideas[3], height: 40 },
        { src: Fashion_Ideas[4], height: 40 }
      ]
    },
    {
      idea: 'hoạt hình nhật bản',
      images: [
        { src: Cartoon_Ideas[0], height: 40 },
        { src: Cartoon_Ideas[1], height: 40 },
        { src: Cartoon_Ideas[2], height: 40 },
        { src: Cartoon_Ideas[3], height: 40 },
        { src: Cartoon_Ideas[4], height: 40 }
      ]
    },
    {
      idea: 'ý tưởng bữa tối',
      images: [
        { src: Food_Ideas[0], height: 40 },
        { src: Food_Ideas[1], height: 40 },
        { src: Food_Ideas[2], height: 40 },
        { src: Food_Ideas[3], height: 40 },
        { src: Food_Ideas[4], height: 40 }
      ]
    }
  ]

  // updates the index state variable when called with a new index.
  // This function is used to change the currently displayed idea when the user clicks on one of the dots below the idea name.
  const handleIdeas = (i) => {
    setIndex(i)
  }

  useEffect(() => {
    // updates the index state variable every 7 seconds
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % ideas.length)
    }, 7000)

    // The interval is cleared when the component is unmounted,
    return () => clearInterval(interval)
  }, [ideas.length])

  return (
    <div className='w-full h-[83vh] relative flex flex-col items-center justify-between text-center mt-40'>
      <div>
        <h1 className='text-6xl tracking-wide leading-none font-medium'>Xem ý tưởng tiếp theo </h1>
        <h1 className={`fade${index} tracking-wide leading-none mt-5 text-6xl font-medium`}>{ideas[index].idea}</h1>
      </div>
      <div className='flex items-center mt-4 mb-6 space-x-4'>
        {Array(4)
          .fill()
          .map((_, i) => (
            <div
              className={
                index === i
                  ? `bgfade${i} w-3 h-3 cursor-pointer rounded-full`
                  : 'bg-slate-300 w-3 h-3 cursor-pointer rounded-full'
              }
              key={i}
              onClick={() => handleIdeas(i)}
            ></div>
          ))}
      </div>
      <div className=' w-full h-[50vh] space-x-4 overflow-hidden mb-6 flex items-end justify-between '>
        {ideas[index].images.map((image, i) => (
          <div className={`w-[20%] h-[${image.height}px]`} key={image.src}>
            <img src={image.src} className={`w-full h-full object-cover image${i}`} alt={image.src} />
          </div>
        ))}
      </div>
      <div className='w-full relative'>
        <Link
          to={routesConfig.home}
          className='absolute bar z-10 h-16 right-0 left-0 bottom-0 flex items-center justify-center font-medium font-sans '
        >
          Đây là cách thức hoạt động
          <MdKeyboardArrowDown size='1.8rem' />
        </Link>
      </div>
      <div
        className={`w-12 h-12 animate-bounce cursor-pointer absolute top-[85%] left-[50%] mx-auto bgfade${index} flex items-center justify-center text-white rounded-full`}
      >
        <MdKeyboardArrowDown size='2.5rem' />
      </div>
    </div>
  )
}

export default HeroSection
