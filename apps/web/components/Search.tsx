import { useState } from 'react'
import { UseState } from '../types'

const Search = (props: { queryState: UseState<string> }) => {
  const setQuery = props.queryState[1]
  const [display, setDisplay] = useState('')
  function handleQuery(value: string) {
    const upper = value.toUpperCase()
    setDisplay(value)
    setQuery(upper)
  }
  return (
    <div>
      <div className="text-gray-600">Search for a module:</div>
      <input className='w-full' value={display} onChange={(e) => handleQuery(e.target.value)} />
    </div>
  )
}

export default Search
