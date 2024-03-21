import { NavLink } from 'react-router-dom'

export const FooterLayout = () => {
  return (
    <footer class='bg-gray-800 font-inter tracking-wide'>
      <div class='max-w-screen-xl px-4 pt-16 pb-6 mx-auto sm:px-6 lg:px-8 lg:pt-24'>
        <div class='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <div>
            <div class='flex justify-center text-blue-300 sm:justify-start'>
              <img src='./PLogo_circle.png' className='h-6 sm:h-9 rounded-full' alt='Flowbite React Logo' />
              <h2 class='self-center whitespace-nowrap font-semibold dark:text-white text-indigo-500 ml-1'>
                Pinspired
              </h2>
            </div>

            <p class='max-w-md mx-auto mt-6 leading-relaxed text-center text-gray-400 sm:max-w-xs sm:mx-0 sm:text-left'>
              Hãy sáng tạo, chia sẻ những điều tuyệt vời nhất của bạn với cộng đồng. Hãy để mọi người biết bạn là ai.
            </p>

            <ul class='flex justify-center gap-6 mt-8 md:gap-8 sm:justify-start'>
              <li>
                <a
                  href='/'
                  rel='noopener noreferrer'
                  target='_blank'
                  class='text-blue-500 transition hover:text-blue-500/75'
                >
                  <span class='sr-only'>Facebook</span>
                  <svg class='w-6 h-6' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                    <path
                      fill-rule='evenodd'
                      d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
                      clip-rule='evenodd'
                    />
                  </svg>
                </a>
              </li>

              <li>
                <a
                  href='/'
                  rel='noopener noreferrer'
                  target='_blank'
                  class='text-blue-500 transition hover:text-blue-500/75'
                >
                  <span class='sr-only'>GitHub</span>
                  <svg class='w-6 h-6' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                    <path
                      fill-rule='evenodd'
                      d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                      clip-rule='evenodd'
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          <div class='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 md:grid-cols-3'>
            <div class='text-center sm:text-left'>
              <p class='text-lg font-medium text-white'>Chính sách của chúng tôi</p>

              <nav class='mt-8'>
                <ul class='space-y-4 text-base text-white'>
                  <li>
                    <NavLink to={'/about'}>
                      <span class='text-white transition hover:text-white/75'>Pinspired là gì?</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={'/terms-of-service'}>
                      <span class='text-white transition hover:text-white/75'>Điều khoản dịch vụ</span>
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </div>

            <div class='text-center sm:text-left'>
              <p class='text-lg font-medium text-white'>Liên hệ</p>

              <ul class='mt-8 space-y-4 text-base'>
                <li>
                  <a class='flex items-center justify-center sm:justify-start gap-1.5 group' href='/'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      class='w-5 h-5 text-white shrink-0'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      stroke-width='2'
                    >
                      <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                      />
                    </svg>

                    <span class='text-white transition group-hover:text-white/75'>pltnhan311@gmail.com</span>
                  </a>
                </li>
                <li>
                  <a class='flex items-center justify-center sm:justify-start gap-1.5 group' href='/'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      class='w-5 h-5 text-white shrink-0'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      stroke-width='2'
                    >
                      <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                      />
                    </svg>

                    <span class='text-white transition group-hover:text-white/75'>hopkien@gmail.com</span>
                  </a>
                </li>

                <li>
                  <a class='flex items-center justify-center sm:justify-start gap-1.5 group' href='/'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      class='w-5 h-5 text-white shrink-0'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      stroke-width='2'
                    >
                      <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                      />
                    </svg>

                    <span class='text-white transition group-hover:text-white/75'>0123456789</span>
                  </a>
                </li>

                <li class='flex items-start justify-center gap-1.5 sm:justify-start'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    class='w-5 h-5 text-white shrink-0'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    stroke-width='2'
                  >
                    <path
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                    />
                    <path stroke-linecap='round' stroke-linejoin='round' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                  </svg>

                  <address class='-mt-0.5 not-italic text-white'>Tân Phong, Việt Nam</address>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class='pt-6 mt-12 border-t border-gray-800'>
          <div class='text-center sm:flex sm:justify-between sm:text-left'>
            <p class='mt-4 text-xl text-indigo-500 font-medium sm:order-first sm:mt-0'>&copy; Pinspired 2024</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
