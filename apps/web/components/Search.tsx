import { useState } from 'react'
import { UseState } from '../types'

const Search = (props: {
  queryState: UseState<string>
  resultState: UseState<Object>
}) => {
  const setQuery = props.queryState[1]
  const [display, setDisplay] = useState('')
  const [result, setResult] = props.resultState
  async function handleQuery(value: string) {
    const upper = value.toUpperCase()
    setDisplay(value)
    if (upper.length > 0) {
      const res = await fetch(`/api/module/get/${upper}`)
      const data = await res.json()
      setResult(data)
    }
    setQuery(upper)
  }
  return (
    <div>
      <div className="text-gray-600">Search for a module:</div>
      <div className="flex flex-row">
        <input
          spellCheck={false}
          className="flex-1 rounded-md shadow-md py-1 px-2"
          value={display}
          onChange={(e) => handleQuery(e.target.value)}
        />
        <div className="w-2" />
        <button className="bg-blue-400 text-white py-1 px-2 rounded-md">
          do nothing
        </button>
      </div>
    </div>
  )
}

export default Search
