import React, { useState, useEffect } from 'react'
import Angry from '../../assets/angry.svg'
import Laughing from '../../assets/laughing.svg'
import Like from '../../assets/like.svg'
import Sad from '../../assets/sad.svg'
import Soaked from '../../assets/soaked.svg'
import Love from '../../assets/love.svg'
import { getAllReactions } from '../../store/apiRequest'

const ReactionStats = ({ postData, accessToken_daniel, axiosJWT, active }) => {
  const [reactionStats, setReactionStats] = useState([])
  const [totalReactions, setTotalReactions] = useState(0)

  const reactionImages = {
    Like: Like,
    Love: Love,
    Angry: Angry,
    Sad: Sad,
    Soaked: Soaked,
    Laughing: Laughing
  }

  useEffect(() => {
    const getReactions = async () => {
      try {
        const res = await getAllReactions(1, 50, postData._id, accessToken_daniel, axiosJWT)
        if (res.statusCode === 200) {
          const reactions = res.data

          // Đếm số lượng phản ứng cho mỗi biểu tượng
          const counts = reactions.reduce((acc, reaction) => {
            acc[reaction.icon] = (acc[reaction.icon] || 0) + 1
            return acc
          }, {})

          const totalCount = reactions.length
          setTotalReactions(totalCount)

          // Chuyển đổi counts thành mảng để có thể sắp xếp
          const reactionCounts = Object.entries(counts)

          // Sắp xếp danh sách theo số lượng phản ứng giảm dần
          reactionCounts.sort((a, b) => b[1] - a[1])

          // Chỉ lấy tối đa 3 biểu tượng nhiều nhất
          const topReactions = reactionCounts.slice(0, 3)

          // Tạo danh sách phản ứng với số lượng tương ứng
          const reactionStats = topReactions.map(([icon, count]) => ({
            icon,
            count
          }))

          setReactionStats(reactionStats)
        }
      } catch (error) {
        console.log('Error getting reactions:', error)
      }
    }
    getReactions()
  }, [active])

  return (
    <div className='font-inter flex gap-1 justify-center items-center text-white'>
      {reactionStats.map((reaction, index) => (
        <div key={index} className='flex items-center gap-2'>
          <img src={reactionImages[reaction.icon]} alt={reaction.icon} className='w-5 h-5' />
        </div>
      ))}
      <span>{totalReactions}</span>
    </div>
  )
}

export default ReactionStats
