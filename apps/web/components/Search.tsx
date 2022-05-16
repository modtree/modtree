import { UseState } from '../types'

const Search = (props: { queryState: UseState<string> }) => {
  const [query, setQuery] = props.queryState
  return (
    <div>
      <div className="text-gray-600">Search for a module:</div>
      <input className='w-full' value={query} onChange={(e) => setQuery(e.target.value)} />
    </div>
  )
}

export default Search
