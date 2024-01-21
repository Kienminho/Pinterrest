import React from 'react'
import Tippy from '@tippyjs/react/headless'
import { Wrapper as PopperWrapper } from '../../Popper/'
import MenuItem from './MenuItem'

export default function Menu({ children, items = [], hideOnClick = false }) {
  const renderItems = () => {
    return items.map((item, index) => <MenuItem key={index} data={item} />)
  }

  return (
    <Tippy
      interactive
      delay={[0, 700]}
      offset={[12, 8]}
      hideOnClick={hideOnClick}
      render={(attrs) => (
        <div className='w-[250px]' tabIndex='-1' {...attrs}>
          <PopperWrapper>{renderItems()}</PopperWrapper>
        </div>
      )}
    >
      {children}
    </Tippy>
  )
}
