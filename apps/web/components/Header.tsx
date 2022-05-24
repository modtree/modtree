import { HeaderOverlay } from '@/components/Views'
import { useState } from 'react'

function SearchBar() {
  const [display, setDisplay] = useState('')
  return (
    <input
      spellCheck={false}
      className="px-4 w-96 h-12 mx-2 bg-white rounded-md border border-gray-200 focus:outline-none shadow-md focus:shadow-none transition ease-out"
      value={display}
      onChange={(e) => setDisplay(e.target.value)}
    />
  )
}

export default function Header() {
  return (
    <HeaderOverlay>
      <SearchBar />
    </HeaderOverlay>
  )
}
