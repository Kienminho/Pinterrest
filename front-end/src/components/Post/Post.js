import React from 'react'
import './Post.css'
import { NavLink } from 'react-router-dom'
import SuspenseImg from '../SuspenseImg/SuspenseImg'
import { ProfileImage } from '../ProfileImage/ProfileImage'
import UpdatePost from '../UpdatePost/UpdatePost'

const Post = ({ data, type }) => {
  const { _id, Attachment, Created, Description, Title } = data
  const thumbnail = Attachment?.Thumbnail
  const avatar = Created?.Avatar
  const username = Created?.UserName || 'Stranger'
  const avatarAlt = 'https://static-images.vnncdn.net/files/publish/2023/6/30/mason-mount-1-228.jpg'

  return (
    <div className='post-container rounded-xl overflow-hidden mb-4 relative max-sm:mb-2'>
      <NavLink to={`/pin/${_id}`} className={'relative'}>
        <SuspenseImg className='w-full' src={thumbnail} fileName={avatar} alt={'error image'} height={360} />
      </NavLink>

      <div className='creator-container h-full absolute top-0 left-0 right-0 pointer-events-none'>
        <div className='absolute top-0 left-0 right-0 bottom-0 p-4 flex flex-col max-sm:p-2'>
          <div className='creator-profile flex w-full mt-auto items-center justify-between'>
            <div className={`flex gap-2 items-center w-full ${type === 'user-post' ? 'max-w-[80%]' : ''}`}>
              {/* avatar + username: goc duoi ben trai */}
              <div className='creator-image rounded-full w-7 aspect-square overflow-hidden opacity-80 shrink-0'>
                <ProfileImage src={avatar} alt={'picture'} />
              </div>
              <div className='creator-name text-white opacity-80  capitalize whitespace-nowrap overflow-hidden text-ellipsis'>
                {username}
              </div>
            </div>

            <UpdatePost id={_id} Description={Description} Title={Title} />

            {/* {type === 'user-post' && <DeletePost id={_id} />} */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
