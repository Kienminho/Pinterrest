const AuthLayout = ({ children }) => {
  // const { pathname } = useRouter()
  // const isProfilePage = pathname === '/auth/profile'

  return (
    <div className='w-screen relative'>
      <video
        src='/video.mp4'
        type='video/mp4'
        loop
        controls={false}
        autoPlay
        muted
        className='w-full h-svh object-fill'
      />
      <div className='absolute top-0 right-0 left-0 bottom-0 grid md:grid-cols-2 bg-black/50'>
        <div className='flex-center flex justify-around mt-[30%] -ml-[10%]'>
          <h1 className='text-4rem md:text-[3rem] lg:text-[4rem] md:leading-[5rem] leading-[3.5rem] font-bold text-[#dee2e6] max-w-[22rem] text-center'>
            Khám phá những ý tưởng mới
          </h1>
        </div>

        <div className=''>{children}</div>
      </div>
    </div>
  )
}

export default AuthLayout
