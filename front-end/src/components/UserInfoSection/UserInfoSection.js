import React from 'react'
import { Button } from 'flowbite-react'
import ProfileImage from '../ProfileImage/ProfileImage' // Import component ProfileImage nếu có

export const UserInfoSection = ({ user, postData, followers, isCurrentUser, isFollowing, handleFollowToggle }) => {
  return (
    <div className='creator-profile flex w-full items-center mt-auto gap-3'>
      <div className='creator-image rounded-full w-14 aspect-square overflow-hidden shrink-0'>
        {user ? (
          <ProfileImage src={postData?.Created?.Avatar} />
        ) : (
          <ProfileImage
            src='https://static-images.vnncdn.net/files/publish/2023/6/30/mason-mount-1-228.jpg'
            alt='stranger'
            className='w-full'
          />
        )}
      </div>
      <div className='creator-name whitespace-nowrap overflow-hidden text-ellipsis flex flex-col text-dark_color'>
        <div className='font-semibold'>{postData?.Created?.UserName}</div>
        <div className=''>{followers.length} người theo dõi</div>
      </div>
      {/* Nếu là người dùng hiện tại, ẩn nút "Theo dõi" */}
      {!isCurrentUser && (
        <div className='creator-follow ml-auto'>
          <Button color='blue' className='rounded-full px-1 py-1.5' onClick={handleFollowToggle}>
            <span className='text-base'>{isFollowing ? 'Bỏ theo dõi' : 'Theo dõi'}</span>
          </Button>
        </div>
      )}
    </div>
  )
}
