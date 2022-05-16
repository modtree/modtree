import { Dispatch, SetStateAction, useState } from 'react'

const Search = (props: {
  setQuery: Dispatch<SetStateAction<string>>
  setResults: Dispatch<SetStateAction<string[]>>
}) => {
  const [display, setDisplay] = useState('')

  async function handleQuery(value: string) {
    const upper = value.toUpperCase()
    const backend = process.env.NEXT_PUBLIC_BACKEND
    const url = `${backend}/modules/${upper}`
    console.log('querying url:', url)
    fetch(url).then((res) => {
      console.log('got here', res)
      res.json().then((json) => {
        console.log('received', json.result)
        props.setResults(json.result.map((x) => x.moduleCode))
      })
    })
    setDisplay(value)
    if (upper.length > 0) {
      console.log('upper:', upper)
    }
    props.setQuery(upper)
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
