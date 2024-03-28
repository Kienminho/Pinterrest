import React, { useState } from 'react'
// import LikeIcon from '../assets/likeicon.png'
import Angry from '../../assets/angry.svg'
import Laughing from '../../assets/laughing.svg'
import Like from '../../assets/like.svg'
import Sad from '../../assets/sad.svg'
import Soaked from '../../assets/soaked.svg'
import Love from '../../assets/love.svg'
import { motion } from 'framer-motion'
import './FBReactions.css'

const FBReactions = ({ onReactionSelect, reactedType }) => {
  const [btnClicked, setBtnClicked] = useState(false)
  const [reaction, setReaction] = useState('')

  const reactionImages = {
    Like: Like,
    Love: Love,
    Angry: Angry,
    Sad: Sad,
    Soaked: Soaked,
    Laughing: Laughing
  }

  const list = {
    visible: {
      opacity: 1,
      transition: {
        when: 'afterChildren',
        staggerChildren: 0.2
      }
    },
    hidden: {
      opacity: 0,
      transition: {
        when: 'beforeChildren'
      },
      scale: 0.6
    }
  }

  const handleOnClick = (e) => {
    const newReaction = e.target.name
    setReaction(newReaction)
    setBtnClicked(false)
    onReactionSelect(newReaction)
  }

  console.log(reaction)

  return (
    <motion.div className='parentDiv' onClick={() => btnClicked === true && setBtnClicked(false)}>
      <motion.div className='reactionsHolder' variants={list} animate={btnClicked ? 'visible' : 'hidden'}>
        {Object.keys(reactionImages).map((reactionName) => (
          <motion.img
            key={reactionName}
            whileHover={{ scale: 1.5 }}
            src={reactionImages[reactionName]}
            alt={reactionName}
            name={reactionName}
            width='30'
            onClick={handleOnClick}
          />
        ))}
      </motion.div>
      <motion.button whileHover={{ scale: 1.2 }} className='likeBtn' onClick={() => setBtnClicked(true)}>
        <motion.img
          src={
            reactionImages[reaction] // Nếu đã có reaction, hiển thị reaction
              ? reactionImages[reaction]
              : reactedType // Nếu không có reaction nhưng đã có reaction đã được chọn từ trước, hiển thị reaction đó
                ? reactionImages[reactedType]
                : reactionImages['Like'] // Nếu cả hai đều không có, mặc định hiển thị reaction 'Like'
          }
          // width='35'
        />
      </motion.button>
    </motion.div>
  )
}

export default FBReactions
