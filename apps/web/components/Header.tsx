import { HeaderOverlay } from '@/components/Views'
import { useState } from 'react'
import { Input } from '@/components/Html'
import { IoSearchSharp, IoChevronForwardSharp } from 'react-icons/io5'
import colors from 'tailwindcss/colors'

function SearchBar() {
  const displayState = useState('')
  const bg = 'bg-white'
  const shadow = 'shadow-md focus:shadow-none transition ease-out'
  return (
    <div className={`flex flex-row items-center mx-2 w-96 rounded-md border border-gray-200 ${shadow} ${bg}`}>
      <IoChevronForwardSharp color={colors.gray[400]} size={20} className='mx-4'/>
      <Input displayState={displayState} className={`flex-1 text-sm h-12 ${bg}`}/>
      <IoSearchSharp color={colors.gray[400]} size={20} className='mx-4'/>
    </div>
  )
}

export default function Header() {
  return (
    <HeaderOverlay>
      <SearchBar />
    </HeaderOverlay>
  )
}
