import React from 'react'

const SearchIdeaSection = () => {
  return (
    <div className='w-full h-[100vh] bar flex items-center justify-between pt-4 text-rose-700 bg-amber-200'>
      <div className='w-5/12 h-5/6 relative flex items-center justify-center flex-col'>
        <div className='div w-[190px] h-[240px] z-10 top-10 right-[170px] absolute rounded-[50px] bg-emerald-500'>
          {/* <img src={} alt='' className='w-full h-full object-cover'/> */}
        </div>
        <div className='div w-[180px] h-[260px] z-20 right-[150px] bottom-12 absolute rounded-[50px] bg-cyan-600'>
          {/* <img src={} alt='' className='w-full h-full object-cover'/> */}
        </div>
        <div className='w-[320px] h-[455px] z-30 absolute rounded-[50px] bg-yellow-400'>
          {/* <img src={} alt='' className='w-full h-full object-cover'/> */}
        </div>
        <div className='div w-[220px] h-[300px] z-20 absolute rounded-[50px] top-[180px] left-24 bg-red-200'>
          {/* <img src={} alt='' className='w-full h-full object-cover'/> */}
        </div>
      </div>
      <div className='w-7/12 h-5/6 flex items-center justify-center flex-col space-y-8'>
        <h1 className='font-bold leading-none whitespace-nowrap text-[60px] text-center'>Tìm kiếm ý tưởng</h1>
        <p className='font-sans leading-relaxed text-center tracking-normal font-normal text-[22px]'>
          Bạn muốn thử điều gì tiếp theo?
          <br />
          Hãy nghĩ về ý tưởng bạn yêu thích như
          <br />
          "bữa tối với món gà dễ làm" - và xem bạn tìm thấy gì. <b />
        </p>
        <button className='bg-rose-600 hover:bg-rose-700 px-4 py-2.5 font-semibold rounded-full text-white'>
          Đăng ký
        </button>
      </div>
    </div>
  )
}

export default SearchIdeaSection
