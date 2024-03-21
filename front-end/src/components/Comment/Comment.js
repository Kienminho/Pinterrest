import moment from 'moment'
import { ProfileImage } from '../ProfileImage/ProfileImage'

export const Comment = ({ comment, handleReplyClick }) => {
  const formatRelativeTime = (timestamp, now = moment()) => {
    const commentTime = moment(timestamp)
    const diffInMinutes = now.diff(commentTime, 'minutes')
    const diffInHours = now.diff(commentTime, 'hours')
    const diffInDays = now.diff(commentTime, 'days')

    return diffInMinutes < 60 ? `${diffInMinutes}m` : diffInHours < 24 ? `${diffInHours}h` : `${diffInDays}d`
  }
  return (
    <>
      <div className='comment__body flex gap-1.5'>
        <div className='creator-image rounded-full w-10 h-10 aspect-square overflow-hidden shrink-0 mt-1'>
          <ProfileImage src={comment.author.avatar} alt='strangers' />
        </div>
        <div className='creator-name comment__content flex flex-col text-white'>
          <div className='font-semibold'>{comment.author.name}</div>
          <div className='text-base '>{comment.content}</div>
        </div>
      </div>
      <div className='created-reply flex gap-5 px-16 -mt-1 items-center'>
        <div className='cursor-pointer text-[#b3b3b3] text-[15px]'>
          <div>{formatRelativeTime(comment.createdAt)}</div>
        </div>

        <div
          onClick={() => handleReplyClick(comment._id)}
          className='cursor-pointer text-[#b3b3b3] text-[15px] font-medium'
        >
          {'Phản hồi'}
        </div>
      </div>
    </>
  )
}
