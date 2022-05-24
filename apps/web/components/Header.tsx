import { HeaderOverlay } from '@/components/Views'
import { useState } from 'react'
import { Input } from '@/components/Html'

function SearchBar() {
  const displayState = useState('')
  return (
    <Input displayState={displayState} className="w-96"/>
  )
}

export default function Header() {
  return (
    <HeaderOverlay>
      <SearchBar />
    </HeaderOverlay>
  )
}
