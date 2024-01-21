import React from 'react'

const ExploreSection = () => {
  return (
    <div className='w-full h-[100vh] bg-light_explore flex items-center justify-center'>
      <div className='w-1/2 h-full relative flex items-center justify-center p-2 text-[#006b6c]'>
        <div className='w-full h-full absolute bg-slate-400'></div>
      </div>
      <div className='w-1/2 h-full flex items-center justify-center flex-col space-y-5 text-dark_explore'>
        <h1 className='font-bold font-sans leading-none whitespace-nowrap text-[60px] text-center'>
          Xem, làm, thử, thực hiện
        </h1>
        <p className='font-sans leading-relaxed text-center tracking-normal font-normal text-[22px]'>
          Điều tuyệt nhất trên Pinterest là khám
          <br /> phá những nội dung và ý tưởng mới <br /> từ mọi người khắp thế giới.
        </p>
        <button className='bg-dark_explore px-6 py-2.5 text-light_sid font-semibold rounded-full'>Khám phá</button>
      </div>
    </div>
  )
}

export default ExploreSection
