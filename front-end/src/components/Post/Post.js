import React from 'react'
import './Post.css'
import { NavLink } from 'react-router-dom'
import SuspenseImg from '../SuspenseImg/SuspenseImg'
import { ProfileImage } from '../ProfileImage/ProfileImage'

const Post = ({ data, type }) => {
  console.log(data)
  const { _id, Attachment, Created } = data
  // console.log(_id)
  // console.log(Attachment)
  // console.log(Created)
  const thumbnail = Attachment?.Thumbnail
  const userInfo = Created?.UserName || 'Stranger'
  const srcAvatar = 'https://static-images.vnncdn.net/files/publish/2023/6/30/mason-mount-1-228.jpg'
  const userPic = true

  return (
    <div className='post-container rounded-xl overflow-hidden mb-4 relative max-sm:mb-2'>
      <NavLink to={`/pin/${_id}`} className={'relative '}>
        <SuspenseImg className='w-full' src={thumbnail} fileName={srcAvatar} alt={'error image'} height={360} />
      </NavLink>

      <div className='creator-container h-full absolute top-0 left-0 right-0 pointer-events-none'>
        <div className='absolute top-0 left-0 right-0 bottom-0 p-4 flex flex-col max-sm:p-2'>
          <div className='creator-profile flex  w-full mt-auto  items-center justify-between'>
            <div className={`flex gap-2 items-center w-full  ${type === 'user-post' ? 'max-w-[80%]' : ''}`}>
              {/* avatar + username: goc duoi ben trai */}
              <div className='creator-image rounded-full w-7 aspect-square overflow-hidden opacity-80 shrink-0'>
                {userPic ? (
                  <ProfileImage src={srcAvatar} alt={'picture'} />
                ) : (
                  <ProfileImage
                    src='https://www.shareicon.net/data/512x512/2016/05/24/770117_people_512x512.png'
                    alt={'picture'}
                    className='w-full'
                  />
                )}
              </div>
              <div className=' creator-name text-white opacity-80  capitalize whitespace-nowrap overflow-hidden text-ellipsis'>
                {userInfo}
              </div>
            </div>
            {/* {type === 'user-post' && <DeletePost id={_id} />} */}
          </div>
          {/* )} */}
        </div>
        {/* </div> */}
      </div>
    </div>
  )
}

export default Post
