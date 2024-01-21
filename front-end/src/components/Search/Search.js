import React, { useEffect, useRef, useState } from 'react'
import * as searchService from '../../apiServices/searchService'
import { useDebounce } from '../../hooks'
import AccountItem from '../AccountItem'
import { Wrapper as PopperWrapper } from '../Popper'
import { IoIosCloseCircle } from 'react-icons/io'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import TippyHeadless from '@tippyjs/react/headless'

export default function Search() {
  const [searchValue, setSearchValue] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [showResult, setShowResult] = useState(true)
  const [loading, setLoading] = useState(false)

  const debounced = useDebounce(searchValue, 500)
  const inputRef = useRef()

  useEffect(() => {
    if (!debounced.trim()) {
      setSearchResult([])
      return
    }

    const fetchApi = async () => {
      setLoading(true)

      const result = await searchService.search(debounced)
      setSearchResult(result)

      setLoading(false)
    }

    fetchApi()
  }, [debounced])

  const handleClear = () => {
    setSearchValue('')
    setSearchResult([])
    inputRef.current.focus()
  }

  const handleHideResult = () => {
    setShowResult(false)
  }

  const handleChange = (e) => {
    const searchValue = e.target.value
    if (!searchValue.startsWith(' ')) {
      setSearchValue(searchValue)
    }
  }

  return (
    <TippyHeadless
      interactive
      visible={showResult && searchResult.length > 0}
      render={(attrs) => (
        <div className='w-[1100px]' tabIndex='-1' {...attrs}>
          <PopperWrapper>
            <h4 className='px-3 py-2 font-semibold text-xl text-gray-400'>Accounts</h4>
            {searchResult.map((result) => (
              <AccountItem key={result.id} data={result} />
            ))}
          </PopperWrapper>
        </div>
      )}
      onClickOutside={handleHideResult}
    >
      <div>
        <label for='default-search' class='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'>
          Search
        </label>
        <div class='relative'>
          <div class='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
            <svg
              class='w-4 h-4 text-gray-500 dark:text-gray-400'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 20 20'
            >
              <path
                stroke='currentColor'
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
              />
            </svg>
          </div>
          <input
            class='w-full md:w-[1200px] p-[0.7rem] ps-10 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder='Search accounts and photos, videos'
            spellCheck={false}
            ref={inputRef}
            value={searchValue}
            onChange={handleChange}
            onFocus={() => setShowResult(true)}
            required
          />
          <button
            class='absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-l-md hover:bg-gray-200 focus:outline-none rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            onMouseDown={(e) => e.preventDefault()}
          >
            <svg class='h-5 w-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M14.795 13.408l5.204 5.204a1 1 0 01-1.414 1.414l-5.204-5.204a7.5 7.5 0 111.414-1.414zM8.5 14A5.5 5.5 0 103 8.5 5.506 5.506 0 008.5 14z'
              />
            </svg>
          </button>
          {searchValue && !loading && (
            <button className='absolute end-16 top-1 hover:bg-slate-300 rounded-full p-2' onClick={handleClear}>
              <IoIosCloseCircle size='1.5rem' />
            </button>
          )}
          {loading && <AiOutlineLoading3Quarters className='absolute end-20 top-4 animate-spin' />}
        </div>
      </div>
    </TippyHeadless>
  )
}
