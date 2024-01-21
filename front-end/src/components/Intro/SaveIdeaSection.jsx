import React from 'react'

const SaveIdeaSection = () => {
  return (
    <div className='w-full h-[100vh] bg-light_sid flex items-center justify-center'>
      <div className='w-1/2 h-full flex items-center justify-center flex-col space-y-5 text-dark_sid'>
        <h1 className='font-bold font-sans leading-none whitespace-nowrap text-[60px] text-center'>
          Lưu ý tưởng bạn thích
        </h1>
        <p className='font-sans leading-relaxed text-center tracking-normal font-normal text-[22px]'>
          Thu thập nội dung bạn yêu thích <br /> để có thể quay lại xem sau.
        </p>
        <button className='bg-dark_sid px-6 py-2.5 text-light_sid font-semibold rounded-full'>Khám phá</button>
      </div>
      <div className='w-1/2 h-full relative flex items-center justify-center p-2 text-[#006b6c]'>
        <div className='w-96 h-96 absolute flex items-center justify-center text-[#fff] text-left font-semibold p-4 text-5xl top-10 left-0 bg-orange-500 rounded-[50px]'>
          <p className='text-center'>Trang trí nhà cửa</p>
        </div>
        <div className='w-52 h-52 absolute flex items-center  text-[#fff] text-left p-4 text-2xl font-medium top-16 right-44 bg-fuchsia-500 rounded-[50px]'>
          <p className='text-center'>Hình nền máy tính</p>
        </div>
        <div className='w-44 h-48 absolute flex items-center text-[#fff] text-left py-8 px-4 text-xl font-medium right-56 bg-sky-500 rounded-[50px]'>
          <p className='text-center'>Hình nền máy tính</p>
        </div>
        <div className='w-56 h-56 absolute flex items-center justify-center text-[#fff] text-left p-4 font-medium text-3xl bottom-24 left-32 bg-green-600 rounded-[50px]'>
          <p className='text-center'>Hình nền máy tính</p>
        </div>
        <div className='w-52 h-52 absolute flex items-center justify-center text-[#fff] text-left p-4 font-medium text-3xl bottom-5 right-52 bg-violet-400 rounded-[50px]'>
          <p className='text-center'>Hình nền máy tính</p>
        </div>
      </div>
    </div>
  )
}

export default SaveIdeaSection
