import { HeaderOverlay } from '@/components/Views'
import { useState } from 'react'
import { Input } from '@/components/Html'

function SearchBar() {
  const displayState = useState('')
  const style =
    'text-sm px-4 w-96 h-12 mx-2 bg-white rounded-md border border-gray-200 focus:outline-none shadow-md focus:shadow-none transition ease-out'
  return <Input displayState={displayState} className={style} />
}

export default function Header() {
  return (
    <HeaderOverlay>
      <SearchBar />
    </HeaderOverlay>
  )
}
